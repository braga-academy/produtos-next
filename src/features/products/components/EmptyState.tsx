import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ShoppingCart } from 'lucide-react'

interface EmptyStateProps {
    onCreateProduct: () => void
}

export function EmptyState({ onCreateProduct }: EmptyStateProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="rounded-full bg-muted p-4">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Nenhum produto cadastrado</h3>
                        <p className="text-sm text-muted-foreground">
                            Comece adicionando seu primeiro produto
                        </p>
                    </div>
                    <Button onClick={onCreateProduct} className="gap-2" data-testid="empty-create-button">
                        <Plus className="h-4 w-4" />
                        Novo Produto
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
