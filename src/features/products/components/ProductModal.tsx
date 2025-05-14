import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product } from '../store/productsSlice'
import { useDispatch } from 'react-redux'
import {
    X,
    Loader2,
    ImageIcon,
    Tag,
    Package,
    DollarSign,
    ShoppingCart,
    FileText
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PriceInput } from './PriceInput'

const formSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    price: z.number().min(0.01, 'Preço deve ser maior que zero'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    stock: z.number().int().min(0, 'Estoque deve ser maior ou igual a zero'),
    imageUrl: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
}

export function ProductModal ({ isOpen, onClose, product }: ProductModalProps) {
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: '',
            stock: 0,
            imageUrl: '',
        },
    })

    const imageUrl = form.watch('imageUrl')

    useEffect(() => {
        if (isOpen) {
            if (product) {
                form.reset({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    stock: product.stock,
                    imageUrl: product.imageUrl,
                })
            } else {
                form.reset({
                    name: '',
                    description: '',
                    price: 0,
                    category: '',
                    stock: 0,
                    imageUrl: '',
                })
            }
        }
    }, [isOpen, product, form])

    const handleImageError = () => {
        setImageError(true)
    }

    const onSubmit = async (values: FormValues) => {
        const productData = {
            ...values,
            id: product?.id || Date.now().toString(),
            createdAt: product?.createdAt || new Date().toISOString(),
        }

        if (product) {
            dispatch({ type: 'products/updateProduct', payload: productData })
        } else {
            dispatch({ type: 'CREATE_PRODUCT', payload: productData })
        }

        // Aguarda um pequeno delay para garantir o loading
        await new Promise((resolve) => setTimeout(resolve, 300))
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl md:text-2xl">
                                {product ? 'Editar Produto' : 'Novo Produto'}
                            </DialogTitle>
                            <DialogDescription className="text-sm md:text-base">
                                {product
                                    ? 'Atualize as informações do produto'
                                    : 'Preencha as informações para criar um novo produto'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Coluna da Esquerda - Preview da Imagem */}
                            <div className="space-y-4">
                                <div className="aspect-square rounded-lg border bg-muted/50 overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground" data-testid="image-placeholder">
                                            <ImageIcon className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4" />
                                                URL da Imagem
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://exemplo.com/imagem.jpg"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Coluna da Direita - Formulário */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                Nome
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome do produto" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Package className="h-4 w-4" />
                                                Categoria
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma categoria" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                                                    <SelectItem value="Informática">Informática</SelectItem>
                                                    <SelectItem value="Celulares">Celulares</SelectItem>
                                                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                                                    <SelectItem value="Periféricos">Periféricos</SelectItem>
                                                    <SelectItem value="Áudio">Áudio</SelectItem>
                                                    <SelectItem value="Vídeo">Vídeo</SelectItem>
                                                    <SelectItem value="Gaming">Gaming</SelectItem>
                                                    <SelectItem value="Câmeras">Câmeras</SelectItem>
                                                    <SelectItem value="Smart Home">Smart Home</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Preço
                                                </FormLabel>
                                                <FormControl>
                                                    <PriceInput
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <ShoppingCart className="h-4 w-4" />
                                                    Estoque
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Descrição
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descrição do produto"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

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
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
