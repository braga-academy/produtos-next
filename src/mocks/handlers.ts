import { http, HttpResponse } from 'msw'

const produtos = [
    {
        id: 1,
        nome: 'Produto 1',
        preco: 99.99,
        descricao: 'Descrição do produto 1',
        imagem: 'https://via.placeholder.com/150',
        categoria: 'Categoria 1'
    },
    {
        id: 2,
        nome: 'Produto 2',
        preco: 149.99,
        descricao: 'Descrição do produto 2',
        imagem: 'https://via.placeholder.com/150',
        categoria: 'Categoria 2'
    }
]

export const handlers = [
    http.get('/api/produtos', () => {
        return HttpResponse.json(produtos)
    }),

    http.post('/api/produtos', async ({ request }) => {
        const novoProduto = await request.json()
        produtos.push({ ...novoProduto, id: produtos.length + 1 })
        return HttpResponse.json(novoProduto)
    }),

    http.put('/api/produtos/:id', async ({ params, request }) => {
        const { id } = params
        const produtoAtualizado = await request.json()
        const index = produtos.findIndex(p => p.id === Number(id))
        if (index !== -1) {
            produtos[index] = { ...produtos[index], ...produtoAtualizado }
            return HttpResponse.json(produtos[index])
        }
        return new HttpResponse(null, { status: 404 })
    }),

    http.delete('/api/produtos/:id', ({ params }) => {
        const { id } = params
        const index = produtos.findIndex(p => p.id === Number(id))
        if (index !== -1) {
            produtos.splice(index, 1)
            return new HttpResponse(null, { status: 204 })
        }
        return new HttpResponse(null, { status: 404 })
    })
]
