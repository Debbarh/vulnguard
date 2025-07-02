
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, Calendar, TrendingUp, Shield, AlertTriangle } from "lucide-react";

const ReportsPanel = () => {
  // Données pour les graphiques
  const vulnerabilityTrends = [
    { month: "Oct", critiques: 12, elevees: 28, moyennes: 45 },
    { month: "Nov", critiques: 8, elevees: 23, moyennes: 38 },
    { month: "Dec", critiques: 15, elevees: 31, moyennes: 42 },
    { month: "Jan", critiques: 8, elevees: 23, moyennes: 45 }
  ];

  const assetTypes = [
    { name: "Serveurs", value: 45, color: "#3B82F6" },
    { name: "Bases de données", value: 23, color: "#EF4444" },
    { name: "Applications", value: 34, color: "#10B981" },
    { name: "Réseau", value: 28, color: "#F59E0B" },
    { name: "Sécurité", value: 15, color: "#8B5CF6" }
  ];

  const resolutionTime = [
    { severity: "Critique", avgDays: 2.5 },
    { severity: "Élevé", avgDays: 5.2 },
    { severity: "Moyen", avgDays: 12.8 },
    { severity: "Faible", avgDays: 25.3 }
  ];

  const complianceMetrics = {
    totalAssets: 156,
    compliantAssets: 134,
    complianceRate: 85.9,
    lastAudit: "2024-12-15",
    nextAudit: "2025-03-15"
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h2>
          <p className="text-gray-600">Tableaux de bord et métriques de sécurité</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Planifier Rapport
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Métriques de conformité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceMetrics.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {complianceMetrics.compliantAssets}/{complianceMetrics.totalAssets} actifs conformes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps de Résolution Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4.2 jours</div>
            <p className="text-xs text-muted-foreground">Pour les vulnérabilités critiques</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vulnérabilités Résolues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89%</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prochain Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">42 jours</div>
            <p className="text-xs text-muted-foreground">{complianceMetrics.nextAudit}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des vulnérabilités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Évolution des Vulnérabilités
            </CardTitle>
            <CardDescription>Tendances sur les 4 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vulnerabilityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="critiques" fill="#EF4444" name="Critiques" />
                <Bar dataKey="elevees" fill="#F59E0B" name="Élevées" />
                <Bar dataKey="moyennes" fill="#3B82F6" name="Moyennes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par type d'actif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Répartition des Actifs
            </CardTitle>
            <CardDescription>Par catégorie dans le parc SI</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Temps de résolution par sévérité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Temps de Résolution par Sévérité
          </CardTitle>
          <CardDescription>Durée moyenne de traitement des vulnérabilités</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionTime} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="severity" type="category" />
              <Tooltip formatter={(value) => [`${value} jours`, "Temps moyen"]} />
              <Bar dataKey="avgDays" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rapports pré-définis */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports Pré-définis</CardTitle>
          <CardDescription>Rapports standardisés pour les audits et la direction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-semibold mb-2">Rapport Mensuel de Sécurité</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vue d'ensemble des vulnérabilités traitées et du niveau de sécurité global
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Mensuel</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Générer
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-semibold mb-2">Rapport de Conformité</h3>
              <p className="text-sm text-gray-600 mb-3">
                État de conformité aux standards de sécurité (ISO 27001, NIST)
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Trimestriel</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Générer
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-semibold mb-2">Tableau de Bord Exécutif</h3>
              <p className="text-sm text-gray-600 mb-3">
                Métriques clés et indicateurs de risque pour la direction
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Hebdomadaire</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Générer
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPanel;
