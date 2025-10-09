'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Building2 } from 'lucide-react';

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Conta Criada com Sucesso!
            </CardTitle>
            <CardDescription className="text-lg mt-3">
              Sua conta foi registrada no sistema
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações sobre próximos passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  Próximos Passos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Sua conta foi criada com sucesso, mas ainda precisa ser ativada pela equipe de administração.
                </p>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Para ativar sua conta:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Entre em contato com a <strong>equipe de marketing Lopes Marista</strong></li>
                <li>Informe que você criou uma conta como corretor</li>
                <li>Aguarde a validação e ativação da sua conta</li>
                <li>Você receberá uma confirmação quando sua conta estiver ativa</li>
              </ol>
            </div>

            <div className="border-t border-blue-200 pt-4">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Importante:</strong> Você só poderá fazer login após sua conta ser ativada.
                </p>
                <p className="text-sm text-gray-600">
                  A ativação é feita manualmente pela equipe de administração para garantir a segurança do sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Informações sobre permissões */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  Como Corretor, Você Poderá:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Criar novas propriedades (aguardando aprovação do admin)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Editar e excluir apenas suas próprias propriedades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Visualizar todas as propriedades do painel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Gerenciar leads dos seus imóveis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1 h-12 text-base font-semibold">
              <Link href="/admin/login">
                Ir para Login
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12 text-base font-semibold">
              <Link href="/">
                Voltar para o Site
              </Link>
            </Button>
          </div>

          {/* Contato */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Dúvidas? Entre em contato com nossa equipe de suporte
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

