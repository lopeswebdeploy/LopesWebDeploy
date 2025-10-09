'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Shield, 
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { User } from '@prisma/client';
import { Database } from '@/lib/database';
import { AuthUser } from '@/types/user';

interface UserManagementProps {
  currentUser: AuthUser;
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'corretor'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Carregar usuários
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await Database.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.active) ||
                         (filterStatus === 'inactive' && !user.active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Ativar/Desativar usuário
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Aqui você implementaria a API para atualizar o status
      console.log(`Alterando status do usuário ${userId} para ${!currentStatus}`);
      // await Database.updateUserStatus(userId, !currentStatus);
      // loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
    }
  };

  // Alterar role do usuário
  const changeUserRole = async (userId: string, newRole: 'admin' | 'corretor') => {
    try {
      console.log(`Alterando role do usuário ${userId} para ${newRole}`);
      // await Database.updateUserRole(userId, newRole);
      // loadUsers(); // Recarregar lista
    } catch (error) {
      console.error('❌ Erro ao alterar role:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-red-100 text-red-800">Admin Master</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Corretor</Badge>;
  };

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h2>
          <p className="text-gray-600">Gerencie contas de administradores e corretores</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role">Função</Label>
              <select
                id="role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Todas</option>
                <option value="admin">Admin Master</option>
                <option value="corretor">Corretor</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={loadUsers}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    {/* {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                    )} */}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.active)}
                    </div>
                    <p className="text-xs text-gray-500">
                      Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Ativar/Desativar */}
                    <Button
                      size="sm"
                      variant={user.active ? "destructive" : "default"}
                      onClick={() => toggleUserStatus(user.id.toString(), user.active)}
                      title={user.active ? "Desativar usuário" : "Ativar usuário"}
                    >
                      {user.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    
                    {/* Alterar Role */}
                    {user.role === 'corretor' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeUserRole(user.id.toString(), 'admin')}
                        title="Promover a Admin"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeUserRole(user.id.toString(), 'corretor')}
                        title="Rebaixar a Corretor"
                      >
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou criar um novo usuário.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-gray-600">Total de Usuários</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-sm text-gray-600">Admin Masters</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <ShieldCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{users.filter(u => u.role === 'corretor').length}</p>
            <p className="text-sm text-gray-600">Corretores</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{users.filter(u => u.active).length}</p>
            <p className="text-sm text-gray-600">Usuários Ativos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
