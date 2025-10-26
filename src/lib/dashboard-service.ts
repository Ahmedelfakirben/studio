import {
  facturasService,
  prefacturasService,
  clientesService,
  facturasAchatService,
  fraisEssenceService,
  locationMaterielService
} from './api';

export interface DashboardStats {
  totalRevenue: number;
  salesInvoicesCount: number;
  totalExpenses: number;
  purchaseInvoicesCount: number;
  activeClients: number;
  profitMargin: number;
}

export interface ChartDataPoint {
  month: string;
  revenus: number;
  depenses: number;
}

export interface RecentInvoice {
  id: string;
  numero: string;
  cliente: string;
  fecha: string;
  montoTTC: number;
  status?: string;
}

export interface RecentExpense {
  id: string;
  type: 'Achat Facture' | 'Frais Essence' | 'Location Matériel';
  description: string;
  amount: number;
  date: Date;
}

/**
 * Obtiene las estadísticas del dashboard desde la API
 */
export async function getDashboardStatsFromAPI(): Promise<DashboardStats> {
  try {
    // Obtener facturas de venta
    const salesInvoicesResponse = await facturasService.getAll();
    const salesInvoices = salesInvoicesResponse.data || [];

    // Obtener facturas de compra
    let purchaseInvoices = [];
    try {
      const purchaseResponse = await facturasAchatService.getAll();
      purchaseInvoices = purchaseResponse.data || [];
    } catch (e) {
      console.warn('No purchase invoices available');
    }

    // Obtener gastos de combustible
    let gasExpenses = [];
    try {
      const gasResponse = await fraisEssenceService.getAll();
      gasExpenses = gasResponse.data || [];
    } catch (e) {
      console.warn('No gas expenses available');
    }

    // Obtener location materiel
    let locationExpenses = [];
    try {
      const locationResponse = await locationMaterielService.getAll();
      locationExpenses = locationResponse.data || [];
    } catch (e) {
      console.warn('No location expenses available');
    }

    // Obtener clientes
    const clientsResponse = await clientesService.getAll();
    const clients = clientsResponse.data || [];

    // Calcular totales
    const totalRevenue = salesInvoices.reduce((acc: number, inv: any) =>
      acc + (inv.montoTTC || 0), 0
    );

    const purchaseTotal = purchaseInvoices.reduce((acc: number, inv: any) =>
      acc + (inv.montoTTC || 0), 0
    );

    const gasTotal = gasExpenses.reduce((acc: number, exp: any) =>
      acc + (exp.monto || 0), 0
    );

    const locationTotal = locationExpenses.reduce((acc: number, loc: any) =>
      acc + (loc.totalGeneral || 0), 0
    );

    const totalExpenses = purchaseTotal + gasTotal + locationTotal;

    const profitMargin = totalRevenue > 0
      ? ((totalRevenue - totalExpenses) / totalRevenue) * 100
      : 0;

    return {
      totalRevenue,
      salesInvoicesCount: salesInvoices.length,
      totalExpenses,
      purchaseInvoicesCount: purchaseInvoices.length + gasExpenses.length + locationExpenses.length,
      activeClients: clients.length,
      profitMargin,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

/**
 * Obtiene datos para el gráfico de ingresos/gastos
 */
export async function getChartDataFromAPI(): Promise<ChartDataPoint[]> {
  try {
    const monthlyData: { [key: string]: { revenus: number; depenses: number } } = {};

    // Obtener facturas de venta
    const salesInvoicesResponse = await facturasService.getAll();
    const salesInvoices = salesInvoicesResponse.data || [];

    // Obtener facturas de compra
    let purchaseInvoices = [];
    try {
      const purchaseResponse = await facturasAchatService.getAll();
      purchaseInvoices = purchaseResponse.data || [];
    } catch (e) {
      console.warn('No purchase invoices for chart');
    }

    // Obtener gastos de combustible
    let gasExpenses = [];
    try {
      const gasResponse = await fraisEssenceService.getAll();
      gasExpenses = gasResponse.data || [];
    } catch (e) {
      console.warn('No gas expenses for chart');
    }

    // Obtener location materiel
    let locationExpenses = [];
    try {
      const locationResponse = await locationMaterielService.getAll();
      locationExpenses = locationResponse.data || [];
    } catch (e) {
      console.warn('No location expenses for chart');
    }

    // Procesar facturas de venta
    salesInvoices.forEach((invoice: any) => {
      const date = new Date(invoice.fecha);
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { revenus: 0, depenses: 0 };
      }
      monthlyData[key].revenus += invoice.montoTTC || 0;
    });

    // Procesar facturas de compra
    purchaseInvoices.forEach((invoice: any) => {
      const date = new Date(invoice.fecha);
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { revenus: 0, depenses: 0 };
      }
      monthlyData[key].depenses += invoice.montoTTC || 0;
    });

    // Procesar gastos de combustible
    gasExpenses.forEach((expense: any) => {
      const date = new Date(expense.fecha);
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { revenus: 0, depenses: 0 };
      }
      monthlyData[key].depenses += expense.monto || 0;
    });

    // Procesar location materiel
    locationExpenses.forEach((location: any) => {
      const date = new Date(location.createdAt);
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { revenus: 0, depenses: 0 };
      }
      monthlyData[key].depenses += location.totalGeneral || 0;
    });

    // Convertir a array y ordenar por meses
    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month: month.split(' ')[0],
      ...data
    })).sort((a, b) => {
      const months = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    return chartData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

/**
 * Obtiene las facturas recientes
 */
export async function getRecentInvoicesFromAPI(limit: number = 5): Promise<RecentInvoice[]> {
  try {
    const response = await facturasService.getAll();
    const invoices = response.data || [];

    return invoices
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, limit)
      .map((inv: any) => ({
        id: inv.id,
        numero: inv.numero,
        cliente: inv.cliente?.razonSocial || 'Cliente desconocido',
        fecha: inv.fecha,
        montoTTC: inv.montoTTC,
        status: 'Émise' // Puedes agregar lógica de status si existe en tu modelo
      }));
  } catch (error) {
    console.error('Error fetching recent invoices:', error);
    return [];
  }
}

/**
 * Obtiene los gastos recientes (facturas compra, gasolina, location)
 */
export async function getRecentExpensesFromAPI(limit: number = 5): Promise<RecentExpense[]> {
  try {
    const allExpenses: RecentExpense[] = [];

    // Facturas de compra
    try {
      const purchaseResponse = await facturasAchatService.getAll();
      const purchases = purchaseResponse.data || [];
      purchases.slice(0, 2).forEach((inv: any) => {
        allExpenses.push({
          id: inv.id,
          type: 'Achat Facture',
          description: `Facture de ${inv.proveedor?.razonSocial || 'Fournisseur'}`,
          amount: inv.montoTTC || 0,
          date: new Date(inv.fecha),
        });
      });
    } catch (e) {
      console.warn('No purchase invoices for expenses');
    }

    // Gastos de combustible
    try {
      const gasResponse = await fraisEssenceService.getAll();
      const gasExpenses = gasResponse.data || [];
      gasExpenses.slice(0, 2).forEach((exp: any) => {
        allExpenses.push({
          id: exp.id,
          type: 'Frais Essence',
          description: exp.designacionServicio,
          amount: exp.monto,
          date: new Date(exp.fecha),
        });
      });
    } catch (e) {
      console.warn('No gas expenses');
    }

    // Location materiel
    try {
      const locationResponse = await locationMaterielService.getAll();
      const locations = locationResponse.data || [];
      locations.slice(0, 1).forEach((loc: any) => {
        allExpenses.push({
          id: loc.id,
          type: 'Location Matériel',
          description: `Feuille de location ${loc.periodo}`,
          amount: loc.totalGeneral,
          date: new Date(loc.createdAt),
        });
      });
    } catch (e) {
      console.warn('No location expenses');
    }

    // Ordenar por fecha descendente y limitar
    return allExpenses
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent expenses:', error);
    return [];
  }
}
