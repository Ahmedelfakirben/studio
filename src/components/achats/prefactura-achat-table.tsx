import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Eye, FileEdit, MoreHorizontal, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface PrefacturaAchatTableProps {
  prefacturas: any[];
  onDelete: (id: string) => Promise<void>;
}

export const PrefacturaAchatTable: React.FC<PrefacturaAchatTableProps> = ({
  prefacturas,
  onDelete,
}) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  // Manejador para eliminar una prefactura
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleteLoading(true);
      await onDelete(deleteId);
    } finally {
      setIsDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Formato para mostrar la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  return (
    <>
      <Card className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Numéro</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prefacturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  Aucune préfacture trouvée
                </TableCell>
              </TableRow>
            ) : (
              prefacturas.map((prefactura) => (
                <TableRow key={prefactura._id}>
                  <TableCell className="font-medium">{prefactura.numero}</TableCell>
                  <TableCell>{formatDate(prefactura.fecha)}</TableCell>
                  <TableCell>{prefactura.proveedor?.nombre || "Non spécifié"}</TableCell>
                  <TableCell className="text-right">
                    {prefactura.totalHT.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {prefactura.totalTVA.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {prefactura.totalTTC.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/achats/prefactures/${prefactura._id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/achats/prefactures/${prefactura._id}/edit`)}
                        >
                          <FileEdit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(prefactura._id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
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
      </Card>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette préfacture ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
