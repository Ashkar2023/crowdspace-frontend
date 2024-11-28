import axios from "axios";
import { BASE_URL } from "~constants/api.constants";


export const authApi = axios.create({
    baseURL: BASE_URL + "/auth",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});


