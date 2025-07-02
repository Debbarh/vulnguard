import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Shield, 
  Settings, 
  Key, 
  Bell, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Edit,
  Save,
  X
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@entreprise.com",
    phone: "+33 1 23 45 67 89",
    role: "rssi",
    organization: "ACME Corporation",
    location: "Paris, France",
    joinDate: "2024-01-15"
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsAlerts: false,
    weeklyReports: true,
    emergencyAlerts: true
  });

  const handleSave = () => {
    // Logique de sauvegarde avec Supabase
    console.log("Saving profile:", userInfo);
    setIsEditing(false);
  };

  const getRoleBadge = (role: string) => {
    const roleLabels = {
      rssi: { label: "RSSI", variant: "destructive" },
      admin: { label: "Administrateur", variant: "default" },
      security: { label: "Responsable Sécurité", variant: "secondary" },
      tech: { label: "Responsable Technique", variant: "outline" },
      analyst: { label: "Analyste", variant: "outline" }
    } as const;
    
    const roleInfo = roleLabels[role as keyof typeof roleLabels] || { label: role, variant: "outline" };
    return <Badge variant={roleInfo.variant as any}>{roleInfo.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {userInfo.firstName[0]}{userInfo.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userInfo.firstName} {userInfo.lastName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleBadge(userInfo.role)}
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{userInfo.organization}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="organization">
              <Building className="h-4 w-4 mr-2" />
              Organisation
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil et préférences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={userInfo.location}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    value={userInfo.role} 
                    onValueChange={(value) => setUserInfo(prev => ({ ...prev, role: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rssi">RSSI</SelectItem>
                      <SelectItem value="admin">Administrateur système</SelectItem>
                      <SelectItem value="security">Responsable sécurité</SelectItem>
                      <SelectItem value="tech">Responsable technique</SelectItem>
                      <SelectItem value="analyst">Analyste sécurité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Membre depuis:</strong> {new Date(userInfo.joinDate).toLocaleDateString('fr-FR')}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Mot de passe</p>
                        <p className="text-sm text-gray-600">Dernière modification il y a 30 jours</p>
                      </div>
                    </div>
                    <Button variant="outline">Modifier</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-gray-600">Activée</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contenu des notifications */}
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    Les préférences de notification seront configurables une fois Supabase connecté
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Organisation */}
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Informations organisation</CardTitle>
                <CardDescription>
                  Détails de votre organisation et permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{userInfo.organization}</p>
                        <p className="text-sm text-gray-600">Type: SaaS • 45 utilisateurs</p>
                      </div>
                    </div>
                    {getRoleBadge(userInfo.role)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;