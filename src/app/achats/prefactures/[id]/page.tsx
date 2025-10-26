"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileEdit, Printer, Trash, FileCheck } from "lucide-react";
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
import { prefacturasAchatService } from "@/lib/api";

const PrefacturaAchatDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [prefactura, setPrefactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const fetchPrefactura = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await prefacturasAchatService.getById(params.id);
        // setPrefactura(response.data);
        
        // Por ahora, simulamos datos para desarrollo
        setPrefactura({
          _id: params.id,
          numero: `PREF-ACHAT-2024-00${params.id}`,
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
              descripcion: "Matériel informatique",
              cantidad: 5,
              precioUnitario: 120,
              tipoIVA: 20
            },
            {
              descripcion: "Accessoires",
              cantidad: 10,
              precioUnitario: 15,
              tipoIVA: 20
            }
          ],
          totalHT: 750,
          totalTVA: 150,
          totalTTC: 900,
          notas: "Devis valable jusqu'au 31/10/2024"
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la préfacture",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrefactura();
  }, [params.id, toast]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // En un entorno real, esto haría una llamada a la API
      // await prefacturasAchatService.delete(params.id);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Préfacture eliminada correctamente",
      });
      
      router.push("/achats/prefactures");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar la préfacture",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleConvertToFactura = async () => {
    try {
      setIsConverting(true);
      // En un entorno real, esto haría una llamada a la API
      // const response = await prefacturasAchatService.convertToFactura(params.id);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Préfacture convertida a factura correctamente",
      });
      
      // Aquí normalmente redireccionaríamos a la factura recién creada
      // router.push(`/achats/factures/${response.data._id}`);
      
      // Por ahora, simplemente volvemos a la lista de prefacturas
      router.push("/achats/prefactures");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al convertir la préfacture a factura",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setIsConvertDialogOpen(false);
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
        <Button variant="outline" onClick={() => router.push("/achats/prefactures")}>
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
            onClick={() => router.push(`/achats/prefactures/${params.id}/edit`)}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="default"
            onClick={() => setIsConvertDialogOpen(true)}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Convertir en Facture
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

      <PageHeader title={`Préfacture d'achat: ${prefactura.numero}`} />

      {/* Detalles de la prefactura */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Información del proveedor */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Fournisseur</h3>
            <div className="space-y-2">
              <p className="text-lg font-medium">{prefactura.proveedor?.nombre}</p>
              <p>{prefactura.proveedor?.email}</p>
              <p>{prefactura.proveedor?.telefono}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de la prefactura */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Détails de la Préfacture</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Numéro:</p>
                <p className="font-medium">{prefactura.numero}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'émission:</p>
                <p className="font-medium">{formatDate(prefactura.fecha)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'échéance:</p>
                <p className="font-medium">{formatDate(prefactura.fechaVencimiento)}</p>
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
              {prefactura.items.map((item: any, index: number) => (
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
                  {formatCurrency(prefactura.totalHT)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>TVA</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(prefactura.totalTVA)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>Total TTC</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(prefactura.totalTTC)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Notas */}
      {prefactura.notas && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">{prefactura.notas}</p>
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
              Êtes-vous sûr de vouloir supprimer cette préfacture ? Cette action est
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

      {/* Diálogo de confirmación para convertir a factura */}
      <AlertDialog
        open={isConvertDialogOpen}
        onOpenChange={setIsConvertDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convertir en Facture</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir convertir cette préfacture en facture ? 
              Toutes les informations seront transférées vers une nouvelle facture d'achat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConvertToFactura}
              disabled={isConverting}
            >
              {isConverting ? "Conversion..." : "Convertir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PrefacturaAchatDetailsPage;
