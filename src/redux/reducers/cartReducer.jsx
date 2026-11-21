import { createSlice } from '@reduxjs/toolkit'
import { CART, getStoreJson, setStoreJson } from '../../constants/appConstants'
import { http } from '../../middlewares/interceptors'

const cartReducer = createSlice({
    name: 'cartReducer',
    initialState: {
        arrCart: getStoreJson(CART) ?? []
    },
    reducers: {
        addToCartRedux: (state, action) => {
            const item = state.arrCart.find(p => p.id === action.payload.id)
            if (item) {
                item.quantity += action.payload.quantity
            } else {
                state.arrCart.push({ ...action.payload, checked: true })
            }
            setStoreJson(CART, state.arrCart)
        },
        changeQuantityRedux: (state, action) => {
            const { id, delta } = action.payload
            const item = state.arrCart.find(p => p.id === id)
            if (item) {
                item.quantity = Math.max(1, item.quantity + delta)
            }
            setStoreJson(CART, state.arrCart)
        },
        deleteCartItemRedux: (state, action) => {
            state.arrCart = state.arrCart.filter(p => p.id !== action.payload)
            setStoreJson(CART, state.arrCart)
        },
        toggleCheckRedux: (state, action) => {
            const item = state.arrCart.find(p => p.id === action.payload)
            if (item) {
                item.checked = !item.checked
            }
            setStoreJson(CART, state.arrCart)
        },
        toggleCheckAllRedux: (state, action) => {
            state.arrCart.forEach(p => { p.checked = action.payload })
            setStoreJson(CART, state.arrCart)
        },
        removeCheckedRedux: (state) => {
            state.arrCart = state.arrCart.filter(p => !p.checked)
            setStoreJson(CART, state.arrCart)
        }
    }
})

export const {
    addToCartRedux,
    changeQuantityRedux,
    deleteCartItemRedux,
    toggleCheckRedux,
    toggleCheckAllRedux,
    removeCheckedRedux
} = cartReducer.actions
export default cartReducer.reducer

export const addToCartAction = (item) => {
    return (dispatch) => {
        dispatch(addToCartRedux(item))
    }
}

export const submitOrderThunk = (items, email) => {
    return async (dispatch) => {
        if (items.length === 0) {
            alert('Vui lòng chọn sản phẩm')
            return
        }
        try {
            const orderDetail = items.map(i => ({ productId: String(i.id), quantity: i.quantity }))
            await http.post('/api/Users/order', { orderDetail, email })
            alert('Đặt hàng thành công!')
            dispatch(removeCheckedRedux())
        } catch (error) {
            alert(error.response?.data?.message)
        }
    }
}
