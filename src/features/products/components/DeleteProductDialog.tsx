import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface DeleteProductDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export function DeleteProductDialog ({ isOpen, onClose, onConfirm }: DeleteProductDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] w-[95vw]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-destructive/10 p-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <DialogTitle className="text-xl md:text-2xl">Excluir Produto</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm md:text-base">
                        Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        className="w-full sm:w-auto"
                    >
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
