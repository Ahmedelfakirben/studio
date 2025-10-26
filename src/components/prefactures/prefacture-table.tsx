"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Prefactura {
  id: string;
  numero: string;
  fecha: string;
  referenciaProyecto?: string;
  cliente: {
    razonSocial: string;
  };
  montoHT: number;
  montTVA: number;
  montoTTC: number;
}

interface PrefactureTableProps {
  prefacturas: Prefactura[];
  onDelete: (id: string) => Promise<void>;
}

export function PrefactureTable({ prefacturas, onDelete }: PrefactureTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (prefacturas.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              No hay prefacturas registradas. Crea una para empezar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead className="text-right">Monto HT</TableHead>
                <TableHead className="text-right">TVA</TableHead>
                <TableHead className="text-right">Monto TTC</TableHead>
                <TableHead className="w-[70px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prefacturas.map((prefactura) => (
                <TableRow key={prefactura.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{prefactura.numero}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(prefactura.fecha).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>{prefactura.cliente.razonSocial}</TableCell>
                  <TableCell>
                    {prefactura.referenciaProyecto || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {prefactura.montoHT.toFixed(2)} MAD
                  </TableCell>
                  <TableCell className="text-right">
                    {prefactura.montTVA.toFixed(2)} MAD
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {prefactura.montoTTC.toFixed(2)} MAD
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/prefactures/${prefactura.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/prefactures/${prefactura.id}/edit`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(prefactura.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la prefactura
              permanentemente junto con todas sus líneas de detalle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
