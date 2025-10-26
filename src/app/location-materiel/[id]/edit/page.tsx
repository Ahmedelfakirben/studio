
'use client';

import * as React from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as ShadcnTableFooter } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { locationMaterielService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

interface RegistroMaterial {
    id: string;
    fecha: string;
    numeroBL: string;
    tipoMaterial: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
}

interface LocationMateriel {
    id: string;
    titulo: string;
    periodo: string;
    totalGeneral: number;
    registros: RegistroMaterial[];
}

export default function EditMaterialRentalPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    // Form data
    const [titulo, setTitulo] = React.useState('');
    const [periodo, setPeriodo] = React.useState('');

    // Records
    const [niveleuseRecords, setNiveleuseRecords] = React.useState<RegistroMaterial[]>([]);
    const [citerneRecords, setCiterneRecords] = React.useState<RegistroMaterial[]>([]);

    // Fetch existing data
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await locationMaterielService.getById(params.id);
                const data: LocationMateriel = response.data;

                setTitulo(data.titulo);
                setPeriodo(data.periodo);

                // Separate records by type
                const niveleuse = data.registros?.filter(r => r.tipoMaterial === 'NIVELEUSE') || [];
                const citerne = data.registros?.filter(r => r.tipoMaterial === 'CITERNE') || [];

                setNiveleuseRecords(niveleuse.length > 0 ? niveleuse : [
                    {
                        id: crypto.randomUUID(),
                        fecha: '',
                        numeroBL: '',
                        tipoMaterial: 'NIVELEUSE',
                        unidad: 'JRS',
                        cantidad: 0,
                        precioUnitario: 500
                    }
                ]);

                setCiterneRecords(citerne.length > 0 ? citerne : [
                    {
                        id: crypto.randomUUID(),
                        fecha: '',
                        numeroBL: '',
                        tipoMaterial: 'CITERNE',
                        unidad: 'V',
                        cantidad: 0,
                        precioUnitario: 80
                    }
                ]);

            } catch (error: any) {
                console.error('Error fetching location:', error);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les données. " + (error.response?.data?.message || error.message),
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, toast]);

    // Add new row functions
    const addNiveleuseRow = () => {
        setNiveleuseRecords([...niveleuseRecords, {
            id: crypto.randomUUID(),
            fecha: '',
            numeroBL: '',
            tipoMaterial: 'NIVELEUSE',
            unidad: 'JRS',
            cantidad: 0,
            precioUnitario: 500
        }]);
    };

    const addCiterneRow = () => {
        setCiterneRecords([...citerneRecords, {
            id: crypto.randomUUID(),
            fecha: '',
            numeroBL: '',
            tipoMaterial: 'CITERNE',
            unidad: 'V',
            cantidad: 0,
            precioUnitario: 80
        }]);
    };

    // Remove row functions
    const removeNiveleuseRow = (id: string) => {
        if (niveleuseRecords.length > 1) {
            setNiveleuseRecords(niveleuseRecords.filter(r => r.id !== id));
        }
    };

    const removeCiterneRow = (id: string) => {
        if (citerneRecords.length > 1) {
            setCiterneRecords(citerneRecords.filter(r => r.id !== id));
        }
    };

    // Update functions
    const updateNiveleuseRecord = (id: string, field: keyof RegistroMaterial, value: any) => {
        setNiveleuseRecords(niveleuseRecords.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        ));
    };

    const updateCiterneRecord = (id: string, field: keyof RegistroMaterial, value: any) => {
        setCiterneRecords(citerneRecords.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        ));
    };

    // Calculate totals
    const totalNiveleuse = niveleuseRecords.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    const totalCiterne = citerneRecords.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    const grandTotal = totalNiveleuse + totalCiterne;

    // Update function
    const handleUpdate = async () => {
        // Validation
        if (!titulo.trim() || !periodo.trim()) {
            toast({
                variant: "destructive",
                title: "Erreur de validation",
                description: "Veuillez remplir le titre et la période.",
            });
            return;
        }

        // Combine all records
        const allRecords = [...niveleuseRecords, ...citerneRecords].map(record => ({
            fecha: record.fecha || new Date().toISOString(),
            numeroBL: record.numeroBL,
            tipoMaterial: record.tipoMaterial,
            unidad: record.unidad,
            cantidad: Number(record.cantidad),
            precioUnitario: Number(record.precioUnitario),
            precioTotal: Number(record.cantidad) * Number(record.precioUnitario),
        }));

        const data = {
            titulo,
            periodo,
            registros: allRecords,
            totalGeneral: grandTotal,
        };

        try {
            setSaving(true);
            await locationMaterielService.update(params.id, data);

            toast({
                title: "Feuille mise à jour",
                description: "La feuille de location a été mise à jour avec succès.",
            });

            router.push(`/location-materiel/${params.id}`);
        } catch (error: any) {
            console.error('Error updating:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour la feuille. " + (error.response?.data?.message || error.message),
            });
        } finally {
            setSaving(false);
        }
    };

    const formatDateForInput = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toISOString().split('T')[0];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Modifier la Feuille de Location">
                 <Button variant="outline" asChild>
                    <Link href={`/location-materiel/${params.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Link>
                </Button>
            </PageHeader>

            <Card>
                <CardHeader>
                    <CardTitle>Modifier Feuille de Location Matériel</CardTitle>
                    <CardDescription>Modifiez les informations ci-dessous.</CardDescription>

                    {/* Header form */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label htmlFor="periodo">Période *</Label>
                            <Input
                                id="periodo"
                                placeholder="ex: Juillet 2024"
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="titulo">Titre *</Label>
                            <Input
                                id="titulo"
                                placeholder="ex: Location Matériel - Juillet 2024"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Tabla Niveleuse */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold text-primary">NIVELEUSE</h3>
                            <Button size="sm" variant="outline" onClick={addNiveleuseRow}>
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter ligne
                            </Button>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[180px]">DATE</TableHead>
                                        <TableHead className="w-[180px]">N° BL</TableHead>
                                        <TableHead className="w-[100px] text-center">JRS</TableHead>
                                        <TableHead className="w-[120px] text-right">PU</TableHead>
                                        <TableHead className="w-[120px] text-right">PT</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {niveleuseRecords.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Input
                                                    type="date"
                                                    className="h-8"
                                                    value={formatDateForInput(item.fecha)}
                                                    onChange={(e) => updateNiveleuseRecord(item.id, 'fecha', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder="BL-N-XX"
                                                    className="h-8"
                                                    value={item.numeroBL}
                                                    onChange={(e) => updateNiveleuseRecord(item.id, 'numeroBL', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    className="h-8 text-center"
                                                    value={item.cantidad}
                                                    onChange={(e) => updateNiveleuseRecord(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    className="h-8 text-right"
                                                    value={item.precioUnitario}
                                                    onChange={(e) => updateNiveleuseRecord(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(item.cantidad * item.precioUnitario)}
                                            </TableCell>
                                            <TableCell>
                                                {niveleuseRecords.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => removeNiveleuseRow(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <ShadcnTableFooter>
                                     <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold text-base">TOTAL NIVELEUSE</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(totalNiveleuse)}</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </ShadcnTableFooter>
                            </Table>
                        </div>
                    </div>

                    {/* Tabla Citerne */}
                    <div>
                         <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold text-primary">CITERNE</h3>
                            <Button size="sm" variant="outline" onClick={addCiterneRow}>
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter ligne
                            </Button>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[180px]">DATE</TableHead>
                                        <TableHead className="w-[180px]">N° BL</TableHead>
                                        <TableHead className="w-[100px] text-center">V</TableHead>
                                        <TableHead className="w-[120px] text-right">PU</TableHead>
                                        <TableHead className="w-[120px] text-right">PT</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {citerneRecords.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Input
                                                    type="date"
                                                    className="h-8"
                                                    value={formatDateForInput(item.fecha)}
                                                    onChange={(e) => updateCiterneRecord(item.id, 'fecha', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder="BL-C-XX"
                                                    className="h-8"
                                                    value={item.numeroBL}
                                                    onChange={(e) => updateCiterneRecord(item.id, 'numeroBL', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    className="h-8 text-center"
                                                    value={item.cantidad}
                                                    onChange={(e) => updateCiterneRecord(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    className="h-8 text-right"
                                                    value={item.precioUnitario}
                                                    onChange={(e) => updateCiterneRecord(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(item.cantidad * item.precioUnitario)}
                                            </TableCell>
                                            <TableCell>
                                                {citerneRecords.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => removeCiterneRow(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <ShadcnTableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold text-base">TOTAL CITERNE</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(totalCiterne)}</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </ShadcnTableFooter>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-6 mt-6 border-t flex flex-col items-end gap-4">
                     <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between font-bold text-lg">
                            <span>TOTAL GÉNÉRAL HT:</span>
                            <span className="text-primary">{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/location-materiel/${params.id}`}>Annuler</Link>
                        </Button>
                        <Button onClick={handleUpdate} disabled={saving}>
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
