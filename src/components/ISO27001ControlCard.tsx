import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Plus, 
  Target,
  User,
  Calendar,
  TrendingUp
} from "lucide-react";
import { ISO27001Control, MATURITY_LEVELS } from "@/types/iso27001";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ISO27001ControlCardProps {
  control: ISO27001Control;
  onUpdateControl: (controlId: string, updates: Partial<ISO27001Control>) => void;
  onCreateAction: (controlId: string) => void;
  onStartWorkflow: (actionId: string) => void;
}

const ISO27001ControlCard = ({ 
  control, 
  onUpdateControl, 
  onCreateAction, 
  onStartWorkflow 
}: ISO27001ControlCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newGap, setNewGap] = useState("");
  const [newEvidence, setNewEvidence] = useState("");

  const currentMaturityLevel = MATURITY_LEVELS.find(l => l.level === control.maturityLevel);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "reviewed": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const handleMaturityChange = (newLevel: string) => {
    onUpdateControl(control.id, { maturityLevel: parseInt(newLevel) as 0 | 1 | 2 | 3 | 4 });
  };

  const handleStatusChange = (newStatus: string) => {
    onUpdateControl(control.id, { status: newStatus as any });
  };

  const addGap = () => {
    if (newGap.trim()) {
      onUpdateControl(control.id, {
        gaps: [...control.gaps, newGap.trim()]
      });
      setNewGap("");
    }
  };

  const addEvidence = () => {
    if (newEvidence.trim()) {
      onUpdateControl(control.id, {
        evidence: [...control.evidence, newEvidence.trim()]
      });
      setNewEvidence("");
    }
  };

  const removeGap = (index: number) => {
    const newGaps = control.gaps.filter((_, i) => i !== index);
    onUpdateControl(control.id, { gaps: newGaps });
  };

  const removeEvidence = (index: number) => {
    const newEvidence = control.evidence.filter((_, i) => i !== index);
    onUpdateControl(control.id, { evidence: newEvidence });
  };

  const completedActions = control.actionPlan.filter(a => a.status === "completed").length;
  const actionProgress = control.actionPlan.length > 0 ? (completedActions / control.actionPlan.length) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">{control.code}</CardTitle>
              <Badge variant="outline" className={getPriorityColor(control.priority)}>
                {control.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getStatusColor(control.status)}>
                {control.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-base font-medium">{control.title}</CardTitle>
            <CardDescription className="text-sm">
              Responsable: {control.responsible}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${currentMaturityLevel?.color}`}>
              Niveau {control.maturityLevel}: {currentMaturityLevel?.name}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>{control.actionPlan.length} actions</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{control.evidence.length} preuves</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4" />
            <span>{control.gaps.length} écarts</span>
          </div>
        </div>

        {control.actionPlan.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression des actions</span>
              <span>{Math.round(actionProgress)}%</span>
            </div>
            <Progress value={actionProgress} className="w-full" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`maturity-${control.id}`}>Niveau de maturité</Label>
            <Select value={control.maturityLevel.toString()} onValueChange={handleMaturityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATURITY_LEVELS.map(level => (
                  <SelectItem key={level.level} value={level.level.toString()}>
                    Niveau {level.level}: {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`status-${control.id}`}>Statut</Label>
            <Select value={control.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Non démarré</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="implemented">Implémenté</SelectItem>
                <SelectItem value="reviewed">Révisé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? "Réduire" : "Voir les détails"}
        </Button>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Description */}
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-gray-600 mt-1">{control.description}</p>
            </div>

            {/* Niveau de maturité détaillé */}
            {currentMaturityLevel && (
              <div>
                <Label className="text-sm font-medium">Caractéristiques du niveau actuel</Label>
                <div className="mt-2 space-y-1">
                  {currentMaturityLevel.characteristics.map((char, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
                      <span>{char}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preuves */}
            <div>
              <Label className="text-sm font-medium">Preuves d'implémentation</Label>
              <div className="space-y-2 mt-2">
                {control.evidence.map((evidence, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded border">
                    <span className="text-sm">{evidence}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeEvidence(index)}
                      className="text-red-600 h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ajouter une preuve..."
                    value={newEvidence}
                    onChange={(e) => setNewEvidence(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addEvidence} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Écarts identifiés */}
            <div>
              <Label className="text-sm font-medium">Écarts identifiés</Label>
              <div className="space-y-2 mt-2">
                {control.gaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border">
                    <span className="text-sm">{gap}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeGap(index)}
                      className="text-red-600 h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ajouter un écart..."
                    value={newGap}
                    onChange={(e) => setNewGap(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addGap} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Plan d'action */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Plan d'action</Label>
                <Button 
                  onClick={() => onCreateAction(control.id)} 
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une action
                </Button>
              </div>
              
              <div className="space-y-2">
                {control.actionPlan.map((action) => (
                  <div key={action.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{action.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(action.priority)}
                        >
                          {action.priority}
                        </Badge>
                        <Badge variant="outline">
                          {action.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {action.responsible}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(action.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {action.workflowId ? (
                        <Badge variant="outline" className="text-xs">
                          Workflow actif
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onStartWorkflow(action.id)}
                          className="text-xs"
                        >
                          Démarrer workflow
                        </Button>
                      )}
                    </div>
                    
                    {action.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={action.progress} className="w-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ISO27001ControlCard;