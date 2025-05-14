import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Product {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
    stock: number
    createdAt: string
    updatedAt: string
}

interface Filters {
    search: string
    category: string
    minPrice: number
    maxPrice: number
    stockFilter: 'all' | 'outOfStock'
    startDate: string
    endDate?: string
}

interface ProductsState {
    items: Product[]
    filteredItems: Product[]
    loading: boolean
    error: string | null
    filters: Filters
    pagination: {
        page: number
        pageSize: number
        total: number
    }
}

const initialState: ProductsState = {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    filters: {
        search: '',
        category: '',
        minPrice: 0,
        maxPrice: 0,
        stockFilter: 'all',
        startDate: '',
        endDate: '',
    },
    pagination: {
        page: 1,
        pageSize: 10,
        total: 0
    }
}

const applyFilters = (items: Product[], filters: Filters): Product[] => {
    return items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.description.toLowerCase().includes(filters.search.toLowerCase())
        const matchesCategory = !filters.category || item.category === filters.category
        const matchesPrice = (!filters.minPrice || item.price >= filters.minPrice) &&
            (!filters.maxPrice || item.price <= filters.maxPrice)
        const matchesStock = filters.stockFilter === 'all' ||
            (filters.stockFilter === 'outOfStock' && item.stock === 0)
        let matchesDate = true
        if (filters.startDate && filters.endDate) {
            matchesDate = new Date(item.createdAt) >= new Date(filters.startDate) && new Date(item.createdAt) < new Date(filters.endDate)
        } else if (filters.startDate) {
            matchesDate = new Date(item.createdAt) >= new Date(filters.startDate)
        }

        return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesDate
    })
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload
            state.filteredItems = applyFilters(action.payload, state.filters)
            state.pagination.total = state.filteredItems.length
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
            const updatedFilters = { ...state.filters, ...action.payload }

            if (action.payload.search === '') {
                updatedFilters.search = ''
            }
            if (action.payload.category === '') {
                updatedFilters.category = ''
            }
            if (action.payload.stockFilter === 'all') {
                updatedFilters.stockFilter = 'all'
            }
            if (action.payload.minPrice === 0 && action.payload.maxPrice === 0) {
                updatedFilters.minPrice = 0
                updatedFilters.maxPrice = 0
            }
            if (action.payload.startDate === '') {
                updatedFilters.startDate = ''
            }
            if (action.payload.endDate === '') {
                updatedFilters.endDate = ''
            }

            state.filters = updatedFilters
            state.pagination.page = 1

            state.filteredItems = applyFilters(state.items, state.filters)

            state.pagination.total = state.filteredItems.length
        },
        setPagination: (state, action: PayloadAction<Partial<ProductsState['pagination']>>) => {
            state.pagination = { ...state.pagination, ...action.payload }
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload)
            state.filteredItems.push(action.payload)
            state.pagination.total += 1
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex((p) => p.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
            state.filteredItems = applyFilters(state.items, state.filters)
            state.pagination.total = state.filteredItems.length
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((p) => p.id !== action.payload)
            state.filteredItems = state.filteredItems.filter((p) => p.id !== action.payload)
            state.pagination.total -= 1
        },
    },
})

export const {
    setProducts,
    setLoading,
    setError,
    setFilters,
    setPagination,
    addProduct,
    updateProduct,
    deleteProduct,
} = productsSlice.actions

export default productsSlice.reducer
