import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProductsTable } from '../ProductsTable'
import { Product } from '../../store/productsSlice'

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Produto Teste 1',
        description: 'Descrição do produto 1',
        price: 99.99,
        stock: 10,
        category: 'Categoria 1',
        imageUrl: 'https://exemplo.com/imagem1.jpg',
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z',
    },
    {
        id: '2',
        name: 'Produto Teste 2',
        description: 'Descrição do produto 2',
        price: 149.99,
        stock: 0,
        category: 'Categoria 2',
        imageUrl: '',
        createdAt: '2024-03-20T11:00:00Z',
        updatedAt: '2024-03-20T11:00:00Z',
    },
]

const mockOnEdit = jest.fn()
const mockOnDelete = jest.fn()

describe('ProductsTable', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deve mostrar mensagem quando não houver produtos', () => {
        render(
            <ProductsTable
                data={[]}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument()
        expect(screen.getByText('Não encontramos nenhum produto que corresponda aos seus critérios de busca.')).toBeInTheDocument()
    })

    it('deve chamar onEdit quando o botão de editar for clicado', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const productCards = screen.getAllByText('Produto Teste 1')
            .map(element => element.closest('[data-slot="card"]'))
            .filter(Boolean)
        const editButton = productCards[0]?.querySelector('button svg[class*="lucide-pencil"]')?.closest('button')
        expect(editButton).toBeTruthy()
        fireEvent.click(editButton!)

        expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0])
    })

    it('deve chamar onDelete quando o botão de excluir for clicado', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const productCards = screen.getAllByText('Produto Teste 1')
            .map(element => element.closest('[data-slot="card"]'))
            .filter(Boolean)
        const deleteButton = productCards[0]?.querySelector('button svg[class*="lucide-trash2"]')?.closest('button')
        expect(deleteButton).toBeTruthy()
        fireEvent.click(deleteButton!)

        expect(screen.getByRole('dialog')).toBeInTheDocument()

        const confirmButton = screen.getByRole('button', { name: /excluir/i })
        fireEvent.click(confirmButton)

        expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0].id)
    })

    it('deve alterar o número de itens por página', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const select = screen.getByRole('combobox')
        expect(select).toBeInTheDocument()
        expect(screen.getByText('Itens por página:')).toBeInTheDocument()

        fireEvent.click(select)

        const option = screen.getByText('20')
        fireEvent.click(option)

        expect(screen.getByText('20')).toBeInTheDocument()
    })

    it('deve mostrar imagem do produto quando disponível', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const images = screen.getAllByAltText('Produto Teste 1')
        expect(images).toHaveLength(2)
        images.forEach(image => {
            expect(image).toHaveAttribute('src', 'https://exemplo.com/imagem1.jpg')
        })

        const noImageTexts = screen.getAllByText('Sem imagem')
        expect(noImageTexts).toHaveLength(2)
    })

    it('deve mostrar badge de estoque com estilo diferente quando estoque é zero', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const zeroStockBadges = screen.getAllByText('0 unidades')
        expect(zeroStockBadges).toHaveLength(2)
        zeroStockBadges.forEach(badge => {
            expect(badge.closest('.bg-yellow-100')).toBeInTheDocument()
        })

        const normalStockBadges = screen.getAllByText('10 unidades')
        expect(normalStockBadges).toHaveLength(2)
        normalStockBadges.forEach(badge => {
            expect(badge.closest('.bg-yellow-100')).not.toBeInTheDocument()
        })
    })

    it('deve renderizar os nomes dos produtos corretamente', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const productNames = screen.getAllByText(/Produto Teste \d/)
        expect(productNames).toHaveLength(4)

        const product1Count = productNames.filter(name => name.textContent === 'Produto Teste 1').length
        const product2Count = productNames.filter(name => name.textContent === 'Produto Teste 2').length
        expect(product1Count).toBe(2)
        expect(product2Count).toBe(2)
    })

    it('deve renderizar as categorias corretamente', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const categories = screen.getAllByText(/Categoria \d/)
        expect(categories).toHaveLength(6)
        const category1Count = categories.filter(cat => cat.textContent === 'Categoria 1').length
        const category2Count = categories.filter(cat => cat.textContent === 'Categoria 2').length
        expect(category1Count).toBe(3)
        expect(category2Count).toBe(3)
    })

    it('deve renderizar as descrições corretamente', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        const descriptions = screen.getAllByText(/Descrição do produto \d/)
        expect(descriptions).toHaveLength(4)
        const description1Count = descriptions.filter(desc => desc.textContent === 'Descrição do produto 1').length
        const description2Count = descriptions.filter(desc => desc.textContent === 'Descrição do produto 2').length
        expect(description1Count).toBe(2)
        expect(description2Count).toBe(2)
    })

})
