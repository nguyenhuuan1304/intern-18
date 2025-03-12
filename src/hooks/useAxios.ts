import axios, { AxiosInstance } from "axios";

class Axios {
    instance: AxiosInstance
    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:1337/api',
            timeout: 1000
        })
    }
}

const http = new Axios().instance

export default http