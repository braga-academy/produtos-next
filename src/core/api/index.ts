import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3005/api',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
})

export default api

api.interceptors.request.use((config) => {
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)
