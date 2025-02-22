export const computeNextPageParam = (arrLength: number, itemsPerFetch: number, pageParam: number) => {
    return arrLength < itemsPerFetch ? null : ++pageParam;
}
