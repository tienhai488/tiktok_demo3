import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, 500);
        return () => clearTimeout(timer);
    }, [value]);
    return debounceValue;
}

export default useDebounce;
