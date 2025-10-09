"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Database, Trash2, RefreshCw } from "lucide-react";
import { PropertyService } from "@/services/propertyService";

const BackupManager = () => {
  const [importData, setImportData] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/properties');
      const properties = await response.json();
      const data = JSON.stringify(properties, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lopes-imoveis-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erro ao exportar dados!');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      alert('Por favor, cole os dados JSON para importar');
      return;
    }

    setIsImporting(true);
    try {
      const data = JSON.parse(importData);
      // Aqui você pode implementar a lógica de importação
      alert('Funcionalidade de importação será implementada em breve.');
    } catch (error) {
      alert('Erro ao importar dados! Verifique o formato JSON.');
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ ATENÇÃO: Isso irá apagar TODAS as propriedades!\n\nTem certeza que deseja continuar?\n\nRecomendamos fazer um backup antes.')) {
      // Aqui você pode implementar a lógica de limpeza
      alert('Funcionalidade de limpeza será implementada em breve.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup e Restauração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export */}
          <div className="space-y-3">
            <Label className="text-lg font-medium">📥 Exportar Dados (Backup)</Label>
            <p className="text-sm text-gray-600">
              Baixe um arquivo JSON com todas as suas propriedades para backup.
            </p>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Baixar Backup'}
            </Button>
          </div>

          <hr className="my-6" />

          {/* Import */}
          <div className="space-y-3">
            <Label className="text-lg font-medium">📤 Importar Dados (Restaurar)</Label>
            <p className="text-sm text-gray-600">
              Restaure dados de um backup anterior. Isso irá substituir todos os dados atuais.
            </p>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="file-import">Importar de arquivo</Label>
                <Input
                  id="file-import"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manual-import">Ou cole o JSON manualmente</Label>
                <textarea
                  id="manual-import"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Cole o conteúdo do arquivo JSON aqui..."
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                />
              </div>

              <Button 
                onClick={handleImport} 
                disabled={isImporting || !importData.trim()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importando...' : 'Restaurar Dados'}
              </Button>
            </div>
          </div>

          <hr className="my-6" />

          {/* Clear All */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-red-600">🗑️ Limpar Todos os Dados</Label>
            <p className="text-sm text-gray-600">
              <strong>⚠️ PERIGO:</strong> Isso irá apagar permanentemente todas as propriedades.
              Recomendamos fazer um backup antes.
            </p>
            <Button 
              onClick={handleClearAll}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Todos os Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Dicas de Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ <strong>Faça backup regularmente:</strong> Recomendamos exportar os dados semanalmente</p>
            <p>✅ <strong>Guarde em locais seguros:</strong> Dropbox, Google Drive, ou outro serviço de nuvem</p>
            <p>✅ <strong>Teste os backups:</strong> Certifique-se de conseguir restaurar os dados</p>
            <p>✅ <strong>Migração futura:</strong> Estes arquivos facilitarão a migração para banco de dados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;
