import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Configuração do service worker
if (typeof window !== 'undefined') {
    worker.start({
        serviceWorker: {
            url: '/mockServiceWorker.js',
            options: {
                scope: '/',
            },
        },
        onUnhandledRequest: 'bypass',
    })
}
