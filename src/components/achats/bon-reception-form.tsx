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

// Esquema de validación para las líneas del albarán
const bonReceptionItemSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  cantidad: z.coerce.number().positive("La cantidad debe ser positiva"),
  precioUnitario: z.coerce.number().positive("El precio debe ser positivo"),
});

// Esquema de validación para el albarán completo
const bonReceptionSchema = z.object({
  proveedorId: z.string().min(1, "Selecciona un proveedor"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  numero: z.string().min(1, "El número de albarán es obligatorio"),
  referencia: z.string().optional(),
  notas: z.string().optional(),
  items: z.array(bonReceptionItemSchema).min(1, "Agrega al menos un artículo"),
});

// Tipo para las props del formulario
interface BonReceptionFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export const BonReceptionForm: React.FC<BonReceptionFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [proveedores, setProveedores] = useState<any[]>([]);

  // Inicializar formulario con react-hook-form
  const form = useForm<z.infer<typeof bonReceptionSchema>>({
    resolver: zodResolver(bonReceptionSchema),
    defaultValues: initialData || {
      proveedorId: "",
      fecha: new Date().toISOString().split("T")[0],
      numero: "",
      referencia: "",
      notas: "",
      items: [
        {
          descripcion: "",
          cantidad: 1,
          precioUnitario: 0,
        },
      ],
    },
  });

  // Configurar fieldArray para los items del albarán
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
  const [totalHT, setTotalHT] = useState(0);

  // Calcular total cuando cambian los items
  useEffect(() => {
    if (!watchItems || watchItems.length === 0) return;

    let total = 0;

    watchItems.forEach((item) => {
      if (
        item.cantidad &&
        item.precioUnitario &&
        !isNaN(item.cantidad) &&
        !isNaN(item.precioUnitario)
      ) {
        total += item.cantidad * item.precioUnitario;
      }
    });

    setTotalHT(total);
  }, [watchItems]);

  // Manejar envío del formulario
  const handleSubmit = async (values: z.infer<typeof bonReceptionSchema>) => {
    try {
      setIsLoading(true);
      
      // Agregar total calculado a los valores
      const dataToSubmit = {
        ...values,
        totalHT: totalHT,
      };
      
      await onSubmit(dataToSubmit);
      
      toast({
        title: "Éxito",
        description: `Bon de réception ${isEditing ? "actualizado" : "creado"} correctamente`,
      });
      
      // Redirigir a la lista de albaranes
      router.push("/achats/bons-de-reception");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.mensaje ||
          `Error al ${isEditing ? "actualizar" : "crear"} el bon de réception`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar nuevo item al albarán
  const addItem = () => {
    append({
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
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
              : "Créer Bon de Réception"}
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
                              key={proveedor._id}
                              value={proveedor._id}
                            >
                              {proveedor.nombre}
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
                      <FormLabel>Numéro de Bon</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="BR-2024-001"
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
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de réception</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
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
        </div>

        {/* Detalle de los items */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Détail des articles</h3>
                <Button type="button" onClick={addItem} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter article
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-end border-b pb-4"
                >
                  <div className="col-span-6">
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

                  <div className="col-span-3">
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

              {/* Total */}
              <div className="pt-4">
                <div className="ml-auto w-full max-w-xs">
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Total HT:</span>
                    <span>
                      {totalHT.toLocaleString("fr-FR", {
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
                      placeholder="Notes additionnelles pour ce bon de réception"
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
