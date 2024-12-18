import axios from "axios";
import { accessTokenCheck } from "./accessToken.interceptor";
import { BASE_URL } from "~constants/api.constants";


export const mediaApi = axios.create({
    baseURL: BASE_URL + "/media",
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" }
});

mediaApi.interceptors.response.use(
    request => request,
    accessTokenCheck
)