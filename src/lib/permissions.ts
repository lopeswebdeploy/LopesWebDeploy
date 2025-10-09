import { AuthUser } from '@/types/user';
import React from 'react';

export type Permission = 
  | 'property.create'
  | 'property.read'
  | 'property.update'
  | 'property.delete'
  | 'property.feature'
  | 'property.visibility'
  | 'image.upload'
  | 'image.delete'
  | 'lead.read'
  | 'lead.create'
  | 'user.manage'
  | 'admin.access';

export class PermissionService {
  /**
   * Verifica se o usuário tem uma permissão específica
   */
  static hasPermission(user: AuthUser | null, permission: Permission): boolean {
    if (!user) return false;

    // Admin tem todas as permissões
    if (user.role === 'admin') {
      return true;
    }

    // Permissões específicas para corretor
    if (user.role === 'corretor') {
      const corretorPermissions: Permission[] = [
        'property.create',
        'property.read',
        'property.update',
        'property.delete',
        'image.upload',
        'image.delete',
        'lead.read',
        'lead.create'
      ];
      
      return corretorPermissions.includes(permission);
    }

    return false;
  }

  /**
   * Verifica se o usuário pode acessar uma propriedade específica
   */
  static canAccessProperty(
    user: AuthUser | null, 
    propertyOwnerId?: string, 
    action: 'read' | 'update' | 'delete' = 'read'
  ): boolean {
    if (!user) return false;

    // Admin pode acessar todas as propriedades
    if (user.role === 'admin') {
      return true;
    }

    // Corretor só pode acessar suas próprias propriedades
    if (user.role === 'corretor') {
      return propertyOwnerId === user.id.toString();
    }

    return false;
  }

  /**
   * Verifica se o usuário pode gerenciar outros usuários
   */
  static canManageUsers(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'user.manage');
  }

  /**
   * Verifica se o usuário pode acessar o painel admin
   */
  static canAccessAdmin(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'admin.access');
  }

  /**
   * Verifica se o usuário pode destacar propriedades
   */
  static canFeatureProperty(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'property.feature');
  }

  /**
   * Verifica se o usuário pode alterar visibilidade de propriedades
   */
  static canChangeVisibility(user: AuthUser | null): boolean {
    return this.hasPermission(user, 'property.visibility');
  }

  /**
   * Obtém todas as permissões do usuário
   */
  static getUserPermissions(user: AuthUser | null): Permission[] {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        'property.create',
        'property.read',
        'property.update',
        'property.delete',
        'property.feature',
        'property.visibility',
        'image.upload',
        'image.delete',
        'lead.read',
        'lead.create',
        'user.manage',
        'admin.access'
      ];
    }

    if (user.role === 'corretor') {
      return [
        'property.create',
        'property.read',
        'property.update',
        'property.delete',
        'image.upload',
        'image.delete',
        'lead.read',
        'lead.create'
      ];
    }

    return [];
  }

  /**
   * Verifica se o usuário pode realizar uma ação específica em um recurso
   */
  static canPerformAction(
    user: AuthUser | null,
    resource: 'property' | 'image' | 'lead' | 'user',
    action: 'create' | 'read' | 'update' | 'delete',
    resourceOwnerId?: string
  ): boolean {
    const permission = `${resource}.${action}` as Permission;
    
    if (!this.hasPermission(user, permission)) {
      return false;
    }

    // Para ações que não são de leitura, verificar se é o dono do recurso
    if (action !== 'read' && action !== 'create' && resourceOwnerId && user) {
      return this.canAccessProperty(user, resourceOwnerId, action as 'update' | 'delete');
    }

    return true;
  }

  /**
   * Middleware para verificar permissões em componentes
   * TODO: Implementar quando necessário
   */
  static withPermission<T extends React.ComponentType<any>>(
    Component: T,
    requiredPermission: Permission
  ): T {
    return Component; // Simplificado por enquanto
  }

  /**
   * Hook para verificar permissões em componentes
   */
  static usePermission(user: AuthUser | null, permission: Permission): boolean {
    return this.hasPermission(user, permission);
  }
}
