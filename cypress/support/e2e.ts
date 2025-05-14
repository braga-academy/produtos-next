import { setupWorker } from 'msw/browser'
import { handlers } from '../../src/mocks/handlers'

const worker = setupWorker(...handlers)

before(() => {
    worker.start()
})

after(() => {
    worker.stop()
})

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('Failed to update a ServiceWorker')) {
        return false
    }
})
