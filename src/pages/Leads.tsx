import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Search, Users, Building, MessageCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Lead = {
  id_linkedin: string;
  name: string | null;
  headline: string | null;
  entreprise: string | null;
  connection_status: string | null;
  dm_status: string | null;
  url: string | null;
  date: string | null;
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const filtered = leads.filter(lead => 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.entreprise?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [leads, searchTerm]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('Leads Linkedin')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null, type: 'connection' | 'dm') => {
    if (!status) return <Badge variant="secondary">Non défini</Badge>;
    
    const isConnection = type === 'connection';
    
    switch (status.toLowerCase()) {
      case 'sent':
      case 'envoyé':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">{isConnection ? 'Envoyée' : 'Envoyé'}</Badge>;
      case 'accepted':
      case 'accepté':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepté{isConnection ? 'e' : ''}</Badge>;
      case 'pending':
      case 'en attente':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'declined':
      case 'refusé':
        return <Badge variant="destructive">Refusé{isConnection ? 'e' : ''}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground text-lg">
          Gérez tous vos leads LinkedIn en un seul endroit
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total leads</p>
                <p className="text-2xl font-bold text-foreground">{leads.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connexions acceptées</p>
                <p className="text-2xl font-bold text-foreground">
                  {leads.filter(lead => lead.connection_status?.toLowerCase().includes('accept')).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">DM envoyés</p>
                <p className="text-2xl font-bold text-foreground">
                  {leads.filter(lead => lead.dm_status?.toLowerCase().includes('envoyé') || lead.dm_status?.toLowerCase().includes('sent')).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entreprises uniques</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(leads.filter(lead => lead.entreprise).map(lead => lead.entreprise)).size}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tous les leads</CardTitle>
              <CardDescription>
                Liste complète de vos leads LinkedIn avec leurs informations
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, poste, entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut connexion</TableHead>
                  <TableHead>Statut DM</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      {searchTerm ? 'Aucun lead trouvé pour cette recherche' : 'Aucun lead disponible'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id_linkedin}>
                      <TableCell className="font-medium">
                        {lead.name || 'Nom non disponible'}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-foreground truncate">
                            {lead.headline || 'Poste non disponible'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.entreprise || 'Entreprise non disponible'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.connection_status, 'connection')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.dm_status, 'dm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {lead.date ? new Date(lead.date).toLocaleDateString() : 'Non définie'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={lead.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Voir profil
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredLeads.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredLeads.length} lead{filteredLeads.length > 1 ? 's' : ''} affiché{filteredLeads.length > 1 ? 's' : ''} sur {leads.length} au total
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}