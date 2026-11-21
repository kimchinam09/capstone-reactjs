export const BASE_URL = 'https://apistore.cybersoft.edu.vn'
export const ACCESS_TOKEN = 'accessToken'
export const USER_LOGIN = 'userLogin'
export const CART = 'cart'
export const FB_APP_ID = import.meta.env.VITE_FB_APP_ID

export const setStore = (name, value) => {
    localStorage.setItem(name, value)
}

export const getStore = (name) => {
    return localStorage.getItem(name)
}

export const setStoreJson = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value))
}

export const getStoreJson = (name) => {
    const value = localStorage.getItem(name)
    if (!value) return null
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

export const removeStore = (name) => {
    localStorage.removeItem(name)
}
