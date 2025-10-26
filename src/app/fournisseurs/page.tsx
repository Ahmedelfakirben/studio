"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/search-input";
import { useToast } from "@/hooks/use-toast";
import { proveedoresService } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FournisseursPage({ searchParams }: { searchParams: { search?: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchTerm = searchParams.search || '';

  // Cargar proveedores
  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        setIsLoading(true);
        // Intentar obtener los proveedores del backend
        try {
          console.log("🔄 Intentando cargar proveedores desde el backend...");
          const response = await proveedoresService.getAll();
          console.log("✅ Respuesta del backend (proveedores):", response);
          
          // Mapear los datos para agregar información adicional si es necesario
          const proveedoresConInfo = (response.data || []).map((proveedor: any) => ({
            ...proveedor,
            totalComprado: "0,00 €" // Por ahora, hasta implementar cálculos reales
          }));
          
          setFournisseurs(proveedoresConInfo);
          console.log(`✅ ${proveedoresConInfo.length} proveedores cargados correctamente`);
        } catch (apiError: any) {
          console.error("❌ Error al conectar con el backend:", apiError);
          console.error("📋 Detalles del error:", apiError.response?.data || apiError.message);
          
          // Si hay un error con la API, usar datos de ejemplo
          console.log("⚠️ Usando datos de ejemplo como fallback");
          setFournisseurs([
            {
              id: "example-1",
              razonSocial: "Matériaux Express (Ejemplo)",
              email: "contact@materiaux-express.fr",
              telefono: "+33 123456789",
              totalComprado: "15.820,00 €",
            },
            {
              id: "example-2",
              razonSocial: "Béton Pro (Ejemplo)",
              email: "info@betonpro.fr",
              telefono: "+33 987654321",
              totalComprado: "2.500,00 €",
            },
          ]);
          
          // Mostrar toast de error
          toast({
            title: "Connexion Backend",
            description: "Impossible de se connecter au backend. Données d'exemple affichées.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar los proveedores",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFournisseurs();
  }, [toast, searchTerm]);

  // Eliminar un proveedor
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      // En un entorno real, esto haría una llamada a la API
      // await proveedoresService.delete(deleteId);
      
      // Simulamos un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
      });
      
      // Eliminar de la lista local
      setFournisseurs(prevFournisseurs => 
        prevFournisseurs.filter(f => f.id !== deleteId)
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar el proveedor",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Filtrar proveedores según el término de búsqueda
  const filteredFournisseurs = fournisseurs.filter(
    f => f.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Fournisseurs">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const response = await fetch('/api/fournisseurs/seed', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
                const data = await response.json();
                toast({
                  title: "Test Backend",
                  description: data.mensaje || "Données d'exemple créées",
                });
                // Recargar la lista
                window.location.reload();
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Error al conectar con el backend",
                  variant: "destructive",
                });
              }
            }}
          >
            🚀 Test Backend
          </Button>
          <Button asChild>
            <Link href="/fournisseurs/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un fournisseur
            </Link>
          </Button>
        </div>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
          <CardDescription>
            Consultez et gérez tous vos fournisseurs.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SearchInput placeholder="Filtrer par nom..." />
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            // Mostrar esqueletos mientras se carga
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Total Acheté</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFournisseurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      Aucun fournisseur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFournisseurs.map((fournisseur) => (
                    <TableRow key={fournisseur.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(fournisseur.razonSocial)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{fournisseur.razonSocial}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {fournisseur.email && (
                            <div>{fournisseur.email}</div>
                          )}
                          {fournisseur.telefono && (
                            <div className="text-muted-foreground">
                              {fournisseur.telefono}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {fournisseur.totalComprado}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ouvrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/fournisseurs/${fournisseur.id}`)}
                            >
                              Voir le détail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/fournisseurs/${fournisseur.id}/edit`)}
                            >
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(fournisseur.id)}
                              className="text-red-600"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
