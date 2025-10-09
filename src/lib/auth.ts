import { compare, hash } from 'bcryptjs';

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

// Session simples com cookies
export function createSession(user: any) {
  const session = { userId: user.id, role: user.role };
  // Implemente com cookies ou JWT
  return session;
}

// Sistema de autenticação simplificado
export class AuthService {
  private static currentUser: any = null;

  // Login com banco de dados
  static async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        this.currentUser = user;
        this.saveUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return null;
    }
  }

  // Logout
  static logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  }

  // Obter usuário atual
  static getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      // Tentar obter do cookie primeiro
      const cookies = document.cookie.split(';');
      const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('user-session='));
      
      if (sessionCookie) {
        try {
          const sessionData = sessionCookie.split('=')[1];
          const decoded = decodeURIComponent(sessionData);
          const user = JSON.parse(decoded);
          this.currentUser = user;
          return user;
        } catch (error) {
          console.error('Erro ao decodificar sessão:', error);
        }
      }
      
      // Fallback para localStorage
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
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
  static getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  // Salvar usuário no localStorage
  static saveUser(user: any): void {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }
}
