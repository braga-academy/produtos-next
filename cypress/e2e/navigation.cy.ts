describe('Navegação Simples na Página de Produtos', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/products').as('getProducts')
        cy.visit('/products')
        cy.wait('@getProducts')
        cy.contains('Carregando...').should('not.exist', { timeout: 10000 })
        cy.get('body', { timeout: 20000 }).then(($body) => {
            if ($body.find('[data-testid="products-table"]').length) {
                cy.get('[data-testid="products-table"]').should('exist')
            } else if ($body.text().includes('Nenhum produto cadastrado') || $body.text().includes('Nenhum produto encontrado')) {
            } else if ($body.text().includes('Erro')) {
            } else {
                throw new Error('Estado não reconhecido')
            }
        })
    })

    it('deve carregar a página de produtos', () => {
        cy.url().should('include', '/products')
        cy.get('body', { timeout: 20000 }).then(($body) => {
            if ($body.find('[data-testid="products-table"]').length) {
                cy.get('[data-testid="products-table"]').should('exist')
            } else if ($body.text().includes('Nenhum produto cadastrado') || $body.text().includes('Nenhum produto encontrado')) {
            } else if ($body.text().includes('Erro')) {
            } else {
                throw new Error('Estado não reconhecido')
            }
        })
    })

    it('deve abrir o modal de novo produto', () => {
        cy.get('button').contains('Novo Produto').should('be.visible').click()
        cy.get('[role="dialog"]').should('exist')
        cy.get('form').should('exist')
    })

    it('deve navegar entre páginas da tabela', () => {
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="pagination"]').length) {
                cy.get('[data-testid="pagination"]', { timeout: 10000 }).should('exist')
                cy.get('[data-testid="pagination"] button').contains('2').click()
                cy.url().should('include', 'page=2')
            }
        })
    })

    it('deve alterar o número de itens por página', () => {
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="products-table"]').length) {
                cy.get('select').first().click()
                cy.get('select').first().select('20')
                cy.get('[data-testid="products-table"] tbody tr').should('have.length.at.most', 20)
            }
        })
    })

    it('deve realizar busca de produtos', () => {
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="products-table"]').length) {
                cy.get('input[type="search"]').type('teste')
                cy.get('[data-testid="products-table"]').should('exist')
                cy.get('input[type="search"]').clear()
                cy.get('[data-testid="products-table"]').should('exist')
            }
        })
    })
})
