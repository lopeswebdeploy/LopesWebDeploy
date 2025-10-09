'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, Phone, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function InactiveUserPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-orange-800">
              Conta Pendente de Ativação
            </CardTitle>
            <CardDescription className="text-base mt-2 text-orange-700">
              Sua conta foi criada com sucesso, mas ainda não foi ativada
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Próximos Passos
            </h3>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Entre em contato com a equipe de marketing da Lopes Marista</li>
              <li>• Informe seu nome completo e email cadastrado</li>
              <li>• Aguarde a ativação da sua conta</li>
              <li>• Você receberá um email de confirmação</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Contatos da Equipe:</h3>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p className="text-sm text-gray-600">marketing@lopesmarista.com.br</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Telefone</p>
                <p className="text-sm text-gray-600">(62) 99999-9999</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button
              onClick={() => window.location.href = '/admin/login'}
              className="w-full"
              variant="outline"
            >
              Tentar Login Novamente
            </Button>
            
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                ← Voltar para o Site
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Lopes Imóveis - Sistema de Gestão de Propriedades</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
