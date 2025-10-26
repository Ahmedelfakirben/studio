import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Esquema de validación para proveedor
const proveedorSchema = z.object({
  nombre: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  direccion: z.string().min(2, "L'adresse doit contenir au moins 2 caractères"),
  numeroTVA: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email("Email invalide").optional().nullable(),
  // notas no está en el modelo de Prisma, así que lo omitimos
});

// Tipo de datos para el formulario
type ProveedorFormValues = z.infer<typeof proveedorSchema>;

// Props para el componente
interface ProveedorFormProps {
  initialData?: any;
  onSubmit: (data: ProveedorFormValues) => Promise<void>;
  isEditing?: boolean;
}

export function ProveedorForm({
  initialData,
  onSubmit,
  isEditing = false,
}: ProveedorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Adaptamos los nombres de campos si es necesario
  const formattedInitialData = initialData
    ? {
        ...initialData,
        nombre: initialData.nombre || initialData.razonSocial,
      }
    : undefined;

  // Configuración del formulario con react-hook-form
  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: formattedInitialData || {
      nombre: "",
      direccion: "",
      numeroTVA: "",
      telefono: "",
      email: "",
    },
  });

  // Manejar el envío del formulario
  const handleSubmit = async (data: ProveedorFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Botones de navegación y guardar */}
        <div className="flex justify-between items-center mb-6">
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
            {isLoading ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le fournisseur"}
          </Button>
        </div>

        {/* Datos básicos del proveedor */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du Fournisseur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du fournisseur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemple.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+33 123456789" 
                          {...field}
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Adresse complète"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroTVA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro TVA</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="FR12345678901" 
                          {...field}
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
