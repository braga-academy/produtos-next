import { http, HttpResponse } from 'msw'
import { Product } from '@/features/products/store/productsSlice'

// Função auxiliar para gerar um ID único
const generateId = () => Math.random().toString(36).substr(2, 9)

// Função auxiliar para gerar uma data aleatória nos últimos 30 dias
const generateRandomDate = () => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    return date.toISOString()
}

// Função auxiliar para gerar um preço aleatório entre 10 e 1000
const generateRandomPrice = () => Number((Math.random() * 990 + 10).toFixed(2))

// Função auxiliar para gerar um estoque aleatório entre 0 e 100
const generateRandomStock = () => Math.floor(Math.random() * 100)

// Categorias predefinidas
const categories = [
    'Eletrônicos',
    'Informática',
    'Celulares',
    'Acessórios',
    'Periféricos',
    'Áudio',
    'Vídeo',
    'Gaming',
    'Câmeras',
    'Smart Home',
]

// Gerar uma massa de dados de produtos
const generateProducts = (count: number): Product[] => {
    return Array.from({ length: count }, (_, index) => ({
        id: generateId(),
        name: `Produto ${index + 1}`,
        description: `Descrição detalhada do produto ${index + 1}. Este é um produto de alta qualidade com várias características e benefícios.`,
        price: generateRandomPrice(),
        imageUrl: `https://picsum.photos/seed/${index}/200/200`,
        category: categories[Math.floor(Math.random() * categories.length)],
        stock: generateRandomStock(),
        createdAt: generateRandomDate(),
        updatedAt: generateRandomDate(),
    }))
}

// Simulando um banco de dados em memória com 100 produtos
let products: Product[] = generateProducts(100)

export const handlers = [
    // Listar produtos
    http.get('/api/products', () => {
        return HttpResponse.json(products)
    }),

    // Criar produto
    http.post('/api/products', async ({ request }) => {
        const newProduct = await request.json() as Partial<Product>
        const product: Product = {
            id: generateId(),
            name: newProduct.name || '',
            description: newProduct.description || '',
            price: newProduct.price || 0,
            imageUrl: newProduct.imageUrl || '',
            category: newProduct.category || '',
            stock: newProduct.stock || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        products.push(product)
        return HttpResponse.json(product)
    }),

    // Atualizar produto
    http.put('/api/products/:id', async ({ params, request }) => {
        const { id } = params
        const updatedData = await request.json() as Partial<Product>
        const productIndex = products.findIndex((p) => p.id === id)

        if (productIndex === -1) {
            return new HttpResponse(null, { status: 404 })
        }

        const currentProduct = products[productIndex]
        const updatedProduct: Product = {
            ...currentProduct,
            name: updatedData.name ?? currentProduct.name,
            description: updatedData.description ?? currentProduct.description,
            price: updatedData.price ?? currentProduct.price,
            imageUrl: updatedData.imageUrl ?? currentProduct.imageUrl,
            category: updatedData.category ?? currentProduct.category,
            stock: updatedData.stock ?? currentProduct.stock,
            updatedAt: new Date().toISOString(),
        }

        products[productIndex] = updatedProduct
        return HttpResponse.json(updatedProduct)
    }),

    // Excluir produto
    http.delete('/api/products/:id', ({ params }) => {
        const { id } = params
        const productIndex = products.findIndex((p) => p.id === id)

        if (productIndex === -1) {
            return new HttpResponse(null, { status: 404 })
        }

        products = products.filter((p) => p.id !== id)
        return new HttpResponse(null, { status: 204 })
    }),
]
