'use client'

import { useEffect, useState } from 'react'

export function MSWProvider ({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const initMocks = async () => {
                try {
                    const { worker } = await import('@/core/api/mocks/browser')

                    const registration = await navigator.serviceWorker.getRegistration()
                    if (registration) {
                        await registration.unregister()
                    }

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

                    setIsReady(true)
                } catch (error) {
                    setIsReady(true)
                }
            }

            if ('serviceWorker' in navigator) {
                initMocks()
            } else {
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
