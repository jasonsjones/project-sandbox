import { useEffect, useRef } from 'react';

type CbType = () => void;
type Options = {
    executeImmediate: boolean;
};

export function useInterval(
    callback: CbType,
    delay: number,
    { executeImmediate = false }: Options
) {
    const savedCallback = useRef<CbType>();

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        if (executeImmediate) {
            tick();
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, executeImmediate]);
}
