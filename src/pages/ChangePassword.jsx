import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { changePasswordThunk } from '../redux/reducers/userReducer'

const ChangePassword = () => {
    const dispatch = useDispatch()
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const formik = useFormik({
        initialValues: { newPassword: '', passwordConfirm: '' },
        validationSchema: Yup.object({
            newPassword: Yup.string().required('Password không được bỏ trống').min(6, 'Password từ 6 - 32 ký tự').max(32, 'Password từ 6 - 32 ký tự'),
            passwordConfirm: Yup.string().required('Password confirm không được bỏ trống').oneOf([Yup.ref('newPassword')], 'Password confirm không khớp')
        }),
        onSubmit: (values) => {
            dispatch(changePasswordThunk(values.newPassword))
        }
    })

    return (
        <div className="container py-4">
            <h3 className="auth-title">Change password</h3>
            <hr />
            <form className="auth-form-narrow" onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="fw-bold" htmlFor="newPassword">New password</label>
                    <div className="auth-password">
                        <input id="newPassword" name="newPassword" type={showPass ? 'text' : 'password'} className="input-grey" placeholder="new password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.newPassword} />
                        <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} auth-eye`} onClick={() => setShowPass(!showPass)}></i>
                    </div>
                    <p className="text-danger small mb-0">{formik.touched.newPassword && formik.errors.newPassword}</p>
                </div>
                <div className="mb-3">
                    <label className="fw-bold" htmlFor="passwordConfirm">Password confirm</label>
                    <div className="auth-password">
                        <input id="passwordConfirm" name="passwordConfirm" type={showConfirm ? 'text' : 'password'} className="input-grey" placeholder="password confirm" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.passwordConfirm} />
                        <i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} auth-eye`} onClick={() => setShowConfirm(!showConfirm)}></i>
                    </div>
                    <p className="text-danger small mb-0">{formik.touched.passwordConfirm && formik.errors.passwordConfirm}</p>
                </div>
                <button type="submit" className="btn-purple">SUBMIT</button>
            </form>
        </div>
    )
}

export default ChangePassword
