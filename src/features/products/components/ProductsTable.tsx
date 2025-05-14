import { useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Pencil, Trash2, Search, Filter, X, Package } from 'lucide-react'
import { Product } from '../store/productsSlice'
import { ConfirmModal } from './ConfirmModal'
import { DeleteProductDialog } from './DeleteProductDialog'
import { columns } from './columns'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface ProductsTableProps {
    data: Product[]
    onEdit: (product: Product) => void
    onDelete: (id: string) => void
}

export function ProductsTable ({ data, onEdit, onDelete }: ProductsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'createdAt',
            desc: true,
        },
    ])
    const [pageSize, setPageSize] = useState(10)
    const [pageIndex, setPageIndex] = useState(0)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            pagination: {
                pageSize,
                pageIndex,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({
                    pageIndex,
                    pageSize,
                })
                setPageIndex(newState.pageIndex)
                setPageSize(newState.pageSize)
            }
        },
    })

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product)
    }

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            onDelete(productToDelete.id)
            setProductToDelete(null)
        }
    }

    if (data.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <div className="rounded-full bg-muted p-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
                            <p className="text-sm text-muted-foreground">
                                Não encontramos nenhum produto que corresponda aos seus critérios de busca.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {table.getRowModel().rows.map((row) => {
                    const product = row.original
                    return (
                        <Card key={product.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-md border bg-muted/50 overflow-hidden">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                                    <span className="text-xs">Sem imagem</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-sm text-muted-foreground">{product.category}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(product)}
                                            className="h-10 w-10 rounded-full hover:bg-muted"
                                            data-testid="edit-product-button"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteProductId(product.id)}
                                            className="h-10 w-10 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                            data-testid="delete-product-button"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Preço</div>
                                        <div className="font-medium">{formatCurrency(product.price)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Estoque</div>
                                        <Badge
                                            variant="outline"
                                            className={`flex items-center gap-1 font-normal ${product.stock === 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}`}
                                        >
                                            <Package className="h-3 w-3" />
                                            {product.stock} unidades
                                        </Badge>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-sm text-muted-foreground">Data de Criação</div>
                                        <div className="font-medium">
                                            {new Intl.DateTimeFormat('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }).format(new Date(product.createdAt))}
                                        </div>
                                    </div>
                                    {product.description && (
                                        <div className="col-span-2">
                                            <div className="text-sm text-muted-foreground">Descrição</div>
                                            <div className="text-sm line-clamp-2">{product.description}</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <div className="relative">
                    <Table data-testid="products-table">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="whitespace-nowrap h-12"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        data-testid="product-row"
                                        className="group hover:bg-muted/50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-4">
                                                {cell.column.id === 'stock' ? (
                                                    <Badge
                                                        variant="outline"
                                                        className={`flex items-center gap-1 font-normal ${cell.getValue() === 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}`}
                                                    >
                                                        <Package className="h-3 w-3" />
                                                        {cell.getValue() as number} unidades
                                                    </Badge>
                                                ) : (
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="w-[100px] py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(row.original)}
                                                    className="h-8 w-8 cursor-pointer hover:bg-muted"
                                                    data-testid="edit-product-button"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteProductId(row.original.id)}
                                                    className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    data-testid="delete-product-button"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        className="h-32 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <p className="text-sm font-medium">Nenhum produto encontrado</p>
                                            <p className="text-xs">Tente ajustar os filtros ou criar um novo produto</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-4 border-t">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        Página {pageIndex + 1} de {table.getPageCount()} • Total de {table.getFilteredRowModel().rows.length} produtos
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Itens por página:</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                const newPageSize = Number(value)
                                setPageSize(newPageSize)
                                const newPageIndex = Math.floor((pageIndex * pageSize) / newPageSize)
                                setPageIndex(newPageIndex)
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px] cursor-pointer">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="cursor-pointer flex-1 sm:flex-none"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Anterior</span>
                    </Button>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Página</span>
                        <span className="font-medium">{pageIndex + 1}</span>
                        <span className="hidden sm:inline">de</span>
                        <span className="font-medium">{table.getPageCount()}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="cursor-pointer flex-1 sm:flex-none"
                    >
                        <span className="hidden sm:inline">Próxima</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            <DeleteProductDialog
                isOpen={!!deleteProductId}
                onClose={() => setDeleteProductId(null)}
                onConfirm={() => {
                    if (deleteProductId) {
                        onDelete(deleteProductId)
                        setDeleteProductId(null)
                    }
                }}
            />
        </div>
    )
}
