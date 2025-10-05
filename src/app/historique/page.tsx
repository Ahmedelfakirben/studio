'use client';

import * as React from 'react';
import { PageHeader } from "@/components/page-header";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Event {
    type: string;
    date: string;
    user: string;
    details: string;
}

export default function HistoryPage() {
    const [events, setEvents] = React.useState<Event[]>([]);

    React.useEffect(() => {
        // In a real app, you would fetch this from your database.
        // We use localStorage here for demonstration purposes.
        const storedEvents = JSON.parse(localStorage.getItem('app_events') || '[]');
        setEvents(storedEvents.sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMM yyyy 'à' HH:mm:ss", { locale: fr });
        } catch (error) {
            return "Date invalide";
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Historique des événements" />
            <Card>
                <CardHeader>
                    <CardTitle>Journal des modifications</CardTitle>
                    <CardDescription>
                        Liste de tous les événements importants enregistrés dans l'application. Cette liste est en lecture seule.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Date</TableHead>
                                    <TableHead className="w-[150px]">Utilisateur</TableHead>
                                    <TableHead className="w-[180px]">Type d'événement</TableHead>
                                    <TableHead>Détails</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.length > 0 ? (
                                    events.map((event, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{formatDate(event.date)}</TableCell>
                                            <TableCell>{event.user}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{event.type}</Badge>
                                            </TableCell>
                                            <TableCell>{event.details}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Aucun événement enregistré pour le moment.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
