'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { clientesService } from '@/lib/api'

const clientFormSchema = z.object({
  razonSocial: z.string().min(2, {
    message: 'La razón social debe tener al menos 2 caracteres.',
  }),
  numeroTVA: z.string().min(2, {
    message: 'El número de TVA debe tener al menos 2 caracteres.',
  }),
  direccion: z.string().min(2, {
    message: 'La dirección debe tener al menos 2 caracteres.',
  }),
  telefono: z.string().min(2, {
    message: 'El teléfono debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, introduce un email válido.',
  }),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientFormProps {
  client?: any
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: client || {
      razonSocial: '',
      numeroTVA: '',
      direccion: '',
      telefono: '',
      email: '',
    },
  })

  async function onSubmit(data: ClientFormValues) {
    try {
      setLoading(true)
      if (client) {
        await clientesService.update(client.id, data)
        toast({
          title: 'Cliente actualizado',
          description: 'El cliente ha sido actualizado correctamente.',
        })
      } else {
        await clientesService.create(data)
        toast({
          title: 'Cliente creado',
          description: 'El cliente ha sido creado correctamente.',
        })
      }
      router.push('/clients')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error al guardar el cliente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="razonSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
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
              <FormLabel>Número de TVA</FormLabel>
              <FormControl>
                <Input placeholder="BE0123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Calle, número, código postal, ciudad" {...field} />
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
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="+32 123 45 67 89" {...field} />
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
                <Input placeholder="ejemplo@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : client ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Button>
      </form>
    </Form>
  )
}