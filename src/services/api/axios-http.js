import axios from "axios";
import store from "../state/store";
import { errorConstants } from "../../constants/error.constants";
import { clearUser } from "../state/user.slice";


const BASE_URL = "http://localhost:9000";

/* 'withCredentials' essential for setting cookies */
export const userApiPublic = axios.create({
    baseURL: BASE_URL + "/u",
    withCredentials: true,
});

export const userApiProtected = axios.create({
    baseURL: BASE_URL + "/u",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

userApiProtected.interceptors.response.use(
    request => request,
    async (error) => {
        const { response } = error;

        if (response.status === 401 && !error.config._sent && response.data.error === errorConstants.ERR_INVALID_ACCESS) {
            try {
                error.config._sent = true;
                const res = await userApiProtected.get("/auth/token-refresh");

                if (res.data.success) {
                    return userApiProtected(error.config);
                }
            } catch (error) {
                if (error.response.data.error === errorConstants.ERR_INVALID_REFRESH) {
                    store.dispatch(clearUser());
                    return Promise.reject(error);
                }
            }
        }

        return Promise.reject(error);
    }
)
