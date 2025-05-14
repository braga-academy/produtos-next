import '@testing-library/jest-dom'
import { expect } from '@jest/globals'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument (): R
            toHaveAttribute (attr: string, value?: string): R
            toHaveBeenCalled (): R
            toHaveBeenCalledWith (...args: any[]): R
        }
    }
}

expect.extend({
    toBeInTheDocument (received) {
        const pass = received !== null
        return {
            message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
            pass,
        }
    },
    toHaveAttribute (received, attr, value) {
        const element = received as HTMLElement
        const hasAttr = element.hasAttribute(attr)
        const attrValue = element.getAttribute(attr)
        const pass = value ? hasAttr && attrValue === value : hasAttr
        return {
            message: () => `expected ${received} ${pass ? 'not ' : ''}to have attribute ${attr}${value ? ` with value ${value}` : ''}`,
            pass,
        }
    },
})
