import { AxiosError, AxiosRequestConfig } from "axios";
import { errorConstants } from "~constants/error.constants";
import { userApiProtected } from "./user.api";
import store from "~services/state/store";
import { clearUser } from "~services/state/user.slice";

declare module "axios" {
    export interface AxiosRequestConfig {
        _sent?: boolean
    }
}

export const accessTokenCheck = async (error: AxiosError<{ error: string }>) => {
    const { response } = error;

    if (response?.status === 401 && !error.config?._sent && response.data.error === errorConstants.ERR_INVALID_ACCESS) {
        try {
            error.config!._sent = true;
            const res = await userApiProtected.get("/auth/token-refresh");

            if (res.data.success) {
                return userApiProtected(error.config!);
            }
        } catch (error) {
            if (
                error instanceof AxiosError &&
                error.response?.data.error === errorConstants.ERR_INVALID_REFRESH
            ) {
                store.dispatch(clearUser());
                return Promise.reject(error);
            }
        }
    }

    return Promise.reject(error);
}