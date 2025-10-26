"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileEdit, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { proveedoresService } from "@/lib/api";

export default function FournisseurDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [fournisseur, setFournisseur] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar datos del proveedor
  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await proveedoresService.getById(params.id);
        // setFournisseur(response.data);
        
        // Simulamos los datos para desarrollo
        setTimeout(() => {
          setFournisseur({
            id: params.id,
            razonSocial: "Matériaux Express",
            email: "contact@materiaux-express.fr",
            telefono: "+33 123456789",
            direccion: "123 Rue de la Construction, 75001 Paris, France",
            numeroTVA: "FR12345678901"
          });
          setIsLoading(false);
        }, 500);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar los datos del proveedor",
          variant: "destructive",
        });
        router.push("/fournisseurs");
      }
    };

    fetchFournisseur();
  }, [params.id, toast, router]);

  // Eliminar proveedor
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // En un entorno real, esto haría una llamada a la API
      // await proveedoresService.delete(params.id);
      
      // Simulamos un delay para mostrar el efecto de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
      });
      
      // Redirigir a la lista de proveedores
      router.push("/fournisseurs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar el proveedor",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Mostrar esqueleto mientras carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botones de navegación y acciones */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/fournisseurs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/fournisseurs/${params.id}/edit`)}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <PageHeader title={fournisseur.razonSocial} />

      {/* Información del proveedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Coordonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fournisseur.email && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email:</div>
                <div>{fournisseur.email}</div>
              </div>
            )}
            {fournisseur.telefono && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Téléphone:</div>
                <div>{fournisseur.telefono}</div>
              </div>
            )}
            {fournisseur.direccion && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Adresse:</div>
                <div className="whitespace-pre-line">{fournisseur.direccion}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información fiscal */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Fiscales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fournisseur.numeroTVA && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">TVA:</div>
                <div>{fournisseur.numeroTVA}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est
              irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
