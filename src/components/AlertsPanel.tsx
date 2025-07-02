import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, CheckCircle, User, Calendar, ExternalLink } from "lucide-react";
import TreatmentProcedureModal from "./TreatmentProcedureModal";

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

const AlertsPanel = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Vulnérabilité critique Apache Struts RCE",
      description: "Une vulnérabilité d'exécution de code à distance a été découverte dans Apache Struts 2.5.30 et versions antérieures.",
      severity: "critique",
      status: "ouvert",
      asset: "Serveur Web Production",
      cve: "CVE-2025-0001",
      createdDate: "2025-01-02",
      dueDate: "2025-01-04",
      source: "DGSSI MaCERT"
    },
    {
      id: 2,
      title: "Mise à jour sécurité Windows Server disponible",
      description: "Microsoft a publié des correctifs de sécurité pour Windows Server 2022.",
      severity: "élevé",
      status: "en_cours",
      asset: "Contrôleur de domaine",
      cve: "CVE-2025-0002",
      assignedTo: "Équipe Infrastructure",
      createdDate: "2025-01-02",
      dueDate: "2025-01-07",
      source: "DGSSI MaCERT"
    },
    {
      id: 3,
      title: "Vulnérabilité Oracle Database",
      description: "Faille de sécurité permettant une élévation de privilèges dans Oracle Database 19c.",
      severity: "moyen",
      status: "en_attente",
      asset: "Base de données RH",
      cve: "CVE-2025-0003",
      assignedTo: "Admin Base de données",
      createdDate: "2025-01-01",
      dueDate: "2025-01-10",
      source: "DGSSI MaCERT"
    },
    {
      id: 4,
      title: "Correctif Cisco ASA appliqué avec succès",
      description: "Le correctif de sécurité pour Cisco ASA a été installé et testé.",
      severity: "élevé",
      status: "resolu",
      asset: "Firewall Principal",
      cve: "CVE-2024-9999",
      assignedTo: "Équipe Sécurité",
      createdDate: "2024-12-28",
      source: "DGSSI MaCERT"
    }
  ]);

  const handleTreatAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (alertId: number, status: string, assignedTo?: string, comments?: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: status as Alert["status"], assignedTo }
          : alert
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critique": return "destructive";
      case "élevé": return "secondary";
      case "moyen": return "outline";
      case "faible": return "default";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ouvert": return "bg-red-100 text-red-800";
      case "en_cours": return "bg-blue-100 text-blue-800";
      case "en_attente": return "bg-yellow-100 text-yellow-800";
      case "resolu": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ouvert": return <AlertTriangle className="h-4 w-4" />;
      case "en_cours": return <Clock className="h-4 w-4" />;
      case "en_attente": return <Clock className="h-4 w-4" />;
      case "resolu": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ouvert": return "Ouvert";
      case "en_cours": return "En cours";
      case "en_attente": return "En attente";
      case "resolu": return "Résolu";
      default: return status;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === "all" || alert.severity === filterSeverity;
    const statusMatch = filterStatus === "all" || alert.status === filterStatus;
    return severityMatch && statusMatch;
  });

  const alertStats = {
    total: alerts.length,
    open: alerts.filter(a => a.status === "ouvert").length,
    inProgress: alerts.filter(a => a.status === "en_cours").length,
    resolved: alerts.filter(a => a.status === "resolu").length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Alertes</h2>
        <p className="text-gray-600">Suivi et traitement des vulnérabilités détectées</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ouvertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertStats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{alertStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{alertStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sévérité</label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                  <SelectItem value="élevé">Élevé</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="faible">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="ouvert">Ouvert</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="resolu">Résolu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des alertes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes de Sécurité</CardTitle>
          <CardDescription>
            {filteredAlerts.length} alerte(s) affichée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      {getStatusIcon(alert.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {alert.createdDate}
                        </span>
                        {alert.assignedTo && (
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {alert.assignedTo}
                          </span>
                        )}
                        <span className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {alert.source}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                      {getStatusLabel(alert.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-4 text-sm">
                    <span><strong>Actif:</strong> {alert.asset}</span>
                    <span><strong>CVE:</strong> {alert.cve}</span>
                    {alert.dueDate && (
                      <span><strong>Échéance:</strong> {alert.dueDate}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                    {alert.status !== "resolu" && (
                      <Button 
                        size="sm"
                        onClick={() => handleTreatAlert(alert)}
                      >
                        Traiter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TreatmentProcedureModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AlertsPanel;
