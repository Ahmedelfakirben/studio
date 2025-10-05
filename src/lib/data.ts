// This file contains mock data for the application.
// In a real application, this data would be fetched from a database.

const parseAmount = (amount: string) => {
    return parseFloat(amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export const allSalesInvoices = [
    {
        id: "FAC-2024-001",
        client: "Mairie de Ville-Haute",
        date: "2024-07-26",
        amount: "51,648.00€",
        status: "Payée",
    },
    {
        id: "FAC-2024-002",
        client: "Constructa S.A.",
        date: "2024-07-15",
        amount: "12,350.50€",
        status: "En attente",
    },
    {
        id: "FAC-2024-003",
        client: "BTP-IDF",
        date: "2024-07-05",
        amount: "8,900.00€",
        status: "En retard",
    },
     {
        id: "FAC-2024-004",
        client: "Chantier Central",
        date: "2024-06-28",
        amount: "23,450.00€",
        status: "Payée",
    },
];

export const allPurchaseInvoices = [
    {
        id: "FA-2024-001",
        fournisseur: "Matériaux Express",
        date: "2024-07-25",
        amount: "15,820.00€",
        status: "Payée",
    },
    {
        id: "FA-2024-002",
        fournisseur: "Béton Pro",
        date: "2024-07-15",
        amount: "2,500.00€",
        status: "En attente",
    },
];

export const allClients = [
    {
        id: "client-001",
        name: "Chantier Central",
        initials: "CC",
        projects: 2,
        totalBilled: "23,450.00€",
    },
    {
        id: "client-002",
        name: "Mairie de Ville-Haute",
        initials: "MV",
        projects: 1,
        totalBilled: "51,648.00€",
    },
    {
        id: "client-003",
        name: "Constructa S.A.",
        initials: "CS",
        projects: 2,
        totalBilled: "24,701.00€",
    },
    {
        id: "client-004",
        name: "BTP-IDF",
        initials: "BI",
        projects: 1,
        totalBilled: "8,900.00€",
    },
    {
        id: "client-005",
        name: "Client S.A.",
        initials: "CS",
        projects: 1,
        totalBilled: "28,202.50€",
    },
];

export const allPreInvoices = [
    {
        id: "PRE-2024-001",
        client: "Client S.A.",
        date: "2024-07-25",
        amount: "28,202.50€",
        status: "Approuvée",
    },
    {
        id: "PRE-2024-002",
        client: "Mairie de Ville-Haute",
        date: "2024-07-20",
        amount: "51,648.00€",
        status: "En attente",
    },
    {
        id: "PRE-2024-003",
        client: "Constructa S.A.",
        date: "2024-07-10",
        amount: "12,350.50€",
        status: "Refusée",
    },
];

export const allDeliveryNotes = [
    {
        id: "BL-2024-001",
        client: "Chantier Central",
        date: "2024-07-26",
        status: "Livré",
    },
    {
        id: "BL-2024-002",
        client: "Mairie de Ville-Haute",
        date: "2024-07-24",
        status: "Livré",
    },
    {
        id: "BL-2024-003",
        client: "Constructa S.A.",
        date: "2024-07-22",
        status: "Partiellement livré",
    },
    {
        id: "BL-2024-004",
        client: "BTP-IDF",
        date: "2024-07-20",
        status: "Annulé",
    },
];

export const allFournisseurs = [
    {
        id: "fourn-001",
        name: "Matériaux Express",
        initials: "ME",
        totalBilled: "15,820.00€",
    },
    {
        id: "fourn-002",
        name: "Béton Pro",
        initials: "BP",
        totalBilled: "2,500.00€",
    },
    {
        id: "fourn-003",
        name: "Acier Durable S.L.",
        initials: "AD",
        totalBilled: "9,750.00€",
    },
];

export const allPurchasePreInvoices = [
    {
        id: "PA-2024-001",
        fournisseur: "Matériaux Express",
        date: "2024-07-20",
        amount: "15,820.00€",
        status: "Approuvée",
    },
    {
        id: "PA-2024-002",
        fournisseur: "Acier Durable S.L.",
        date: "2024-07-18",
        amount: "9,750.00€",
        status: "En attente",
    },
];

export const allReceptionNotes = [
    {
        id: "BR-2024-001",
        fournisseur: "Matériaux Express",
        date: "2024-07-24",
        status: "Reçu",
    },
    {
        id: "BR-2024-002",
        fournisseur: "Béton Pro",
        date: "2024-07-22",
        status: "Partiellement Reçu",
    },
    {
        id: "BR-2024-003",
        fournisseur: "Acier Durable S.L.",
        date: "2024-07-20",
        status: "En attente",
    },
];

export const allRentalSheets = [
    {
        id: "loc-juillet-2024",
        month: "Juillet 2024",
        date: "2024-07-31",
        amount: "3,740.00€",
        status: "Finalisé",
    },
    {
        id: "loc-juin-2024",
        month: "Juin 2024",
        date: "2024-06-30",
        amount: "5,200.00€",
        status: "Facturé",
    },
];

export const initialGasExpenses = [
    { id: 1, date: '01/07/2024', bl: 'BL-G-001', ds: 'Véhicule A - Gasoil', mt: 55.50 },
    { id: 2, date: '02/07/2024', bl: 'BL-G-002', ds: 'Véhicule B - Gasoil', mt: 62.00 },
    { id: 3, date: '03/07/2024', bl: 'BL-G-003', ds: 'Camion 1 - Gasoil', mt: 150.25 },
    { id: 4, date: '04/07/2024', bl: 'BL-G-004', ds: 'Véhicule A - Gasoil', mt: 58.75 },
    { id: 5, date: '05/07/2024', bl: 'BL-G-005', ds: 'Groupe Électrogène', mt: 45.00 },
    { id: 6, date: '08/07/2024', bl: 'BL-G-006', ds: 'Camion 2 - AdBlue', mt: 30.00 },
    { id: 7, date: '09/07/2024', bl: 'BL-G-007', ds: 'Véhicule B - Gasoil', mt: 61.30 },
    { id: 8, date: '10/07/2024', bl: 'BL-G-008', ds: 'Camion 1 - Gasoil', mt: 145.80 },
    { id: 9, date: '11/07/2024', bl: 'BL-G-009', ds: 'Véhicule A - Gasoil', mt: 59.90 },
    { id: 10, date: '12/07/2024', bl: 'BL-G-010', ds: 'Nacelle - Essence', mt: 35.00 },
];

// Getter functions with filtering
export const getAllSalesInvoices = (searchTerm: string = '') => {
    return allSalesInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllPurchaseInvoices = (searchTerm: string = '') => {
    return allPurchaseInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllClients = (searchTerm: string = '') => {
    return allClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllPreInvoices = (searchTerm: string = '') => {
    return allPreInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllDeliveryNotes = (searchTerm: string = '') => {
    return allDeliveryNotes.filter(note => 
        note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllFournisseurs = (searchTerm: string = '') => {
    return allFournisseurs.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllPurchasePreInvoices = (searchTerm: string = '') => {
    return allPurchasePreInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllReceptionNotes = (searchTerm: string = '') => {
    return allReceptionNotes.filter(note => 
        note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getAllRentalSheets = (searchTerm: string = '') => {
    return allRentalSheets.filter(sheet => 
        sheet.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getGasExpenses = (searchTerm: string = '') => {
    return initialGasExpenses.filter(expense => 
        expense.bl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.ds.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getClientById = (id: string) => {
    const client = allClients.find(c => c.id === id);
    if (!client) return null;

    return {
        ...client,
        prefactures: allPreInvoices.filter(p => p.client === client.name),
        factures: allSalesInvoices.filter(f => f.client === client.name),
        bonsDeLivraison: allDeliveryNotes.filter(b => b.client === client.name),
    }
}


// --- Dashboard Data ---

export async function getDashboardStats() {
    const salesInvoices = getAllSalesInvoices();
    const purchaseInvoices = getAllPurchaseInvoices();
    const clients = getAllClients();

    const totalRevenue = salesInvoices.reduce((acc, inv) => acc + parseAmount(inv.amount), 0);
    const totalExpenses = purchaseInvoices.reduce((acc, inv) => acc + parseAmount(inv.amount), 0);
    
    return {
        totalRevenue,
        salesInvoicesCount: salesInvoices.length,
        totalExpenses,
        purchaseInvoicesCount: purchaseInvoices.length,
        activeClients: clients.length,
    }
}

export async function getChartData() {
    // Group data by month
    const monthlyData: { [key: string]: { revenus: number; depenses: number } } = {};

    const processInvoices = (invoices: any[], type: 'revenus' | 'depenses') => {
        invoices.forEach(invoice => {
            const date = new Date(invoice.date);
            const month = date.toLocaleString('fr-FR', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

            if (!monthlyData[key]) {
                monthlyData[key] = { revenus: 0, depenses: 0 };
            }
            monthlyData[key][type] += parseAmount(invoice.amount);
        });
    };

    const processGasExpenses = (expenses: any[]) => {
        expenses.forEach(expense => {
            const dateParts = expense.date.split('/');
            const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
            const month = date.toLocaleString('fr-FR', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
            
            if (!monthlyData[key]) {
                monthlyData[key] = { revenus: 0, depenses: 0 };
            }
            monthlyData[key].depenses += expense.mt;
        })
    }

    processInvoices(allSalesInvoices, 'revenus');
    processInvoices(allPurchaseInvoices, 'depenses');
    processGasExpenses(initialGasExpenses);

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
        month: month.split(' ')[0],
        ...data
    })).sort((a, b) => {
        const months = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
        return months.indexOf(a.month) - months.indexOf(b.month);
    });
    
    return chartData;
}


export function getRecentExpenses() {
    const lastPurchase = getAllPurchaseInvoices().slice(0, 2).map(i => ({
        id: i.id,
        type: 'Achat Facture' as const,
        description: `Facture de ${i.fournisseur}`,
        amount: parseAmount(i.amount),
        date: new Date(i.date),
    }));

    const lastGas = getGasExpenses().slice(0, 2).map(g => {
        const dateParts = g.date.split('/');
        return {
            id: g.bl,
            type: 'Frais Essence' as const,
            description: g.ds,
            amount: g.mt,
            date: new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]),
        }
    });

    const lastRental = getAllRentalSheets().slice(0, 1).map(r => ({
        id: r.id,
        type: 'Location Matériel' as const,
        description: `Feuille de location ${r.month}`,
        amount: parseAmount(r.amount),
        date: new Date(r.date),
    }));


    const allExpenses = [...lastPurchase, ...lastGas, ...lastRental].sort((a,b) => b.date.getTime() - a.date.getTime());
    
    return allExpenses.slice(0, 5);
}
