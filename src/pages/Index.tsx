
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Server, Globe, TrendingUp, Clock } from "lucide-react";
import InventoryManagement from "@/components/InventoryManagement";
import AlertsPanel from "@/components/AlertsPanel";
import ReportsPanel from "@/components/ReportsPanel";
import DashboardLayout from "@/components/DashboardLayout";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Données de démonstration
  const securityMetrics = {
    totalAssets: 156,
    criticalVulns: 8,
    highVulns: 23,
    mediumVulns: 45,
    lastScan: "Il y a 2 heures",
    resolvedThisMonth: 34
  };

  const recentAlerts = [
    {
      id: 1,
      title: "Vulnérabilité critique - Apache Struts",
      severity: "critique",
      asset: "Serveur Web Production",
      date: "2025-01-02 14:30",
      cve: "CVE-2025-0001"
    },
    {
      id: 2,
      title: "Mise à jour sécurité - Windows Server",
      severity: "élevé",
      asset: "Contrôleur de domaine",
      date: "2025-01-02 12:15",
      cve: "CVE-2025-0002"
    },
    {
      id: 3,
      title: "Vulnérabilité Oracle Database",
      severity: "moyen",
      asset: "Base de données RH",
      date: "2025-01-02 09:45",
      cve: "CVE-2025-0003"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critique": return "bg-red-500";
      case "élevé": return "bg-orange-500";
      case "moyen": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critique": return "destructive";
      case "élevé": return "secondary";
      case "moyen": return "outline";
      default: return "default";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">VulnGuard Dashboard</h1>
          <p className="text-gray-600">Surveillance et gestion des vulnérabilités SI</p>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs Surveillés</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.totalAssets}</div>
            <p className="text-xs text-muted-foreground">Composants SI actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnérabilités Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityMetrics.criticalVulns}</div>
            <p className="text-xs text-muted-foreground">Nécessitent une action immédiate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risques Élevés</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{securityMetrics.highVulns}</div>
            <p className="text-xs text-muted-foreground">À traiter rapidement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues ce mois</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityMetrics.resolvedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Vulnérabilités corrigées</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Alertes Récentes</span>
          </CardTitle>
          <CardDescription>
            Dernière synchronisation: {securityMetrics.lastScan}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.asset} • {alert.cve}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-500">{alert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statut de connexion MaCERT */}
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <strong>Statut MaCERT:</strong> Connexion active • Dernière synchronisation: {securityMetrics.lastScan}
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "inventory" && <InventoryManagement />}
      {activeTab === "alerts" && <AlertsPanel />}
      {activeTab === "reports" && <ReportsPanel />}
      {activeTab === "maturity" && (
        <div className="text-center p-8">
          <p className="text-gray-600">Le module d'évaluation de maturité ISO 27001 est disponible à l'adresse /maturity</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
