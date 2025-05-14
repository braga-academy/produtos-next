import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ProductsPage from '../page'
import productsReducer from '@/features/products/store/productsSlice'

jest.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({
        toast: jest.fn(),
    }),
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}))

describe('ProductsPage', () => {
    beforeEach(() => {
        mockDispatch.mockClear()
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    const createMockStore = (state = {}) => configureStore({
        reducer: {
            products: productsReducer,
        },
        preloadedState: {
            products: {
                items: [],
                filteredItems: [],
                loading: false,
                error: null,
                filters: {
                    search: '',
                    category: '',
                    stockFilter: 'all' as const,
                    minPrice: 0,
                    maxPrice: 0,
                    startDate: '',
                },
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                },
                ...state,
            },
        },
    })

    it('deve corresponder ao snapshot do estado vazio', () => {
        const { container } = render(
            <Provider store={createMockStore()}>
                <ProductsPage />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })

    it('deve exibir o estado de carregamento', () => {
        render(
            <Provider store={createMockStore({ loading: true })}>
                <ProductsPage />
            </Provider>
        )
        const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
        expect(skeletons.length).toBeGreaterThan(0)
    })

    it('deve exibir mensagem de erro', () => {
        const errorMessage = 'Erro ao carregar produtos'
        render(
            <Provider store={createMockStore({ error: errorMessage })}>
                <ProductsPage />
            </Provider>
        )
        expect(screen.getByRole('heading', { name: errorMessage })).toBeInTheDocument()
    })

    it('deve exibir produtos quando houver dados', () => {
        const mockProducts = [
            {
                id: '1',
                name: 'Produto Teste',
                price: 99.99,
                category: 'Categoria Teste',
                stock: 10,
                description: 'Descrição Teste',
                createdAt: '2024-03-20T10:00:00.000Z',
                imageUrl: null,
            },
        ]

        render(
            <Provider store={createMockStore({
                items: mockProducts,
                filteredItems: mockProducts,
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 1,
                }
            })}>
                <ProductsPage />
            </Provider>
        )

        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()

        const rows = screen.getAllByRole('row')
        expect(rows).toHaveLength(2)

        const productRow = rows[1]
        expect(productRow).toHaveTextContent('Produto Teste')
        expect(productRow).toHaveTextContent('R$ 99,99')
        expect(productRow).toHaveTextContent('Categoria Teste')
        expect(productRow).toHaveTextContent('Descrição Teste')
        expect(productRow).toHaveTextContent('10 unidades')
    })

    it('deve abrir o modal ao clicar em Novo Produto', () => {
        render(
            <Provider store={createMockStore()}>
                <ProductsPage />
            </Provider>
        )

        const newProductButtons = screen.getAllByRole('button', { name: 'Novo Produto' })
        fireEvent.click(newProductButtons[0])

        const modal = screen.getByRole('dialog')
        expect(modal).toBeInTheDocument()
        expect(modal).toHaveAttribute('data-state', 'open')
    })

    it('deve filtrar produtos ao digitar na busca', () => {
        mockDispatch.mockImplementation((action) => {
            if (action.type === 'products/setFilters') {
                return { type: 'products/setFilters', payload: { search: 'teste' } }
            }
            return action
        })

        render(
            <Provider store={createMockStore()}>
                <ProductsPage />
            </Provider>
        )

        const searchInput = screen.getByPlaceholderText('Buscar produtos...')
        fireEvent.change(searchInput, { target: { value: 'teste' } })

        jest.advanceTimersByTime(300)

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'products/setFilters',
            payload: { search: 'teste' },
        })
    })

    it('deve exibir a visualização mobile em telas pequenas', () => {
        window.innerWidth = 375
        window.dispatchEvent(new Event('resize'))

        const mockProducts = [
            {
                id: '1',
                name: 'Produto Teste',
                price: 99.99,
                category: 'Categoria Teste',
                stock: 10,
                description: 'Descrição Teste',
                createdAt: '2024-03-20T10:00:00.000Z',
                imageUrl: null,
            },
        ]

        render(
            <Provider store={createMockStore({
                items: mockProducts,
                filteredItems: mockProducts,
            })}>
                <ProductsPage />
            </Provider>
        )

        const mobileView = document.querySelector('.md\\:hidden')
        expect(mobileView).toBeInTheDocument()

        const productNames = screen.getAllByText('Produto Teste')
        expect(productNames.length).toBeGreaterThan(0)

        const prices = screen.getAllByText('R$ 99,99')
        expect(prices.length).toBeGreaterThan(0)
    })
})
