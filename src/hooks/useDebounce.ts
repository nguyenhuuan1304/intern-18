import { useEffect, useState } from "react";

function useDebounce (value: string, delay: number) {
    const [debounceValue, setDebounceValue] = useState(value)
    useEffect(() => {
        const result = setTimeout(() => {
            setDebounceValue(value)
        },delay)

        return () => clearInterval(result)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[value])

    return debounceValue
}

export default useDebounce