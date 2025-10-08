"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, Download, Upload, Trash, Search, Filter, Star, EyeOff, LogOut, User } from "lucide-react";
import { AuthService } from "@/lib/auth";
import PropertyFormUnified from "@/components/admin/PropertyFormUnified";
import PropertyPreview from "@/components/admin/PropertyPreview";
import BackupManager from "@/components/admin/BackupManager";
import { Property } from "@/types/property";
import { PropertyService } from "@/services/propertyService";

const Admin = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [currentTab, setCurrentTab] = useState("properties");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  // Carregar propriedades do banco de dados
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const loadedProperties = await PropertyService.loadProperties();
        console.log("🔍 Admin - Propriedades carregadas:", loadedProperties.length);
        
        // Debug detalhado de cada propriedade
        loadedProperties.forEach((prop, index) => {
          console.log(`🔍 Admin - Propriedade ${index + 1}:`, {
            title: prop.title,
            bannerImage: prop.images?.[0] ? `${prop.images[0].substring(0, 50)}...` : 'VAZIO',
            images: prop.images?.length || 0,
            imagesArray: prop.images,
            photoGallery: prop.photoGallery?.length || 0,
            photoGalleryArray: prop.photoGallery,
            floorPlan: prop.images?.find(img => img.includes('floorplan')) ? `${prop.images.find(img => img.includes('floorplan'))?.substring(0, 50)}...` : 'VAZIO'
          });
        });
        
        setProperties(loadedProperties);
        setFilteredProperties(loadedProperties);
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
        // Fallback para dados de exemplo
        const fallbackProperties = PropertyService.loadPropertiesSync();
        setProperties(fallbackProperties);
        setFilteredProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Monitorar mudanças na lista de propriedades
  useEffect(() => {
    console.log("🔄 Admin - Lista de propriedades mudou:", properties.length, "propriedades");
    properties.forEach((prop, index) => {
      console.log(`🔄 Admin - Propriedade ${index + 1}: ${prop.title} (ID: ${prop.id})`);
    });
  }, [properties]);

  // Função de teste para verificar propriedades
  const testPropertySearch = async () => {
    console.log("🧪 Testando busca de propriedades...");
    const allProperties = await PropertyService.loadProperties();
    console.log("🧪 Total de propriedades carregadas:", allProperties.length);
    
    allProperties.forEach((prop, index) => {
      console.log(`🧪 Propriedade ${index + 1}:`, {
        id: prop.id,
        title: prop.title,
        hasImages: !!(prop.images && prop.images.length > 0),
         hasBanner: !!(prop.images && prop.images.length > 0)
      });
    });
  };

  // Filtrar propriedades
  useEffect(() => {
    let filtered = properties;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        property.developer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filterCategory !== "all") {
      filtered = filtered.filter(property => property.category === filterCategory);
    }

    // Filtro por localização
    if (filterLocation !== "all") {
      filtered = filtered.filter(property => property.location === filterLocation);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filterCategory, filterLocation]);

  const handleAddProperty = async (property: Property) => {
    try {
      console.log("🔄 Admin - Iniciando adição de propriedade...");
      console.log("🔄 Admin - Propriedade antes:", property.title);
      
      const newProperty = await PropertyService.addProperty(property);
      console.log("✅ Admin - Propriedade adicionada:", newProperty.id);
      
      // Forçar recarregamento da lista
      const updatedProperties = await PropertyService.loadProperties();
      console.log("🔄 Admin - Propriedades carregadas:", updatedProperties.length);
      console.log("🔄 Admin - Última propriedade:", updatedProperties[updatedProperties.length - 1]?.title);
      
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      setCurrentTab("properties"); // Voltar para a lista após adicionar
      
      console.log("✅ Admin - Lista atualizada com", updatedProperties.length, "propriedades");
      console.log("✅ Admin - Estado atualizado, mudando para aba 'properties'");
    } catch (error) {
      console.error("❌ Admin - Erro ao adicionar propriedade:", error);
      alert("Erro ao salvar propriedade. Tente novamente.");
    }
  };

  const handleEditProperty = async (property: Property) => {
    try {
      await PropertyService.updateProperty(property);
      const updatedProperties = await PropertyService.loadProperties();
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      setEditingProperty(null);
    } catch (error) {
      console.error("❌ Admin - Erro ao atualizar propriedade:", error);
      alert("Erro ao atualizar propriedade. Tente novamente.");
    }
  };

  const handleDeleteProperty = async (id: string) => {
    const property = properties.find(p => p.id === id);
    const propertyName = property?.title || 'esta propriedade';
    
    if (confirm(`⚠️ Tem certeza que deseja excluir "${propertyName}"?\n\nEsta ação não pode ser desfeita!`)) {
      try {
        await PropertyService.deleteProperty(id);
        const updatedProperties = await PropertyService.loadProperties();
        setProperties(updatedProperties);
        setFilteredProperties(updatedProperties);
        console.log("✅ Admin - Propriedade excluída:", id);
      } catch (error) {
        console.error("❌ Admin - Erro ao excluir propriedade:", error);
        alert("Erro ao excluir propriedade. Tente novamente.");
      }
    }
  };

  const handleResetData = async () => {
    if (confirm(`⚠️ Tem certeza que deseja resetar todos os dados?\n\nIsso irá:\n- Limpar todas as propriedades criadas\n- Restaurar os dados de exemplo\n- Perder todas as imagens enviadas\n\nEsta ação não pode ser desfeita!`)) {
      PropertyService.forceSampleData();
      const updatedProperties = await PropertyService.loadProperties();
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      console.log("✅ Admin - Dados resetados para dados de exemplo");
      alert("Dados resetados com sucesso! Os dados de exemplo foram restaurados.");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    const currentFeaturedCount = properties.filter(p => p.isFeatured).length;
    
    if (!property.isFeatured && currentFeaturedCount >= 6) {
      alert('⚠️ Máximo de 6 propriedades em destaque permitido!');
      return;
    }

    const updatedProperty = { ...property, isFeatured: !property.isFeatured };
    PropertyService.updateProperty(updatedProperty);
    const updatedProperties = await PropertyService.loadProperties();
    setProperties(updatedProperties);
    setFilteredProperties(updatedProperties);
  };

  const handleToggleVisibility = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    const updatedProperty = { ...property, isVisible: !property.isVisible };
    PropertyService.updateProperty(updatedProperty);
    const updatedProperties = await PropertyService.loadProperties();
    setProperties(updatedProperties);
    setFilteredProperties(updatedProperties);
  };

  const handleExportData = () => {
    const data = PropertyService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lopes-properties-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        PropertyService.importData(content).then(async (success) => {
          if (success) {
            setProperties(await PropertyService.loadProperties());
            alert('Dados importados com sucesso!');
          } else {
            alert('Erro ao importar dados. Verifique o arquivo.');
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const handleClearAllData = async () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      PropertyService.clearAllData();
      setProperties(await PropertyService.loadProperties());
      alert('Todos os dados foram limpos.');
    }
  };

  const handlePreviewClick = (property: Property) => {
    console.log("🔍 Admin - handlePreviewClick chamado");
    console.log("🔍 Admin - ID da propriedade:", property.id);
    console.log("🔍 Admin - Título da propriedade:", property.title);
    
    // Redirecionar para a página completa do imóvel
    console.log("🔍 Admin - Abrindo URL:", `/property/${property.id}`);
    window.open(`/property/${property.id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie as propriedades e apartamentos do site
              </p>
              {AuthService.getCurrentUser() && (
                <div className="mt-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {AuthService.getCurrentUser()?.name} 
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {AuthService.getCurrentUser()?.role === 'admin' ? 'Admin Master' : 'Corretor'}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  AuthService.logout();
                  window.location.href = '/login';
                }}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Backup
              </Button>
              <label htmlFor="import-file">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Restore
                </Button>
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllData}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
                Limpar
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="properties">Propriedades</TabsTrigger>
              <TabsTrigger value="add">Adicionar Nova</TabsTrigger>
              <TabsTrigger value="backup">Backup & Dados</TabsTrigger>
            </TabsList>
            <Button onClick={testPropertySearch} variant="secondary" size="sm" className="ml-4">
              🧪 Testar
            </Button>
          </div>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Propriedades Cadastradas</h2>
              <div className="text-sm text-gray-500">
                {loading ? "Carregando..." : `${filteredProperties.length} de ${properties.length} propriedade(s)`}
              </div>
            </div>

            {/* Filtros e Busca */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros e Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Busca */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Título, descrição, localização..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filtro por Categoria */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        <SelectItem value="venda">Venda</SelectItem>
                        <SelectItem value="investimento">Investimento</SelectItem>
                        <SelectItem value="aluguel">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro por Localização */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Localização</label>
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os setores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os setores</SelectItem>
                        <SelectItem value="Setor Oeste">Setor Oeste</SelectItem>
                        <SelectItem value="Setor Marista">Setor Marista</SelectItem>
                        <SelectItem value="Setor Bueno">Setor Bueno</SelectItem>
                        <SelectItem value="Jardim Europa">Jardim Europa</SelectItem>
                        <SelectItem value="Alto da Glória">Alto da Glória</SelectItem>
                        <SelectItem value="Setor Universitário">Setor Universitário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Botão Limpar Filtros */}
                {(searchTerm || filterCategory !== "all" || filterLocation !== "all") && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterCategory("all");
                        setFilterLocation("all");
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {loading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mb-4"></div>
                  <p className="text-gray-600">Carregando propriedades...</p>
                </CardContent>
              </Card>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma propriedade cadastrada
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    Comece adicionando sua primeira propriedade
                  </p>
                </CardContent>
              </Card>
            ) : filteredProperties.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma propriedade encontrada
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("all");
                      setFilterLocation("all");
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">
                          {property.title}
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant={property.isFeatured ? "default" : "outline"}
                            size="sm"
                            onClick={() => property.id && handleToggleFeatured(property.id)}
                            title={property.isFeatured ? "Remover do destaque" : "Adicionar ao destaque"}
                            className={property.isFeatured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={property.isVisible !== false ? "default" : "outline"}
                            size="sm"
                            onClick={() => property.id && handleToggleVisibility(property.id)}
                            title={property.isVisible !== false ? "Ocultar propriedade" : "Mostrar propriedade"}
                            className={property.isVisible !== false ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {property.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProperty(property)}
                            title="Editar propriedade"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => property.id && handleDeleteProperty(property.id)}
                            title="Excluir propriedade"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PropertyPreview 
                        property={property} 
                        onPreviewClick={() => handlePreviewClick(property)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Adicionar Nova Propriedade</h2>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleResetData}
                  className="text-xs"
                >
                  🔄 Resetar Dados
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentTab("properties")}
                >
                  Voltar para Lista
                </Button>
              </div>
            </div>
                <PropertyFormUnified 
                  onSubmit={handleAddProperty}
                  onCancel={() => setCurrentTab("properties")}
                  user={AuthService.getCurrentUser()!}
                  mode="create"
                />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <BackupManager />
          </TabsContent>
        </Tabs>

        {/* Modal de Edição */}
        {editingProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Editar Propriedade</h2>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProperty(null)}
                  >
                    Fechar
                  </Button>
                </div>
                    <PropertyFormUnified 
                      property={editingProperty}
                      onSubmit={handleEditProperty}
                      onCancel={() => setEditingProperty(null)}
                      user={AuthService.getCurrentUser()!}
                      mode="edit"
                    />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
