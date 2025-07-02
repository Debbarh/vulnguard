
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Server, Database, Globe, Router, Smartphone, Edit, Trash2 } from "lucide-react";

interface Asset {
  id: number;
  name: string;
  type: string;
  manufacturer: string;
  product: string;
  version: string;
  criticality: "critique" | "majeur" | "mineur";
  status: "actif" | "maintenance" | "inactif";
}

const InventoryManagement = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      name: "Serveur Web Production",
      type: "Serveur",
      manufacturer: "Microsoft",
      product: "Windows Server",
      version: "2022",
      criticality: "critique",
      status: "actif"
    },
    {
      id: 2,
      name: "Base de données RH",
      type: "Base de données",
      manufacturer: "Oracle",
      product: "Oracle Database",
      version: "19c",
      criticality: "critique",
      status: "actif"
    },
    {
      id: 3,
      name: "Firewall Principal",
      type: "Sécurité",
      manufacturer: "Cisco",
      product: "ASA",
      version: "9.14",
      criticality: "critique",
      status: "actif"
    },
    {
      id: 4,
      name: "Serveur Test",
      type: "Serveur",
      manufacturer: "Ubuntu",
      product: "Ubuntu Server",
      version: "22.04",
      criticality: "mineur",
      status: "actif"
    }
  ]);

  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: "",
    type: "",
    manufacturer: "",
    product: "",
    version: "",
    criticality: "mineur",
    status: "actif"
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "serveur": return <Server className="h-4 w-4" />;
      case "base de données": return <Database className="h-4 w-4" />;
      case "réseau": return <Router className="h-4 w-4" />;
      case "sécurité": return <Router className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "critique": return "destructive";
      case "majeur": return "secondary";
      case "mineur": return "outline";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactif": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.type && newAsset.manufacturer && newAsset.product) {
      const asset: Asset = {
        id: Math.max(...assets.map(a => a.id)) + 1,
        name: newAsset.name!,
        type: newAsset.type!,
        manufacturer: newAsset.manufacturer!,
        product: newAsset.product!,
        version: newAsset.version || "",
        criticality: newAsset.criticality as "critique" | "majeur" | "mineur",
        status: newAsset.status as "actif" | "maintenance" | "inactif"
      };
      
      setAssets([...assets, asset]);
      setNewAsset({
        name: "",
        type: "",
        manufacturer: "",
        product: "",
        version: "",
        criticality: "mineur",
        status: "actif"
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteAsset = (id: number) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion d'Inventaire SI</h2>
          <p className="text-gray-600">Gérez les composants de votre système d'information</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Actif
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouvel Actif</DialogTitle>
              <DialogDescription>
                Renseignez les informations de l'actif à ajouter à votre inventaire SI.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom</Label>
                <Input
                  id="name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="col-span-3"
                  placeholder="ex: Serveur Web Production"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select onValueChange={(value) => setNewAsset({...newAsset, type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serveur">Serveur</SelectItem>
                    <SelectItem value="Base de données">Base de données</SelectItem>
                    <SelectItem value="Application">Application</SelectItem>
                    <SelectItem value="Réseau">Équipement réseau</SelectItem>
                    <SelectItem value="Sécurité">Équipement sécurité</SelectItem>
                    <SelectItem value="Poste de travail">Poste de travail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manufacturer" className="text-right">Fabricant</Label>
                <Input
                  id="manufacturer"
                  value={newAsset.manufacturer}
                  onChange={(e) => setNewAsset({...newAsset, manufacturer: e.target.value})}
                  className="col-span-3"
                  placeholder="ex: Microsoft, Oracle, Cisco"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">Produit</Label>
                <Input
                  id="product"
                  value={newAsset.product}
                  onChange={(e) => setNewAsset({...newAsset, product: e.target.value})}
                  className="col-span-3"
                  placeholder="ex: Windows Server, Oracle DB"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="version" className="text-right">Version</Label>
                <Input
                  id="version"
                  value={newAsset.version}
                  onChange={(e) => setNewAsset({...newAsset, version: e.target.value})}
                  className="col-span-3"
                  placeholder="ex: 2022, 19c, 1.21"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="criticality" className="text-right">Criticité</Label>
                <Select onValueChange={(value) => setNewAsset({...newAsset, criticality: value as "critique" | "majeur" | "mineur"})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner la criticité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critique">Critique</SelectItem>
                    <SelectItem value="majeur">Majeur</SelectItem>
                    <SelectItem value="mineur">Mineur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddAsset}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actifs Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {assets.filter(a => a.criticality === "critique").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actifs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assets.filter(a => a.status === "actif").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des actifs */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des Actifs</CardTitle>
          <CardDescription>
            Liste complète des composants de votre système d'information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    {getTypeIcon(asset.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{asset.name}</h3>
                    <p className="text-sm text-gray-600">
                      {asset.manufacturer} {asset.product} {asset.version && `v${asset.version}`}
                    </p>
                    <p className="text-xs text-gray-500">{asset.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={getCriticalityColor(asset.criticality)}>
                    {asset.criticality.toUpperCase()}
                  </Badge>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
