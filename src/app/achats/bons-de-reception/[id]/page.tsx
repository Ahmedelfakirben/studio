"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileEdit, Printer, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bonsReceptionService } from "@/lib/api";

const BonReceptionDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [bon, setBon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBon = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await bonsReceptionService.getById(params.id);
        // setBon(response.data);
        
        // Por ahora, simulamos datos para desarrollo
        setBon({
          _id: params.id,
          numero: `BR-2024-00${params.id}`,
          fecha: "2024-09-01",
          proveedor: {
            _id: "123",
            nombre: "Fournisseur Example",
            email: "example@fournisseur.com",
            telefono: "+33 123456789"
          },
          items: [
            {
              descripcion: "Matériel de bureau",
              cantidad: 5,
              precioUnitario: 120
            },
            {
              descripcion: "Fournitures diverses",
              cantidad: 10,
              precioUnitario: 15
            }
          ],
          totalHT: 750,
          notas: "Livraison effectuée le 01/09/2024"
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar el bon de réception",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBon();
  }, [params.id, toast]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // En un entorno real, esto haría una llamada a la API
      // await bonsReceptionService.delete(params.id);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Bon de réception eliminado correctamente",
      });
      
      router.push("/achats/bons-de-reception");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar el bon de réception",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-60" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera con botones de acción */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/achats/bons-de-reception")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/achats/bons-de-reception/${params.id}/edit`)}
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

      <PageHeader title={`Bon de Réception: ${bon.numero}`} />

      {/* Detalles del bon */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Información del proveedor */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Fournisseur</h3>
            <div className="space-y-2">
              <p className="text-lg font-medium">{bon.proveedor?.nombre}</p>
              <p>{bon.proveedor?.email}</p>
              <p>{bon.proveedor?.telefono}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información del bon de réception */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Détails du Bon</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Numéro:</p>
                <p className="font-medium">{bon.numero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de réception:</p>
                <p className="font-medium">{formatDate(bon.fecha)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de artículos */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Articles reçus</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix Unitaire</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bon.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell className="text-right">{item.cantidad}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.precioUnitario)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.cantidad * item.precioUnitario)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total HT</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(bon.totalHT)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Notas */}
      {bon.notas && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">{bon.notas}</p>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bon de réception ? Cette action est
              irréversible.
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
};

export default BonReceptionDetailsPage;
