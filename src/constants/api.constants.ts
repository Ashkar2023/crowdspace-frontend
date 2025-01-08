export enum CheckStatus {
    IDLE = "IDLE",
    LOADING = "LOADING",
    FOUND = "FOUND",
    NOT_FOUND = "NOT_FOUND",
}

export const BASE_URL = import.meta.env.VITE_API_URL;