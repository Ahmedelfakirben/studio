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
import { facturasAchatService } from "@/lib/api";

const FacturaAchatDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [factura, setFactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await facturasAchatService.getById(params.id);
        // setFactura(response.data);
        
        // Por ahora, simulamos datos para desarrollo
        setFactura({
          _id: params.id,
          numero: `FAC-ACHAT-2024-00${params.id}`,
          fecha: "2024-09-01",
          fechaVencimiento: "2024-10-01",
          proveedor: {
            _id: "123",
            nombre: "Fournisseur Example",
            email: "example@fournisseur.com",
            telefono: "+33 123456789"
          },
          items: [
            {
              descripcion: "Matériel de construction",
              cantidad: 5,
              precioUnitario: 120,
              tipoIVA: 20
            }
          ],
          totalHT: 600,
          totalTVA: 120,
          totalTTC: 720,
          notas: "Commande urgente, livraison effectuée le 31/08/2024",
          formaPago: "transferencia",
          metodoPago: "banco"
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la factura",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactura();
  }, [params.id, toast]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // En un entorno real, esto haría una llamada a la API
      // await facturasAchatService.delete(params.id);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Factura eliminada correctamente",
      });
      
      router.push("/achats/factures");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar la factura",
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

  const getFormaPagoLabel = (key: string): string => {
    const formaPagoMap: Record<string, string> = {
      transferencia: "Virement",
      efectivo: "Espèces",
      cheque: "Chèque",
      tarjeta: "Carte Bancaire",
    };
    return formaPagoMap[key] || key;
  };

  const getMetodoPagoLabel = (key: string): string => {
    const metodoPagoMap: Record<string, string> = {
      banco: "Banque",
      caja: "Caisse",
    };
    return metodoPagoMap[key] || key;
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
        <Button variant="outline" onClick={() => router.push("/achats/factures")}>
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
            onClick={() => router.push(`/achats/factures/${params.id}/edit`)}
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

      <PageHeader title={`Facture d'achat: ${factura.numero}`} />

      {/* Detalles de la factura */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Información del proveedor */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Fournisseur</h3>
            <div className="space-y-2">
              <p className="text-lg font-medium">{factura.proveedor?.nombre}</p>
              <p>{factura.proveedor?.email}</p>
              <p>{factura.proveedor?.telefono}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de la factura */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Détails de la Facture</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Numéro:</p>
                <p className="font-medium">{factura.numero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'émission:</p>
                <p className="font-medium">{formatDate(factura.fecha)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'échéance:</p>
                <p className="font-medium">{formatDate(factura.fechaVencimiento)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Méthode de paiement:</p>
                <p className="font-medium">
                  {getFormaPagoLabel(factura.formaPago)} ({getMetodoPagoLabel(factura.metodoPago)})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de conceptos */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Détail des articles</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix Unitaire</TableHead>
                <TableHead className="text-right">TVA (%)</TableHead>
                <TableHead className="text-right">Total HT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factura.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell className="text-right">{item.cantidad}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.precioUnitario)}
                  </TableCell>
                  <TableCell className="text-right">{item.tipoIVA}%</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.cantidad * item.precioUnitario)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total HT</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(factura.totalHT)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>TVA</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(factura.totalTVA)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>Total TTC</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(factura.totalTTC)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Notas */}
      {factura.notas && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">{factura.notas}</p>
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
              Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est
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

export default FacturaAchatDetailsPage;
