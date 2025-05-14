'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/core/store'
import { setProducts, setFilters } from '@/features/products/store/productsSlice'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { ProductModal } from '@/features/products/components/ProductModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Product } from '@/features/products/store/productsSlice'
import { FilterBar } from '@/features/products/components/FilterBar'
import { EmptyState } from '@/features/products/components/EmptyState'
import { ErrorState } from '@/features/products/components/ErrorState'
import { LoadingState } from '@/features/products/components/LoadingState'
import { useToast } from '@/components/ui/use-toast'

export default function ProductsPage() {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { filteredItems: products, loading, error, filters } = useSelector(
        (state: RootState) => state.products
    )
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        dispatch({ type: 'FETCH_PRODUCTS' })
    }, [dispatch])

    const handleCreateProduct = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const handleDeleteProduct = (id: string) => {
        dispatch({ type: 'DELETE_PRODUCT', payload: id })
        toast({
            title: 'Produto excluído',
            description: 'O produto foi excluído com sucesso.',
        })
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
    }

    const handleClearFilters = () => {
        dispatch(setFilters({
            search: '',
            category: '',
            stockFilter: 'all',
            minPrice: 0,
            maxPrice: 0,
            startDate: '',
        }))
    }

    const hasActiveFilters = !!(
        filters.search ||
        filters.category ||
        filters.stockFilter !== 'all' ||
        filters.minPrice > 0 ||
        filters.maxPrice > 0 ||
        filters.startDate
    )

    if (loading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState error={error} onRetry={() => dispatch({ type: 'FETCH_PRODUCTS' })} />
    }

        return (
            <div className="container mx-auto py-10 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                        <p className="text-sm text-muted-foreground">
                            Gerencie seus produtos e estoque
                        </p>
                    </div>
                    <Button onClick={handleCreateProduct} className="cursor-pointer" data-testid="create-product-button">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Produto
                    </Button>
                </div>

            <FilterBar
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {products.length === 0 && !hasActiveFilters ? (
                <EmptyState onCreateProduct={handleCreateProduct} />
            ) : (
                        <ProductsTable
                            data={products}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={selectedProduct}
            />
        </div>
    )
}
