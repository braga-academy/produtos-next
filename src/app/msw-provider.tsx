'use client'

import { useEffect, useState } from 'react'

export function MSWProvider ({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const initMocks = async () => {
                try {
                    const { worker } = await import('@/core/api/mocks/browser')

                    // Verificar se o service worker já está registrado
                    const registration = await navigator.serviceWorker.getRegistration()
                    if (registration) {
                        await registration.unregister()
                    }

                    // Iniciar o worker com configurações específicas
                    await worker.start({
                        onUnhandledRequest: 'bypass',
                        serviceWorker: {
                            url: '/mockServiceWorker.js',
                            options: {
                                scope: '/',
                                updateViaCache: 'none',
                            },
                        },
                    })

                    console.log('MSW iniciado com sucesso')
                    setIsReady(true)
                } catch (error) {
                    console.error('Erro ao inicializar MSW:', error)
                    // Em caso de erro, tentar continuar sem o MSW
                    setIsReady(true)
                }
            }

            // Verificar se o navegador suporta service workers
            if ('serviceWorker' in navigator) {
                initMocks()
            } else {
                console.warn('Service Workers não são suportados neste navegador')
                setIsReady(true)
            }
        } else {
            setIsReady(true)
        }
    }, [])

    if (!isReady) {
        return null
    }

    return <>{children}</>
}
