import axios from "axios";
import { accessTokenCheck } from "./accessToken.interceptor";
import { BASE_URL } from "~constants/api.constants";


export const protectedApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    }
});

protectedApi.interceptors.response.use(
    request => request,
    accessTokenCheck
)