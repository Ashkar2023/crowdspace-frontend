import axios from "axios";
import { accessTokenCheck } from "./base.api";

const BASE_URL: string = "http://localhost:9000";

/* 'withCredentials' essential for setting cookies */
export const userApiPublic = axios.create({
    baseURL: BASE_URL + "/user",
    withCredentials: true,
});

export const userApiProtected = axios.create({
    baseURL: BASE_URL + "/user",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

userApiProtected.interceptors.response.use(
    request => request,
    accessTokenCheck
)
