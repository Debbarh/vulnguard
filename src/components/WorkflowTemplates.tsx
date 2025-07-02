
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users, Clock, CheckCircle } from "lucide-react";
import { Workflow } from "@/types/workflow";

const WorkflowTemplates = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const createNewWorkflow = () => {
    const newWorkflow: Partial<Workflow> = {
      name: "",
      description: "",
      assetType: "",
      severityLevel: "moyen",
      steps: [],
      defaultResponsibles: {
        security: "Équipe Sécurité",
        infrastructure: "Équipe Infrastructure", 
        database: "Admin Base de données",
        network: "Équipe Réseau"
      },
      notificationRules: {
        onStart: [],
        onStepComplete: [],
        onCompletion: [],
        rssiFollowUp: []
      },
      sla: {
        maxDuration: 24,
        criticalThreshold: 4
      }
    };
    
    setEditingWorkflow(newWorkflow as Workflow);
    setIsDialogOpen(true);
  };

  const saveWorkflow = () => {
    if (editingWorkflow) {
      const workflow = {
        ...editingWorkflow,
        id: editingWorkflow.id || `wf-${Date.now()}`
      };
      
      setWorkflows(prev => {
        const existing = prev.find(w => w.id === workflow.id);
        if (existing) {
          return prev.map(w => w.id === workflow.id ? workflow : w);
        }
        return [...prev, workflow];
      });
    }
    
    setIsDialogOpen(false);
    setEditingWorkflow(null);
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates de Workflow</h2>
          <p className="text-gray-600">Gérez les modèles de workflow pour différents types d'actifs et niveaux de sévérité</p>
        </div>
        
        <Button onClick={createNewWorkflow}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Workflow
        </Button>
      </div>

      {/* Statistiques des workflows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workflows Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {workflows.filter(w => w.severityLevel === "critique").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Types d'Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(workflows.map(w => w.assetType)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SLA Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workflows.length > 0 ? Math.round(workflows.reduce((acc, w) => acc + w.sla.maxDuration, 0) / workflows.length) : 0}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Templates Disponibles</CardTitle>
          <CardDescription>
            Modèles de workflow configurés pour votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun template de workflow configuré</p>
              <Button onClick={createNewWorkflow}>Créer le premier workflow</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map(workflow => (
                <div key={workflow.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{workflow.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{workflow.assetType}</Badge>
                        <Badge variant={workflow.severityLevel === "critique" ? "destructive" : "secondary"}>
                          {workflow.severityLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingWorkflow(workflow);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteWorkflow(workflow.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{workflow.steps.length} étapes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>SLA: {workflow.sla.maxDuration}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>{workflow.notificationRules.rssiFollowUp.length} RSSI</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Tâches: {workflow.steps.reduce((acc, s) => acc + s.tasks.length, 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour créer/éditer un workflow */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWorkflow?.id ? "Modifier" : "Créer"} un Template de Workflow
            </DialogTitle>
            <DialogDescription>
              Configurez les étapes et responsabilités pour ce type de vulnérabilité
            </DialogDescription>
          </DialogHeader>
          
          {editingWorkflow && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nom du Workflow</label>
                <Input
                  value={editingWorkflow.name}
                  onChange={(e) => setEditingWorkflow({
                    ...editingWorkflow,
                    name: e.target.value
                  })}
                  placeholder="ex: Traitement Vulnérabilité Critique - Serveur"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={editingWorkflow.description}
                  onChange={(e) => setEditingWorkflow({
                    ...editingWorkflow,
                    description: e.target.value
                  })}
                  placeholder="Description du workflow et de son utilisation"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type d'Actif</label>
                  <Select 
                    value={editingWorkflow.assetType}
                    onValueChange={(value) => setEditingWorkflow({
                      ...editingWorkflow,
                      assetType: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Serveur">Serveur</SelectItem>
                      <SelectItem value="Base de données">Base de données</SelectItem>
                      <SelectItem value="Application">Application</SelectItem>
                      <SelectItem value="Réseau">Équipement réseau</SelectItem>
                      <SelectItem value="Sécurité">Équipement sécurité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Niveau de Sévérité</label>
                  <Select 
                    value={editingWorkflow.severityLevel}
                    onValueChange={(value) => setEditingWorkflow({
                      ...editingWorkflow,
                      severityLevel: value as "critique" | "élevé" | "moyen" | "faible"
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critique">Critique</SelectItem>
                      <SelectItem value="élevé">Élevé</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">SLA Maximum (heures)</label>
                  <Input
                    type="number"
                    value={editingWorkflow.sla.maxDuration}
                    onChange={(e) => setEditingWorkflow({
                      ...editingWorkflow,
                      sla: {
                        ...editingWorkflow.sla,
                        maxDuration: parseInt(e.target.value) || 24
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Seuil Critique (heures)</label>
                  <Input
                    type="number"
                    value={editingWorkflow.sla.criticalThreshold}
                    onChange={(e) => setEditingWorkflow({
                      ...editingWorkflow,
                      sla: {
                        ...editingWorkflow.sla,
                        criticalThreshold: parseInt(e.target.value) || 4
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveWorkflow}>
              {editingWorkflow?.id ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowTemplates;
