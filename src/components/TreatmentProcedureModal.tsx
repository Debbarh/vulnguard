
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CheckCircle, Clock, User, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: "critique" | "élevé" | "moyen" | "faible";
  status: "ouvert" | "en_cours" | "en_attente" | "resolu";
  asset: string;
  cve: string;
  assignedTo?: string;
  createdDate: string;
  dueDate?: string;
  source: string;
}

interface TreatmentProcedureModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (alertId: number, status: string, assignedTo?: string, comments?: string) => void;
}

const TreatmentProcedureModal = ({ alert, isOpen, onClose, onStatusUpdate }: TreatmentProcedureModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [newStatus, setNewStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [comments, setComments] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  const treatmentSteps = [
    {
      step: 1,
      title: "Évaluation initiale",
      description: "Analyser la vulnérabilité et son impact",
      actions: [
        "Vérifier l'authenticité de la vulnérabilité",
        "Évaluer l'impact sur les systèmes",
        "Confirmer les actifs affectés",
        "Consulter les bases de données de vulnérabilités"
      ]
    },
    {
      step: 2,
      title: "Classification et priorisation",
      description: "Définir le niveau de priorité et les ressources nécessaires",
      actions: [
        "Confirmer le niveau de sévérité",
        "Évaluer l'urgence du traitement",
        "Déterminer les ressources requises",
        "Planifier la fenêtre de maintenance"
      ]
    },
    {
      step: 3,
      title: "Plan d'action",
      description: "Élaborer la stratégie de remédiation",
      actions: [
        "Identifier les correctifs disponibles",
        "Préparer un plan de rollback",
        "Définir les tests de validation",
        "Coordonner avec les équipes concernées"
      ]
    },
    {
      step: 4,
      title: "Implémentation",
      description: "Appliquer les mesures correctives",
      actions: [
        "Appliquer les correctifs/mises à jour",
        "Configurer les mesures de protection",
        "Tester la fonctionnalité des systèmes",
        "Documenter les changements effectués"
      ]
    },
    {
      step: 5,
      title: "Validation et clôture",
      description: "Vérifier l'efficacité et finaliser le traitement",
      actions: [
        "Effectuer les tests de sécurité",
        "Valider la correction de la vulnérabilité",
        "Mettre à jour la documentation",
        "Clôturer l'alerte avec rapport final"
      ]
    }
  ];

  const handleStepComplete = () => {
    if (currentStep < treatmentSteps.length) {
      setCurrentStep(currentStep + 1);
      toast.success(`Étape ${currentStep} complétée`);
    }
  };

  const handleFinalSubmit = () => {
    if (!newStatus || !assignedTo) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (alert) {
      onStatusUpdate(alert.id, newStatus, assignedTo, comments);
      toast.success("Procédure de traitement terminée avec succès");
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setNewStatus("");
    setAssignedTo("");
    setComments("");
    setActionTaken("");
    onClose();
  };

  if (!alert) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critique": return "destructive";
      case "élevé": return "secondary";
      case "moyen": return "outline";
      case "faible": return "default";
      default: return "default";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Procédure de Traitement - Alerte #{alert.id}</span>
          </SheetTitle>
          <SheetDescription>
            Suivez la procédure standardisée pour traiter cette vulnérabilité
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Informations de l'alerte */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{alert.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">CVE: {alert.cve}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Actif:</strong> {alert.asset}</div>
                <div><strong>Source:</strong> {alert.source}</div>
                <div><strong>Date création:</strong> {alert.createdDate}</div>
                {alert.dueDate && <div><strong>Échéance:</strong> {alert.dueDate}</div>}
              </div>
            </CardContent>
          </Card>

          {/* Progression des étapes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Progression - Étape {currentStep} sur {treatmentSteps.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentSteps.map((step) => (
                  <div key={step.step} className={`border rounded-lg p-4 ${
                    step.step === currentStep ? 'border-blue-500 bg-blue-50' : 
                    step.step < currentStep ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center space-x-2">
                        {step.step < currentStep ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : step.step === currentStep ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <span>Étape {step.step}: {step.title}</span>
                      </h3>
                      {step.step === currentStep && (
                        <Button onClick={handleStepComplete} size="sm">
                          Marquer comme terminé
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    <ul className="text-sm space-y-1">
                      {step.actions.map((action, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="h-1 w-1 bg-gray-400 rounded-full" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de finalisation (visible seulement à la dernière étape) */}
          {currentStep > treatmentSteps.length && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Finalisation du traitement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nouveau statut *</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le statut final" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="resolu">Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Assigné à *</label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Équipe Sécurité">Équipe Sécurité</SelectItem>
                      <SelectItem value="Équipe Infrastructure">Équipe Infrastructure</SelectItem>
                      <SelectItem value="Admin Base de données">Admin Base de données</SelectItem>
                      <SelectItem value="Équipe Réseau">Équipe Réseau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Actions entreprises</label>
                  <Textarea
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder="Décrivez les actions entreprises pour traiter cette vulnérabilité..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Commentaires additionnels</label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Ajoutez vos commentaires sur le traitement..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleFinalSubmit} className="flex-1">
                    Finaliser le traitement
                  </Button>
                  <Button variant="outline" onClick={handleClose}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TreatmentProcedureModal;
