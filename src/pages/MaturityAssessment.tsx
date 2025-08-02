import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  FileText,
  Plus,
  Search,
  Filter,
  Download
} from "lucide-react";
import { ISO27001_CONTROLS } from "@/data/iso27001Controls";
import { ISO27001Control, ISO27001Action, MATURITY_LEVELS } from "@/types/iso27001";
import ISO27001ControlCard from "@/components/ISO27001ControlCard";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MaturityAssessment = () => {
  const [activeTab, setActiveTab] = useState("maturity");
  const [categories, setCategories] = useState(ISO27001_CONTROLS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMaturity, setFilterMaturity] = useState("all");
  const [newActionDialog, setNewActionDialog] = useState<{ open: boolean; controlId: string }>({ 
    open: false, 
    controlId: "" 
  });

  // Calculer les métriques globales
  const allControls = categories.flatMap(cat => cat.controls);
  const totalControls = allControls.length;
  const implementedControls = allControls.filter(c => c.status === "implemented").length;
  const inProgressControls = allControls.filter(c => c.status === "in_progress").length;
  const totalActions = allControls.reduce((acc, c) => acc + c.actionPlan.length, 0);
  const completedActions = allControls.reduce((acc, c) => 
    acc + c.actionPlan.filter(a => a.status === "completed").length, 0
  );
  const overallMaturity = totalControls > 0 ? 
    allControls.reduce((acc, c) => acc + c.maturityLevel, 0) / totalControls : 0;

  // Filtrage des contrôles
  const filteredControls = allControls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || control.category.includes(filterCategory);
    const matchesMaturity = filterMaturity === "all" || control.maturityLevel.toString() === filterMaturity;
    
    return matchesSearch && matchesCategory && matchesMaturity;
  });

  const handleUpdateControl = (controlId: string, updates: Partial<ISO27001Control>) => {
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        controls: category.controls.map(control => 
          control.id === controlId ? { ...control, ...updates } : control
        )
      }))
    );
  };

  const handleCreateAction = (controlId: string) => {
    setNewActionDialog({ open: true, controlId });
  };

  const handleStartWorkflow = (actionId: string) => {
    // Ici on intégrerait avec le système de workflow existant
    console.log("Starting workflow for action:", actionId);
    // TODO: Intégrer avec WorkflowManager
  };

  const createNewAction = (actionData: any) => {
    const newAction: ISO27001Action = {
      id: `action-${Date.now()}`,
      title: actionData.title,
      description: actionData.description,
      responsible: actionData.responsible,
      dueDate: actionData.dueDate,
      priority: actionData.priority,
      status: "not_started",
      category: actionData.category,
      progress: 0
    };

    handleUpdateControl(newActionDialog.controlId, {
      actionPlan: [...(allControls.find(c => c.id === newActionDialog.controlId)?.actionPlan || []), newAction]
    });

    setNewActionDialog({ open: false, controlId: "" });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maturité Globale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMaturity.toFixed(1)}/4</div>
            <p className="text-xs text-muted-foreground">Niveau moyen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrôles Implémentés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{implementedControls}/{totalControls}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((implementedControls / totalControls) * 100)}% complétés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Complétées</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedActions}/{totalActions}</div>
            <p className="text-xs text-muted-foreground">
              {totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0}% des actions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressControls}</div>
            <p className="text-xs text-muted-foreground">Contrôles en cours</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de répartition par maturité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Répartition par Niveau de Maturité</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MATURITY_LEVELS.map(level => {
              const count = allControls.filter(c => c.maturityLevel === level.level).length;
              const percentage = totalControls > 0 ? (count / totalControls) * 100 : 0;
              
              return (
                <div key={level.level} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                      <span>Niveau {level.level}: {level.name}</span>
                    </span>
                    <span>{count} contrôles ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="w-full" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Répartition par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>État par Catégorie ISO 27001</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => {
              const categoryProgress = category.controls.length > 0 ? 
                (category.controls.filter(c => c.status === "implemented").length / category.controls.length) * 100 : 0;
              const avgMaturity = category.controls.length > 0 ?
                category.controls.reduce((acc, c) => acc + c.maturityLevel, 0) / category.controls.length : 0;

              return (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Maturité: {avgMaturity.toFixed(1)}/4
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(categoryProgress)}% complété
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <Progress value={categoryProgress} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{category.controls.filter(c => c.status === "implemented").length}/{category.controls.length} contrôles</span>
                    <span>{Math.round(categoryProgress)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderControls = () => (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres et Recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Code ou titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category-filter">Catégorie</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maturity-filter">Niveau de maturité</Label>
              <Select value={filterMaturity} onValueChange={setFilterMaturity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {MATURITY_LEVELS.map(level => (
                    <SelectItem key={level.level} value={level.level.toString()}>
                      Niveau {level.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des contrôles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Contrôles ISO 27001 ({filteredControls.length})
          </h2>
        </div>

        {filteredControls.map(control => (
          <ISO27001ControlCard
            key={control.id}
            control={control}
            onUpdateControl={handleUpdateControl}
            onCreateAction={handleCreateAction}
            onStartWorkflow={handleStartWorkflow}
          />
        ))}
      </div>

      {/* Dialog pour créer une nouvelle action */}
      <Dialog open={newActionDialog.open} onOpenChange={(open) => setNewActionDialog({ ...newActionDialog, open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle action</DialogTitle>
            <DialogDescription>
              Ajouter une action pour améliorer ce contrôle ISO 27001
            </DialogDescription>
          </DialogHeader>
          <ActionForm onSubmit={createNewAction} onCancel={() => setNewActionDialog({ open: false, controlId: "" })} />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Évaluation de Maturité ISO 27001</h1>
              <p className="text-gray-600">Gestion de la conformité et amélioration continue</p>
            </div>
          </div>
          
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Générer Rapport
          </Button>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="maturity">Tableau de Bord</TabsTrigger>
            <TabsTrigger value="controls">Contrôles ISO 27001</TabsTrigger>
          </TabsList>
          
          <TabsContent value="maturity" className="space-y-6">
            {renderDashboard()}
          </TabsContent>
          
          <TabsContent value="controls" className="space-y-6">
            {renderControls()}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Composant pour le formulaire de création d'action
const ActionForm = ({ onSubmit, onCancel }: { 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsible: "",
    dueDate: "",
    priority: "medium",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de l'action</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsible">Responsable</Label>
          <Input
            id="responsible"
            value={formData.responsible}
            onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Date d'échéance</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Créer l'action
        </Button>
      </div>
    </form>
  );
};

export default MaturityAssessment;