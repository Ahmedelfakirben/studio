import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function FournisseursPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Fournisseurs">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un fournisseur
                </Button>
            </PageHeader>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-[60vh]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Bientôt disponible
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        La gestion des fournisseurs sera bientôt disponible ici.
                    </p>
                </div>
            </div>
        </div>
    )
}
