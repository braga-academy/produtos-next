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

        // Encontra o botão de editar pelo ícone e pelo produto
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

        // Encontra o botão de excluir pelo ícone e pelo produto
        const productCards = screen.getAllByText('Produto Teste 1')
            .map(element => element.closest('[data-slot="card"]'))
            .filter(Boolean)
        const deleteButton = productCards[0]?.querySelector('button svg[class*="lucide-trash2"]')?.closest('button')
        expect(deleteButton).toBeTruthy()
        fireEvent.click(deleteButton!)

        // Verifica se o modal de confirmação é exibido
        expect(screen.getByRole('dialog')).toBeInTheDocument()

        // Simula a confirmação da exclusão
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

        // Verifica se o seletor de itens por página está presente
        const select = screen.getByRole('combobox')
        expect(select).toBeInTheDocument()
        expect(screen.getByText('Itens por página:')).toBeInTheDocument()

        // Abre o menu de seleção
        fireEvent.click(select)

        // Seleciona uma nova opção
        const option = screen.getByText('20')
        fireEvent.click(option)

        // Verifica se a opção foi selecionada
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

        // Verifica se a imagem do primeiro produto está presente
        const images = screen.getAllByAltText('Produto Teste 1')
        expect(images).toHaveLength(2) // mobile e desktop
        images.forEach(image => {
            expect(image).toHaveAttribute('src', 'https://exemplo.com/imagem1.jpg')
        })

        // Verifica se a mensagem "Sem imagem" está presente para o segundo produto
        const noImageTexts = screen.getAllByText('Sem imagem')
        expect(noImageTexts).toHaveLength(2) // mobile e desktop
    })

    it('deve mostrar badge de estoque com estilo diferente quando estoque é zero', () => {
        render(
            <ProductsTable
                data={mockProducts}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        )

        // Verifica se o badge de estoque zero tem a classe correta
        const zeroStockBadges = screen.getAllByText('0 unidades')
        expect(zeroStockBadges).toHaveLength(2) // mobile e desktop
        zeroStockBadges.forEach(badge => {
            expect(badge.closest('.bg-yellow-100')).toBeInTheDocument()
        })

        // Verifica se o badge de estoque normal não tem a classe de alerta
        const normalStockBadges = screen.getAllByText('10 unidades')
        expect(normalStockBadges).toHaveLength(2) // mobile e desktop
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

        // Verifica se os nomes dos produtos estão visíveis
        const productNames = screen.getAllByText(/Produto Teste \d/)
        expect(productNames).toHaveLength(4) // 2 produtos x 2 views (mobile e desktop)

        // Verifica se cada produto aparece duas vezes (mobile e desktop)
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

        // Verifica se as categorias estão visíveis
        const categories = screen.getAllByText(/Categoria \d/)
        expect(categories).toHaveLength(6) // 2 produtos x 3 views (mobile, desktop e dentro do card)
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

        // Verifica se as descrições estão visíveis
        const descriptions = screen.getAllByText(/Descrição do produto \d/)
        expect(descriptions).toHaveLength(4) // 2 produtos x 2 views (mobile e desktop)
        const description1Count = descriptions.filter(desc => desc.textContent === 'Descrição do produto 1').length
        const description2Count = descriptions.filter(desc => desc.textContent === 'Descrição do produto 2').length
        expect(description1Count).toBe(2)
        expect(description2Count).toBe(2)
    })

})
