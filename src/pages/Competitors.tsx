import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Plus, 
  ExternalLink, 
  Trash2,
  Edit
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Competitor {
  id: number;
  public_identifier: string;
  name: string;
  headline: string;
  a_propos: string;
  entreprise: string;
  url: string;
  follower_count: number;
  connection_count: number;
  industry: string;
  location: string;
  last_activity_date: string;
  notes: string;
  status: string;
  photo_profil: string;
  created_at: string;
  updated_at: string;
}

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch competitors
  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompetitors(data || []);
    } catch (error) {
      console.error('Error fetching competitors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les concurrents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompetitor = async (id: number) => {
    try {
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompetitors(competitors.filter(comp => comp.id !== id));
      toast({
        title: "Succès",
        description: "Concurrent supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting competitor:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le concurrent",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'monitoring':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredCompetitors = competitors;

  // Calculate KPIs
  const totalCompetitors = competitors.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des concurrents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Titre de la page et statistique */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Concurrents</h1>
          <p className="text-muted-foreground">
            Gérez et analysez vos concurrents LinkedIn
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
          <Users className="h-5 w-5" />
          <span className="text-sm font-medium">
            {totalCompetitors} concurrent{totalCompetitors > 1 ? 's' : ''} suivi{totalCompetitors > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tableau des concurrents */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <CardTitle>Liste des Concurrents</CardTitle>
              <CardDescription>
                Gérez vos concurrents et consultez leurs informations
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  placeholder="URL du profil LinkedIn..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full sm:w-80"
                />
              </div>
              <Button 
                className="bg-gradient-primary whitespace-nowrap"
                disabled={isSubmitting || !linkedinUrl.trim()}
                onClick={async () => {
                  if (!linkedinUrl.trim()) return;
                  
                  setIsSubmitting(true);
                  try {
                    console.log('Envoi vers edge function:', {
                      data: { url: linkedinUrl.trim() }
                    });

                    const response = await supabase.functions.invoke('add-competitor', {
                      body: { url: linkedinUrl.trim() }
                    });

                    const { data, error } = response;

                    console.log('Réponse de l\'edge function:', {
                      data,
                      error
                    });

                    if (!error && data) {
                      toast({
                        title: "Succès",
                        description: "Concurrent ajouté avec succès",
                      });
                      setLinkedinUrl("");
                      // Refresh the competitors list
                      fetchCompetitors();
                    } else {
                      throw new Error(error?.message || 'Erreur inconnue');
                    }
                  } catch (error) {
                    console.error('Erreur détaillée lors de l\'ajout du concurrent:', error);
                    
                    let errorMessage = "Impossible d'ajouter le concurrent. Veuillez réessayer.";
                    
                    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                      errorMessage = "Impossible de joindre le webhook. Vérifiez que l'URL est correcte et accessible.";
                    } else if (error instanceof Error) {
                      errorMessage = `Erreur: ${error.message}`;
                    }
                    
                    toast({
                      title: "Erreur",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? "Ajout en cours..." : "Ajouter concurrent"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Profil</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Connexions</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetitors.map((competitor) => (
                  <TableRow key={competitor.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        {competitor.photo_profil ? (
                          <img 
                            src={competitor.photo_profil} 
                            alt={competitor.name || 'Photo de profil'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`text-sm font-medium ${competitor.photo_profil ? 'hidden' : ''}`}>
                          {competitor.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{competitor.name || 'Non renseigné'}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{competitor.headline || 'Titre non renseigné'}</div>
                        <div className="text-xs text-muted-foreground">{competitor.public_identifier || 'ID non renseigné'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{competitor.entreprise || 'Non renseigné'}</div>
                        <div className="text-sm text-muted-foreground">{competitor.industry || 'Industrie non renseignée'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{competitor.location || 'Non renseignée'}</TableCell>
                    <TableCell>{competitor.connection_count ? competitor.connection_count.toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>{competitor.follower_count ? competitor.follower_count.toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getStatusColor(competitor.status)} text-white`}>
                        {competitor.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`/competitor-posts/${competitor.id}`, '_blank')}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {competitor.url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteCompetitor(competitor.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Version mobile responsive */}
          <div className="md:hidden space-y-4">
            {filteredCompetitors.map((competitor) => (
              <Card key={competitor.id} className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {competitor.photo_profil ? (
                      <img 
                        src={competitor.photo_profil} 
                        alt={competitor.name || 'Photo de profil'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`text-lg font-medium ${competitor.photo_profil ? 'hidden' : ''}`}>
                      {competitor.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base truncate">{competitor.name || 'Non renseigné'}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{competitor.headline || 'Titre non renseigné'}</p>
                      </div>
                      <Badge variant="secondary" className={`${getStatusColor(competitor.status)} text-white ml-2 flex-shrink-0`}>
                        {competitor.status || 'unknown'}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <div><span className="font-medium">Entreprise:</span> {competitor.entreprise || 'Non renseignée'}</div>
                      <div><span className="font-medium">Industrie:</span> {competitor.industry || 'Non renseignée'}</div>
                      <div><span className="font-medium">Localisation:</span> {competitor.location || 'Non renseignée'}</div>
                      <div className="flex gap-4">
                        <span><span className="font-medium">Connexions:</span> {competitor.connection_count ? competitor.connection_count.toLocaleString() : 'N/A'}</span>
                        <span><span className="font-medium">Followers:</span> {competitor.follower_count ? competitor.follower_count.toLocaleString() : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/competitor-posts/${competitor.id}`, '_blank')}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Posts
                      </Button>
                      {competitor.url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteCompetitor(competitor.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}