import axios from "axios";
import { useMemo } from "react";

const useAxios = () => {
    const api = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:1337/api',
            headers: {"Content-Type": "application/json"}
        })
    },[])
    
    return {
        api,
    }
}
export const api = axios.create({
    baseURL: 'http://localhost:1337/api',
    headers: { "Content-Type": "application/json" }
});


export default useAxios