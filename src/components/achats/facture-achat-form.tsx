import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, Plus, Save, ArrowLeft } from "lucide-react";
import { proveedoresService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Esquema de validación para las líneas de factura
const facturaItemSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.coerce.number().positive("La cantidad debe ser positiva"),
  precioUnitario: z.coerce.number().positive("El precio debe ser positivo"),
  tipoIVA: z.coerce.number().min(0).max(100),
});

// Esquema de validación para la factura completa
const facturaSchema = z.object({
  proveedorId: z.string().min(1, "Selecciona un proveedor"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria"),
  numero: z.string().min(1, "El número de factura es obligatorio"),
  referencia: z.string().optional(),
  notas: z.string().optional(),
  formaPago: z.string().min(1, "Selecciona una forma de pago"),
  metodoPago: z.string().min(1, "Selecciona un método de pago"),
  items: z.array(facturaItemSchema).min(1, "Agrega al menos un concepto"),
});

// Tipo para las props del formulario
interface FacturaAchatFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export const FacturaAchatForm: React.FC<FacturaAchatFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [proveedores, setProveedores] = useState<any[]>([]);

  // Inicializar formulario con react-hook-form
  const form = useForm<z.infer<typeof facturaSchema>>({
    resolver: zodResolver(facturaSchema),
    defaultValues: initialData || {
      proveedorId: "",
      fecha: new Date().toISOString().split("T")[0],
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      numero: "",
      referencia: "",
      notas: "",
      formaPago: "transferencia",
      metodoPago: "banco",
      items: [
        {
          descripcion: "",
          cantidad: 1,
          precioUnitario: 0,
          tipoIVA: 20,
        },
      ],
    },
  });

  // Configurar fieldArray para los items de la factura
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Cargar proveedores al iniciar
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await proveedoresService.getAll();
        setProveedores(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los proveedores",
          variant: "destructive",
        });
      }
    };

    fetchProveedores();
  }, [toast]);

  // Vigilar cambios en los items para calcular totales
  const watchItems = form.watch("items");
  const [totales, setTotales] = useState({
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
  });

  // Calcular totales cuando cambian los items
  useEffect(() => {
    if (!watchItems || watchItems.length === 0) return;

    let totalHT = 0;
    let totalTVA = 0;

    watchItems.forEach((item) => {
      if (
        item.cantidad &&
        item.precioUnitario &&
        !isNaN(item.cantidad) &&
        !isNaN(item.precioUnitario)
      ) {
        const lineaHT = item.cantidad * item.precioUnitario;
        totalHT += lineaHT;

        if (item.tipoIVA && !isNaN(item.tipoIVA)) {
          totalTVA += (lineaHT * item.tipoIVA) / 100;
        }
      }
    });

    const totalTTC = totalHT + totalTVA;

    setTotales({
      totalHT,
      totalTVA,
      totalTTC,
    });
  }, [watchItems]);

  // Manejar envío del formulario
  const handleSubmit = async (values: z.infer<typeof facturaSchema>) => {
    try {
      setIsLoading(true);
      
      // Agregar totales calculados a los valores
      const dataToSubmit = {
        ...values,
        totalHT: totales.totalHT,
        totalTVA: totales.totalTVA,
        totalTTC: totales.totalTTC,
      };
      
      await onSubmit(dataToSubmit);
      
      toast({
        title: "Éxito",
        description: `Factura ${isEditing ? "actualizada" : "creada"} correctamente`,
      });
      
      // Redirigir a la lista de facturas
      router.push("/achats/factures");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.mensaje ||
          `Error al ${isEditing ? "actualizar" : "crear"} la factura`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar nuevo item a la factura
  const addItem = () => {
    append({
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
      tipoIVA: 20,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Encabezado del formulario */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading
              ? "Enregistrement..."
              : isEditing
              ? "Enregistrer"
              : "Créer Facture"}
          </Button>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="proveedorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fournisseur</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un fournisseur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proveedores.map((proveedor) => (
                            <SelectItem
                              key={proveedor.id}
                              value={proveedor.id}
                            >
                              {proveedor.razonSocial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Facture</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="FAC-ACHAT-2024-001"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référence (Optionnel)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Référence du fournisseur"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'émission</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaVencimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'échéance</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="formaPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode de paiement</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="transferencia">
                              Virement
                            </SelectItem>
                            <SelectItem value="efectivo">Espèces</SelectItem>
                            <SelectItem value="cheque">Chèque</SelectItem>
                            <SelectItem value="tarjeta">
                              Carte Bancaire
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Méthode de paiement</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="banco">Banque</SelectItem>
                            <SelectItem value="caja">Caisse</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalle de los items */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Détail de la facture</h3>
                <Button type="button" onClick={addItem} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter ligne
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end border-b pb-4"
                >
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.descripcion`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.cantidad`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>
                            Quantité
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="1"
                              min="1"
                              placeholder="Quantité"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.precioUnitario`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>
                            Prix Unitaire
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Prix"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.tipoIVA`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>
                            TVA (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="1"
                              min="0"
                              max="100"
                              placeholder="TVA %"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    {watchItems && watchItems[index] && (
                      <div className="text-right font-medium pt-2">
                        {(
                          (watchItems[index].cantidad || 0) *
                          (watchItems[index].precioUnitario || 0)
                        ).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    )}
                  </div>

                  <div className="col-span-0 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length <= 1}
                      className={fields.length <= 1 ? "invisible" : ""}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Totales */}
              <div className="pt-4">
                <div className="ml-auto w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total HT:</span>
                    <span>
                      {totales.totalHT.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total TVA:</span>
                    <span>
                      {totales.totalTVA.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Total TTC:</span>
                    <span>
                      {totales.totalTTC.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notes additionnelles pour cette facture"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
