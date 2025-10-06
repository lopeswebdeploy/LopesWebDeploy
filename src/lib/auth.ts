import { User, AuthUser } from '@/types/user';

// Simulação de autenticação (substituir por NextAuth ou similar)
export class AuthService {
  private static currentUser: AuthUser | null = null;

  // Login (simulado)
  static async login(email: string, password: string): Promise<AuthUser | null> {
    // TODO: Implementar autenticação real
    // Por enquanto, simular login
    if (email === 'admin@lopes.com' && password === 'admin123') {
      this.currentUser = {
        id: 'admin-1',
        email: 'admin@lopes.com',
        name: 'Admin Master',
        role: 'admin'
      };
      return this.currentUser;
    }
    
    if (email === 'corretor@lopes.com' && password === 'corretor123') {
      this.currentUser = {
        id: 'corretor-1',
        email: 'corretor@lopes.com',
        name: 'João Corretor',
        role: 'corretor'
      };
      return this.currentUser;
    }

    return null;
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
