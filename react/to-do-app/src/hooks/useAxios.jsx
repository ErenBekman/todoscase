import { useEffect } from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useAxios = () => {
    const auth = useAuth();

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
        }
    }, [auth?.token]);

    return axios;
}

export default useAxios;