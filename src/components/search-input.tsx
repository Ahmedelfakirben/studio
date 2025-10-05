'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { Input } from '@/components/ui/input'

export function SearchInput({ placeholder }: { placeholder: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [inputValue, setInputValue] = React.useState(searchParams.get('search') || '')
    const debouncedInputValue = useDebounce(inputValue, 500)

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedInputValue) {
            params.set('search', debouncedInputValue)
        } else {
            params.delete('search')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, [debouncedInputValue, pathname, router, searchParams])

    return (
        <Input
            type="search"
            placeholder={placeholder}
            className="w-full rounded-lg bg-muted pl-8 md:w-[320px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    )
}
