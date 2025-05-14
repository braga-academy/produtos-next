import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setFilters } from '../store/productsSlice'
import { debounce } from 'lodash'

export function useProductFilters () {
    const dispatch = useDispatch()

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            dispatch(setFilters({ search: value }))
        }, 150),
        [dispatch]
    )

    const handleSearch = useCallback((value: string) => {
        debouncedSearch(value)
    }, [debouncedSearch])

    const handleCategoryChange = useCallback((value: string) => {
        dispatch(setFilters({ category: value }))
    }, [dispatch])

    const handleStockFilter = useCallback((value: 'all' | 'outOfStock') => {
        dispatch(setFilters({ stockFilter: value }))
    }, [dispatch])

    const handleDateFilter = useCallback((value: string) => {
        const now = new Date()
        let startDate = new Date()

        switch (value) {
            case 'last7days':
                startDate.setDate(now.getDate() - 7)
                break
            case 'last30days':
                startDate.setDate(now.getDate() - 30)
                break
            case 'last90days':
                startDate.setDate(now.getDate() - 90)
                break
            default:
                startDate = new Date(0)
        }

        dispatch(setFilters({ startDate: startDate.toISOString() }))
    }, [dispatch])

    const handlePriceFilter = useCallback((value: string) => {
        let minPrice = 0
        let maxPrice = 0

        switch (value) {
            case 'under100':
                maxPrice = 100
                break
            case '100to500':
                minPrice = 100
                maxPrice = 500
                break
            case '500to1000':
                minPrice = 500
                maxPrice = 1000
                break
            case 'over1000':
                minPrice = 1000
                break
            default:
                minPrice = 0
                maxPrice = 0
        }

        dispatch(setFilters({ minPrice, maxPrice }))
    }, [dispatch])

    const clearFilters = useCallback(() => {
        dispatch(setFilters({
            search: '',
            category: '',
            stockFilter: 'all',
            minPrice: 0,
            maxPrice: 0,
            startDate: '',
        }))
    }, [dispatch])

    return {
        handleSearch,
        handleCategoryChange,
        handleStockFilter,
        handleDateFilter,
        handlePriceFilter,
        clearFilters,
    }
}
