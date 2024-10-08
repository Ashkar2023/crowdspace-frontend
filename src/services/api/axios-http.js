import axios from "axios";
import store from "../store/store";
import { errorConstants } from "../../constants/error.constants";
import { clearUser } from "../store/user.slice";


const API_CONFIG = {
    BASE_URL: "http://localhost:3000",
}

export const axiosPublic = axios.create({
    baseURL: API_CONFIG.BASE_URL,
});

export const axiosProtected = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});


axiosProtected.interceptors.response.use(
    request => request,
    async (error) => {
        const { response } = error;

        if (response.status === 401 && !error.config._sent && response.data.error === errorConstants.ERR_INVALID_ACCESS) {
            try {
                error.config._sent = true;
                const res = await axiosProtected.get("/auth/token-refresh");

                if (res.data.success) {
                    return axiosProtected(error.config);
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
