import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, Filter, Calendar, Tag, ShoppingCart, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useProductFilters } from '../hooks/useProductFilters'
import { useSelector } from 'react-redux'
import { RootState } from '@/core/store'

interface FilterBarProps {
    onClearFilters: () => void
    hasActiveFilters: boolean
    initialSearchValue?: string
}

export function FilterBar({ onClearFilters, hasActiveFilters, initialSearchValue = '' }: FilterBarProps) {
    const [searchValue, setSearchValue] = useState(initialSearchValue)
    const [showFilters, setShowFilters] = useState(false)
    const {
        handleSearch,
        handleCategoryChange,
        handleStockFilter,
        handleDateFilter,
        handlePriceFilter,
    } = useProductFilters()
    const filters = useSelector((state: RootState) => state.products.filters)

    const onSearch = (value: string) => {
        setSearchValue(value)
        handleSearch(value)
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar produtos..."
                        value={searchValue}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-8"
                        data-testid="search-input"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                    data-testid="toggle-filters"
                >
                    <Filter className="h-4 w-4" />
                    Filtros
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2">
                            Ativos
                        </Badge>
                    )}
                </Button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Categoria
                        </label>
                        <Select onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas as categorias" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as categorias</SelectItem>
                                <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                                <SelectItem value="Informática">Informática</SelectItem>
                                <SelectItem value="Celulares">Celulares</SelectItem>
                                <SelectItem value="Acessórios">Acessórios</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Estoque
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="checkbox"
                                id="outOfStock"
                                checked={filters.stockFilter === 'outOfStock'}
                                onChange={e => handleStockFilter(e.target.checked ? 'outOfStock' : 'all')}
                                className="accent-yellow-500 h-4 w-4"
                            />
                            <label htmlFor="outOfStock" className="text-sm select-none cursor-pointer">
                                Apenas sem estoque
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Preço
                        </label>
                        <Select onValueChange={handlePriceFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos os preços" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os preços</SelectItem>
                                <SelectItem value="under100">Até R$ 100</SelectItem>
                                <SelectItem value="100to500">R$ 100 - R$ 500</SelectItem>
                                <SelectItem value="500to1000">R$ 500 - R$ 1000</SelectItem>
                                <SelectItem value="over1000">Acima de R$ 1000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Data
                        </label>
                        <Select onValueChange={handleDateFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas as datas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as datas</SelectItem>
                                <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                                <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                                <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <div className="col-span-full flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={onClearFilters}
                                className="gap-2"
                                data-testid="clear-filters"
                            >
                                <X className="h-4 w-4" />
                                Limpar filtros
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
