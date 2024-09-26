export const debounce = (func, delay) => {
    let timeoutId;

    return function (...args) {
        console.time("debounce")
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}