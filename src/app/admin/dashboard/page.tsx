'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Edit, Trash2, LogOut } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import PropertyFormUnified from '@/components/admin/PropertyFormUnified';
import { Property } from '@/types/property';

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('properties');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }
    setUser(currentUser);
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    router.push('/admin/login');
  };

  const handlePropertySuccess = () => {
    setEditingProperty(null);
    loadProperties();
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta propriedade?')) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadProperties();
      }
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard - {user.name}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">({user.role})</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Propriedades</h2>
              <Button 
                onClick={() => setEditingProperty({})}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Propriedade
              </Button>
            </div>

            {editingProperty && (
              <PropertyFormUnified 
                property={editingProperty}
                user={user}
                onSubmit={handlePropertySuccess}
                onCancel={() => setEditingProperty(null)}
                mode={editingProperty.id ? 'edit' : 'create'}
              />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      R$ {property.price?.toLocaleString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {property.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingProperty(property)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <h2 className="text-2xl font-bold mb-6">Leads</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">Sistema de leads em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
