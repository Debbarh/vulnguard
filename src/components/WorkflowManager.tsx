
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, User, AlertTriangle, Bell } from "lucide-react";
import { Workflow, WorkflowExecution, WorkflowStep, WorkflowTask } from "@/types/workflow";

interface WorkflowManagerProps {
  alertId: number;
  assetType: string;
  severity: "critique" | "élevé" | "moyen" | "faible";
  onWorkflowStart: (workflowId: string) => void;
  onTaskComplete: (executionId: string, taskId: string, comments: string) => void;
}

const WorkflowManager = ({ 
  alertId, 
  assetType, 
  severity, 
  onWorkflowStart, 
  onTaskComplete 
}: WorkflowManagerProps) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);

  // Mock workflows - in real implementation, these would come from a backend
  const availableWorkflows: Workflow[] = [
    {
      id: "wf-critical-server",
      name: "Traitement Vulnérabilité Critique - Serveur",
      description: "Workflow pour traiter les vulnérabilités critiques sur les serveurs",
      assetType: "Serveur",
      severityLevel: "critique",
      steps: [
        {
          id: "step-1",
          name: "Évaluation d'urgence",
          description: "Évaluation immédiate de la vulnérabilité",
          tasks: [
            {
              id: "task-1-1",
              title: "Analyse de criticité",
              description: "Confirmer le niveau de criticité et l'impact",
              responsible: "Équipe Sécurité",
              estimatedDuration: 1,
              required: true,
              completed: false
            },
            {
              id: "task-1-2",
              title: "Isolation des actifs",
              description: "Isoler les systèmes affectés si nécessaire",
              responsible: "Équipe Infrastructure",
              estimatedDuration: 2,
              required: true,
              completed: false
            }
          ],
          approvalRequired: true,
          approver: "RSSI Principal",
          notifyUsers: ["admin@company.com", "security@company.com"],
          rssiFollowUp: ["rssi@company.com", "ciso@company.com"],
          status: "pending"
        },
        {
          id: "step-2",
          name: "Planification",
          description: "Planification de la remédiation",
          tasks: [
            {
              id: "task-2-1",
              title: "Recherche de correctifs",
              description: "Identifier les correctifs disponibles",
              responsible: "Équipe Sécurité",
              estimatedDuration: 2,
              dependencies: ["task-1-1"],
              required: true,
              completed: false
            },
            {
              id: "task-2-2",
              title: "Plan de déploiement",
              description: "Créer un plan de déploiement avec rollback",
              responsible: "Équipe Infrastructure",
              estimatedDuration: 3,
              dependencies: ["task-2-1"],
              required: true,
              completed: false
            }
          ],
          approvalRequired: false,
          notifyUsers: ["infra@company.com"],
          rssiFollowUp: ["rssi@company.com"],
          status: "pending"
        }
      ],
      defaultResponsibles: {
        security: "Équipe Sécurité",
        infrastructure: "Équipe Infrastructure",
        database: "Admin Base de données",
        network: "Équipe Réseau"
      },
      notificationRules: {
        onStart: ["admin@company.com", "security@company.com"],
        onStepComplete: ["rssi@company.com"],
        onCompletion: ["ciso@company.com", "admin@company.com"],
        rssiFollowUp: ["rssi@company.com", "ciso@company.com"]
      },
      sla: {
        maxDuration: 24,
        criticalThreshold: 4
      }
    }
  ];

  const getRelevantWorkflows = () => {
    return availableWorkflows.filter(wf => 
      wf.assetType === assetType && wf.severityLevel === severity
    );
  };

  const startWorkflow = (workflow: Workflow) => {
    const newExecution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId: workflow.id,
      alertId,
      currentStepId: workflow.steps[0].id,
      status: "running",
      startedAt: new Date().toISOString(),
      assignedTo: "current-user",
      progress: 0,
      notifications: []
    };
    
    setExecution(newExecution);
    setSelectedWorkflow(workflow);
    onWorkflowStart(workflow.id);
  };

  const completeTask = (taskId: string, comments: string) => {
    if (!execution || !selectedWorkflow) return;
    
    onTaskComplete(execution.id, taskId, comments);
    
    // Update local state (in real app, this would be handled by state management)
    const updatedWorkflow = { ...selectedWorkflow };
    updatedWorkflow.steps.forEach(step => {
      step.tasks.forEach(task => {
        if (task.id === taskId) {
          task.completed = true;
          task.completedAt = new Date().toISOString();
          task.completedBy = "current-user";
          task.comments = comments;
        }
      });
    });
    
    setSelectedWorkflow(updatedWorkflow);
  };

  const getStepStatus = (step: WorkflowStep) => {
    const completedTasks = step.tasks.filter(t => t.completed).length;
    const totalTasks = step.tasks.length;
    
    if (completedTasks === 0) return "pending";
    if (completedTasks === totalTasks) return "completed";
    return "in_progress";
  };

  const calculateProgress = () => {
    if (!selectedWorkflow) return 0;
    
    const allTasks = selectedWorkflow.steps.flatMap(s => s.tasks);
    const completedTasks = allTasks.filter(t => t.completed).length;
    
    return Math.round((completedTasks / allTasks.length) * 100);
  };

  const relevantWorkflows = getRelevantWorkflows();

  if (!execution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Sélection du Workflow</span>
          </CardTitle>
          <CardDescription>
            Choisissez le workflow approprié pour traiter cette vulnérabilité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {relevantWorkflows.length === 0 ? (
            <p className="text-gray-500">Aucun workflow disponible pour ce type d'actif et niveau de sévérité.</p>
          ) : (
            relevantWorkflows.map(workflow => (
              <div key={workflow.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                  </div>
                  <Button onClick={() => startWorkflow(workflow)}>
                    Démarrer
                  </Button>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>SLA:</strong> {workflow.sla.maxDuration}h max</p>
                  <p><strong>Étapes:</strong> {workflow.steps.length}</p>
                  <p><strong>Tâches totales:</strong> {workflow.steps.reduce((acc, s) => acc + s.tasks.length, 0)}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedWorkflow?.name}</span>
            <Badge variant={execution.status === "running" ? "default" : "secondary"}>
              {execution.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Progression: {calculateProgress()}% • Démarré le {new Date(execution.startedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="w-full" />
        </CardContent>
      </Card>

      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="steps">Étapes</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="steps" className="space-y-4">
          {selectedWorkflow?.steps.map((step, index) => (
            <Card key={step.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  {getStepStatus(step) === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : getStepStatus(step) === "in_progress" ? (
                    <Clock className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span>Étape {index + 1}: {step.name}</span>
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {step.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {task.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </span>
                        {task.required && <Badge variant="outline" className="text-xs">Obligatoire</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {task.responsible}
                        </span>
                        <span>{task.estimatedDuration}h estimé</span>
                      </div>
                    </div>
                    {!task.completed && (
                      <Button 
                        size="sm" 
                        onClick={() => completeTask(task.id, "")}
                      >
                        Terminer
                      </Button>
                    )}
                  </div>
                ))}
                
                {step.approvalRequired && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800">
                      Approbation requise par: {step.approver}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 text-xs">
                  <p><strong>Utilisateurs à notifier:</strong> {step.notifyUsers.join(", ")}</p>
                  <p><strong>Suivi RSSI:</strong> {step.rssiFollowUp.join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Centre de Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Les notifications seront affichées ici au fur et à mesure de l'avancement du workflow.</p>
                {execution.notifications.map(notification => (
                  <div key={notification.id} className="p-2 border rounded text-sm">
                    <p>{notification.message}</p>
                    <p className="text-xs text-gray-500">{new Date(notification.sentAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline du Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>Workflow démarré le {new Date(execution.startedAt).toLocaleString()}</span>
                </div>
                {selectedWorkflow?.steps.map(step => 
                  step.tasks.filter(t => t.completed).map(task => (
                    <div key={task.id} className="flex items-center space-x-2 text-sm">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>{task.title} terminé le {task.completedAt ? new Date(task.completedAt).toLocaleString() : ""}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManager;
