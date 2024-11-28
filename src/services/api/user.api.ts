import axios from "axios";
import { accessTokenCheck } from "./accessToken.interceptor";
import { BASE_URL } from "~constants/api.constants";


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
