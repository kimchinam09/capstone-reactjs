import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { registerThunk } from '../redux/reducers/userReducer'

const Register = () => {
    const dispatch = useDispatch()
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            name: '',
            phone: '',
            gender: true
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Email không được bỏ trống').email('Email không đúng định dạng'),
            password: Yup.string().required('Password không được bỏ trống').min(6, 'Password từ 6 - 32 ký tự').max(32, 'Password từ 6 - 32 ký tự'),
            passwordConfirm: Yup.string().required('Password confirm không được bỏ trống').oneOf([Yup.ref('password')], 'Password confirm không khớp'),
            name: Yup.string().required('Name không được bỏ trống').matches(/^[\p{L}\s]+$/u, 'Name chỉ được chứa chữ cái'),
            phone: Yup.string().required('Phone không được bỏ trống').matches(/^\d{9,11}$/, 'Phone chỉ gồm số, từ 9 - 11 ký tự')
        }),
        onSubmit: (values) => {
            const { email, password, name, gender, phone } = values
            dispatch(registerThunk({ email, password, name, gender, phone }))
        }
    })

    return (
        <div className="section-light">
        <div className="container py-4">
            <h3 className="auth-title">Register</h3>
            <hr />
            <form onSubmit={formik.handleSubmit} noValidate>
                <div className="row">
                    <div className="col-md-6">
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
                        <div className="mb-3">
                            <label className="fw-bold" htmlFor="passwordConfirm">Password confirm</label>
                            <div className="auth-password">
                                <input id="passwordConfirm" name="passwordConfirm" type={showConfirm ? 'text' : 'password'} className="input-grey" placeholder="password confirm" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.passwordConfirm} />
                                <i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} auth-eye`} onClick={() => setShowConfirm(!showConfirm)}></i>
                            </div>
                            <p className="text-danger small mb-0">{formik.touched.passwordConfirm && formik.errors.passwordConfirm}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="fw-bold" htmlFor="name">Name</label>
                            <input id="name" name="name" className="input-grey" placeholder="name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                            <p className="text-danger small mb-0">{formik.touched.name && formik.errors.name}</p>
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold" htmlFor="phone">Phone</label>
                            <input id="phone" name="phone" className="input-grey" placeholder="phone" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} />
                            <p className="text-danger small mb-0">{formik.touched.phone && formik.errors.phone}</p>
                        </div>
                        <div className="mb-3 d-flex align-items-start gap-5">
                            <label className="fw-bold">Gender</label>
                            <label className="radio-stack">
                                <input type="radio" name="gender" className="radio-purple" checked={formik.values.gender === true} onChange={() => formik.setFieldValue('gender', true)} />
                                <span>Male</span>
                            </label>
                            <label className="radio-stack">
                                <input type="radio" name="gender" className="radio-purple" checked={formik.values.gender === false} onChange={() => formik.setFieldValue('gender', false)} />
                                <span>Female</span>
                            </label>
                        </div>
                        <button type="submit" className="btn-purple">SUBMIT</button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    )
}

export default Register
