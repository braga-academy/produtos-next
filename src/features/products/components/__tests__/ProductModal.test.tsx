import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ProductModal } from '../ProductModal'
import productsReducer from '../../store/productsSlice'
import { expect } from '@jest/globals'

const createMockStore = () => {
    return configureStore({
        reducer: {
            products: productsReducer,
        },
    })
}

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}))

describe('ProductModal', () => {
    const mockOnClose = jest.fn()
    const mockProduct = {
        id: '1',
        name: 'Produto Teste',
        description: 'Descrição do produto teste',
        price: 99.99,
        category: 'Eletrônicos',
        stock: 10,
        imageUrl: 'https://exemplo.com/imagem.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deve renderizar o modal corretamente quando aberto', () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={null} />
            </Provider>
        )

        expect(screen.getByRole('heading', { name: 'Novo Produto' })).toBeInTheDocument()
        expect(screen.getByText('Preencha as informações para criar um novo produto')).toBeInTheDocument()
    })

    it('deve renderizar o modal em modo de edição quando um produto é fornecido', () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
            </Provider>
        )

        expect(screen.getByRole('heading', { name: 'Editar Produto' })).toBeInTheDocument()
        expect(screen.getByText('Atualize as informações do produto')).toBeInTheDocument()
    })

    it('deve preencher os campos com os dados do produto em modo de edição', () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
            </Provider>
        )

        expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue(mockProduct.name)
        expect(screen.getByRole('textbox', { name: /descrição/i })).toHaveValue(mockProduct.description)
        expect(screen.getByRole('textbox', { name: /url da imagem/i })).toHaveValue(mockProduct.imageUrl)
    })

    it('deve chamar onClose quando o botão cancelar é clicado', () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={null} />
            </Provider>
        )

        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
        expect(mockOnClose).toHaveBeenCalled()
    })

    it('deve validar campos obrigatórios ao tentar salvar', async () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={null} />
            </Provider>
        )

        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

        await waitFor(() => {
            const errorMessages = screen.getAllByRole('alert')
            expect(errorMessages).toHaveLength(4)
            expect(errorMessages[0]).toHaveTextContent('Nome é obrigatório')
            expect(errorMessages[1]).toHaveTextContent('Categoria é obrigatória')
            expect(errorMessages[2]).toHaveTextContent('Preço deve ser maior que zero')
            expect(errorMessages[3]).toHaveTextContent('Descrição é obrigatória')
        })
    })

    it('deve criar um novo produto quando o formulário é submetido corretamente', async () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={null} />
            </Provider>
        )

        fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
            target: { value: 'Novo Produto' },
        })
        fireEvent.change(screen.getByRole('textbox', { name: /descrição/i }), {
            target: { value: 'Descrição do novo produto' },
        })
        fireEvent.change(screen.getByRole('textbox', { name: /url da imagem/i }), {
            target: { value: 'https://exemplo.com/nova-imagem.jpg' },
        })

        const selectTrigger = screen.getByRole('combobox', { name: /categoria/i })
        fireEvent.click(selectTrigger)

        const categoryOption = screen.getByRole('option', { name: 'Eletrônicos' })
        fireEvent.click(categoryOption)

        const priceInput = screen.getByRole('textbox', { name: /preço/i })
        fireEvent.change(priceInput, { target: { value: '99.99' } })

        const stockInput = screen.getByRole('spinbutton', { name: /estoque/i })
        fireEvent.change(stockInput, { target: { value: '10' } })

        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'CREATE_PRODUCT',
                payload: {
                    name: 'Novo Produto',
                    description: 'Descrição do novo produto',
                    price: 9999,
                    category: 'Eletrônicos',
                    stock: 10,
                    imageUrl: 'https://exemplo.com/nova-imagem.jpg',
                    id: expect.any(String),
                    createdAt: expect.any(String)
                }
            })
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it('deve atualizar um produto existente quando o formulário é submetido corretamente', async () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={mockProduct} />
            </Provider>
        )

        fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
            target: { value: 'Produto Atualizado' },
        })

        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'products/updateProduct',
                payload: expect.objectContaining({
                    id: mockProduct.id,
                    name: 'Produto Atualizado',
                }),
            })
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it('deve mostrar o preview da imagem quando uma URL válida é fornecida', async () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={null} />
            </Provider>
        )

        const imageUrlInput = screen.getByRole('textbox', { name: /url da imagem/i })
        fireEvent.change(imageUrlInput, {
            target: { value: 'https://exemplo.com/imagem.jpg' },
        })

        const image = screen.getByRole('img', { name: 'Preview' })
        expect(image).toHaveAttribute('src', 'https://exemplo.com/imagem.jpg')
    })

    it('deve mostrar o ícone de placeholder quando não há URL de imagem', () => {
        render(
            <Provider store={createMockStore()}>
                <ProductModal isOpen={true} onClose={mockOnClose} product={null} />
            </Provider>
        )

        expect(screen.getByTestId('image-placeholder')).toBeInTheDocument()
    })
})
