import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, NavLink } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { ACCESS_TOKEN, FB_APP_ID, getStore } from '../constants/appConstants'
import { loginFacebookThunk, loginThunk } from '../redux/reducers/userReducer'

const Login = () => {
    const dispatch = useDispatch()
    const { userLogin } = useSelector(state => state.userReducer)
    const [showPass, setShowPass] = useState(false)

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().required('Email không được bỏ trống').email('Email không đúng định dạng'),
            password: Yup.string().required('Password không được bỏ trống')
        }),
        onSubmit: (values) => {
            dispatch(loginThunk(values))
        }
    })

    if (userLogin && getStore(ACCESS_TOKEN)) {
        return <Navigate to="/profile" />
    }

    return (
        <div className="section-light">
        <div className="container py-4">
            <h3 className="auth-title">Login</h3>
            <hr />
            <div className="auth-form-narrow">
                <form onSubmit={formik.handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="fw-bold" htmlFor="email">Email</label>
                        <input id="email" name="email" className="input-grey" placeholder="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        <p className="text-danger small mb-0">{formik.touched.email && formik.errors.email}</p>
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold" htmlFor="password">Password</label>
                        <div className="auth-password">
                            <input id="password" name="password" type={showPass ? 'text' : 'password'} className="input-grey" placeholder="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                            <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} auth-eye`} onClick={() => setShowPass(!showPass)}></i>
                        </div>
                        <p className="text-danger small mb-0">{formik.touched.password && formik.errors.password}</p>
                    </div>
                    <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
                        <NavLink to="/register">Register now ?</NavLink>
                        <button type="submit" className="btn-purple">LOGIN</button>
                    </div>
                </form>
                {FB_APP_ID ? (
                    <FacebookLogin
                        appId={FB_APP_ID}
                        callback={(response) => {
                            if (response.accessToken) dispatch(loginFacebookThunk(response.accessToken))
                            else alert('Đăng nhập Facebook thất bại')
                        }}
                        render={({ onClick }) => (
                            <button type="button" className="btn-facebook" onClick={onClick}>
                                <i className="fa-brands fa-facebook btn-facebook-icon"></i>Continue with Facebook
                            </button>
                        )}
                    />
                ) : (
                    <button type="button" className="btn-facebook" onClick={() => alert('Chưa cấu hình VITE_FB_APP_ID trong file .env')}>
                        <i className="fa-brands fa-facebook btn-facebook-icon"></i>Continue with Facebook
                    </button>
                )}
            </div>
        </div>
        </div>
    )
}

export default Login
