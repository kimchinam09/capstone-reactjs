import { createSlice } from '@reduxjs/toolkit'
import { ACCESS_TOKEN, USER_LOGIN, getStoreJson, removeStore, setStore, setStoreJson } from '../../constants/appConstants'
import { http } from '../../middlewares/interceptors'
import { history } from '../../middlewares/history'

const userReducer = createSlice({
    name: 'userReducer',
    initialState: {
        userLogin: getStoreJson(USER_LOGIN) ?? null,
        userProfile: null
    },
    reducers: {
        setUserLoginRedux: (state, action) => {
            state.userLogin = action.payload
        },
        setUserProfileRedux: (state, action) => {
            state.userProfile = action.payload
        }
    }
})

export const { setUserLoginRedux, setUserProfileRedux } = userReducer.actions
export default userReducer.reducer

export const logoutAction = () => {
    return (dispatch) => {
        removeStore(ACCESS_TOKEN)
        removeStore(USER_LOGIN)
        dispatch(setUserLoginRedux(null))
        dispatch(setUserProfileRedux(null))
    }
}

export const getProfileThunk = () => {
    return async (dispatch) => {
        try {
            const res = await http.post('/api/Users/getProfileV2', {})
            dispatch(setUserProfileRedux(res.data.content))
        } catch (error) {
            alert(error.response?.data?.message)
        }
    }
}

export const registerThunk = (values) => {
    return async () => {
        try {
            const res = await http.post('/api/Users/signup', values)
            alert(res.data.message)
            history.push('/login')
        } catch (error) {
            alert(error.response?.data?.message)
        }
    }
}

// Lưu thông tin đăng nhập, lấy profile rồi chuyển sang trang profile
const saveLogin = async (dispatch, content) => {
    setStore(ACCESS_TOKEN, content.accessToken)
    setStoreJson(USER_LOGIN, content)
    dispatch(setUserLoginRedux(content))
    await dispatch(getProfileThunk())
    history.push('/profile')
}

export const loginThunk = (values) => {
    return async (dispatch) => {
        try {
            const res = await http.post('/api/Users/signin', values)
            await saveLogin(dispatch, res.data.content)
        } catch (error) {
            alert(error.response?.data?.message)
        }
    }
}

export const loginFacebookThunk = (facebookToken) => {
    return async (dispatch) => {
        try {
            const res = await http.post('/api/Users/facebooklogin', { facebookToken })
            await saveLogin(dispatch, res.data.content)
        } catch (error) {
            alert(error.response?.data?.message)
        }
    }
}

export const updateProfileThunk = (values) => {
    return async (dispatch) => {
        try {
            await http.post('/api/Users/updateProfile', values)
            alert('Cập nhật thành công!')
            dispatch(getProfileThunk())
        } catch (error) {
            alert(error.response?.data?.message || 'Cập nhật thất bại')
        }
    }
}

export const changePasswordThunk = (newPassword) => {
    return async () => {
        try {
            await http.post('/api/Users/changePassword', { newPassword })
            alert('Đổi mật khẩu thành công!')
            history.push('/profile')
        } catch (error) {
            alert(error.response?.data?.message || 'Đổi mật khẩu thất bại')
        }
    }
}
