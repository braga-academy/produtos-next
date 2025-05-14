import { forwardRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { Input } from '@/components/ui/input'

interface PriceInputProps extends Omit<NumericFormatProps, 'onValueChange'> {
    onValueChange: (value: number) => void
    value?: number
    name?: string
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
    ({ onValueChange, value, name, ...props }, ref) => {
        return (
            <NumericFormat
                {...props}
                name={name}
                getInputRef={ref}
                value={value}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                onValueChange={(values) => {
                    onValueChange(values.floatValue || 0)
                }}
                customInput={Input}
                className="cursor-pointer"
                allowNegative={false}
            />
        )
    }
)

PriceInput.displayName = 'PriceInput'
