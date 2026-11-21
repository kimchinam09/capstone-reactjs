import axios from 'axios'
import { ACCESS_TOKEN, BASE_URL, USER_LOGIN, getStore, removeStore } from '../constants/appConstants'
import { history } from './history'

export const http = axios.create({
    baseURL: BASE_URL,
    timeout: 20000
})

http.interceptors.request.use((config) => {
    const token = getStore(ACCESS_TOKEN)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => Promise.reject(error))

http.interceptors.response.use((res) => res, (error) => {
    // Token hết hạn -> về trang đăng nhập
    if (error.response?.status === 401) {
        removeStore(ACCESS_TOKEN)
        removeStore(USER_LOGIN)
        history.push('/login')
    }
    return Promise.reject(error)
})
