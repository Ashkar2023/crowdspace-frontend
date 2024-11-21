import axios from "axios";
import { accessTokenCheck } from "./base.api";

const BASE_URL: string = "http://localhost:9000";

export const mediaApi = axios.create({
    baseURL: BASE_URL + "/media",
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" }
});

mediaApi.interceptors.response.use(
    request => request,
    accessTokenCheck
)