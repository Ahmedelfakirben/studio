import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Paramètres" />
            <Tabs defaultValue="profil" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profil">Profil</TabsTrigger>
                    <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
                    <TabsTrigger value="apparence">Apparence</TabsTrigger>
                </TabsList>
                <TabsContent value="profil">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil</CardTitle>
                            <CardDescription>Gérez les informations de votre profil public.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="https://picsum.photos/seed/10/200/200" data-ai-hint="person" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">Changer la photo</Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input id="name" defaultValue="Admin Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="admin@aly-tp.fr" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Enregistrer les modifications</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="entreprise">
                    <Card>
                        <CardHeader>
                            <CardTitle>Entreprise</CardTitle>
                            <CardDescription>Mettez à jour les informations de votre entreprise.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                                <Input id="company-name" defaultValue="A.L.Y Travaux Publique" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vat">Numéro de TVA</Label>
                                <Input id="vat" defaultValue="FR 12 345678901" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input id="address" defaultValue="123 Rue du Chantier, 75000 Paris" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Enregistrer les modifications</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="apparence">
                    <Card>
                        <CardHeader>
                            <CardTitle>Apparence</CardTitle>
                            <CardDescription>Personnalisez l'apparence de l'application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="dark-mode" className="text-base">Thème Sombre</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Activer pour une interface moins lumineuse.
                                    </p>
                                </div>
                                <Switch id="dark-mode" />
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="compact-mode" className="text-base">Mode Compact</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Réduire les espacements pour afficher plus d'informations.
                                    </p>
                                </div>
                                <Switch id="compact-mode" disabled />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}