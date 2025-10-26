import { useState, useEffect } from 'react';
import { clientesService } from '@/lib/api';

export function useClients(searchTerm: string = '') {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientesService.getAll();
        const filteredClients = response.data.filter((client: any) =>
          client.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Transformar los datos para coincidir con el formato esperado
        const formattedClients = filteredClients.map((client: any) => ({
          id: client.id,
          name: client.razonSocial,
          initials: client.razonSocial.substring(0, 2).toUpperCase(),
          projects: '0', // TODO: Implementar conteo de proyectos
          totalBilled: '0 €', // TODO: Implementar suma de facturas
        }));
        
        setClients(formattedClients);
        setError(null);
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [searchTerm]);

  return { clients, loading, error };
}