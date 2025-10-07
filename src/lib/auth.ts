import { User, AuthUser } from '@/types/user';
import { Database } from './database';

// Sistema de autenticação com banco de dados
export class AuthService {
  private static currentUser: AuthUser | null = null;

  // Login com banco de dados
  static async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      // Buscar usuário no banco de dados
      const user = await Database.getUserByEmail(email);
      
      if (!user) {
        console.log('❌ Usuário não encontrado:', email);
        return null;
      }
      
      if (!user.isActive) {
        console.log('❌ Usuário inativo:', email);
        return null;
      }
      
      // Verificar senha (simulação - em produção usar hash)
      const validPassword = this.validatePassword(email, password);
      if (!validPassword) {
        console.log('❌ Senha inválida para:', email);
        return null;
      }
      
      // Converter para AuthUser
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'corretor'
      };
      
      this.currentUser = authUser;
      this.saveUser(authUser);
      console.log('✅ Login bem-sucedido:', user.name, user.role);
      return authUser;
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return null;
    }
  }
  
  private static validatePassword(email: string, password: string): boolean {
    // Senhas padrão para desenvolvimento
    const defaultPasswords: { [key: string]: string } = {
      'admin@lopes.com': 'admin123',
      'corretor@lopes.com': 'corretor123',
    };
    
    return defaultPasswords[email] === password;
  }

  // Logout
  static logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  }

  // Obter usuário atual
  static getCurrentUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  // Verificar se é admin
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Verificar se é corretor
  static isCorretor(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'corretor';
  }

  // Obter ID do usuário atual
  static getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  // Salvar usuário no localStorage
  static saveUser(user: AuthUser): void {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  // Verificar se pode acessar propriedade
  static canAccessProperty(propertyOwnerId?: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Admin pode acessar todas
    if (user.role === 'admin') return true;
    
    // Corretor só pode acessar suas próprias
    if (user.role === 'corretor') {
      return propertyOwnerId === user.id;
    }
    
    return false;
  }
}
