import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
    error: string
    onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <Card className="border-destructive">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-destructive/10 p-3">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-destructive">Erro ao carregar produtos</h3>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={onRetry}
                        className="cursor-pointer"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
