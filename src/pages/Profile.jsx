import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { getProfileThunk, updateProfileThunk } from '../redux/reducers/userReducer'
import { getProductFavoriteThunk, toggleFavoriteThunk } from '../redux/reducers/productReducer'

const PAGE_SIZE = 2

// Định dạng ngày DD-MM-YYYY
const formatDate = (date) => {
    const d = new Date(date)
    if (isNaN(d)) return date
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}

const Profile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userProfile } = useSelector(state => state.userReducer)
    const { arrFavorite } = useSelector(state => state.productReducer)
    const [tab, setTab] = useState('order')
    const [page, setPage] = useState(1)

    useEffect(() => {
        dispatch(getProfileThunk())
        dispatch(getProductFavoriteThunk())
    }, [dispatch])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: userProfile?.email ?? '',
            name: userProfile?.name ?? '',
            phone: userProfile?.phone ?? '',
            password: '',
            gender: userProfile?.gender ?? true
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name không được bỏ trống').matches(/^[\p{L}\s]+$/u, 'Name chỉ được chứa chữ cái'),
            phone: Yup.string().required('Phone không được bỏ trống').matches(/^\d{9,11}$/, 'Phone chỉ gồm số, từ 9 - 11 ký tự'),
            password: Yup.string().test('optional-min', 'Password từ 6 - 32 ký tự', (v) => !v || (v.length >= 6 && v.length <= 32))
        }),
        onSubmit: (values) => {
            const { email, name, gender, phone, password } = values
            const body = { email, name, gender, phone }
            if (password) body.password = password
            dispatch(updateProfileThunk(body))
        }
    })

    const orders = [...(userProfile?.ordersHistory ?? [])].sort((a, b) => new Date(b.date) - new Date(a.date))
    const totalPage = Math.ceil(orders.length / PAGE_SIZE)
    const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const renderOrders = () => {
        if (orders.length === 0) return <p className="mt-3">Chưa có đơn hàng</p>
        return (
            <>
                {pageOrders.map((order) => (
                    <div key={order.id}>
                        <p className="profile-order-date">+ Orders have been placed on {formatDate(order.date)}</p>
                        <table className="table profile-table align-middle">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>img</th>
                                    <th>name</th>
                                    <th>price</th>
                                    <th>quantity</th>
                                    <th>total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderDetail.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><img src={item.image} alt={item.name} /></td>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                {totalPage > 1 && (
                    <nav>
                        <ul className="pagination justify-content-end">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button type="button" className="page-link" onClick={() => setPage(page - 1)}>&lt;</button>
                            </li>
                            {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                    <button type="button" className="page-link" onClick={() => setPage(p)}>{p}</button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPage ? 'disabled' : ''}`}>
                                <button type="button" className="page-link" onClick={() => setPage(page + 1)}>&gt;</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </>
        )
    }

    const renderFavorite = () => {
        if (!arrFavorite || arrFavorite.length === 0) return <p className="mt-3">Chưa có sản phẩm yêu thích</p>
        return (
            <div className="row g-3 mt-1">
                {arrFavorite.map((item) => (
                    <div className="col-6 col-md-3" key={item.id}>
                        <div className="profile-fav-item">
                            <i className="fa-solid fa-heart text-danger profile-fav-heart" onClick={() => dispatch(toggleFavoriteThunk(item.id, true))}></i>
                            <img src={item.image} alt={item.name} onClick={() => navigate(`/detail/${item.id}`)} />
                            <h6 className="mt-2">{item.name}</h6>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="container py-4">
            <h3 className="title-gradient">Profile</h3>
            <form className="row mt-4" onSubmit={formik.handleSubmit} noValidate>
                <div className="col-md-3 text-center mb-3">
                    <img className="profile-avatar" src={userProfile?.avatar} alt="avatar" />
                </div>
                <div className="col-md-4">
                    <div className="mb-3">
                        <label className="fw-bold" htmlFor="email">Email</label>
                        <input id="email" name="email" className="input-grey" readOnly value={formik.values.email} />
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold" htmlFor="phone">Phone</label>
                        <input id="phone" name="phone" className="input-grey" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} />
                        <p className="text-danger small mb-0">{formik.touched.phone && formik.errors.phone}</p>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="mb-3">
                        <label className="fw-bold" htmlFor="name">Name</label>
                        <input id="name" name="name" className="input-grey" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                        <p className="text-danger small mb-0">{formik.touched.name && formik.errors.name}</p>
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold" htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" className="input-grey" placeholder="Để trống nếu không đổi" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                        <p className="text-danger small mb-0">{formik.touched.password && formik.errors.password}</p>
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
                    <div className="d-flex justify-content-end align-items-center gap-3">
                        <NavLink to="/change-password">Đổi mật khẩu</NavLink>
                        <button type="submit" className="btn-purple">Update</button>
                    </div>
                </div>
            </form>

            <div className="profile-tabs mt-4">
                <button type="button" className={`profile-tab ${tab === 'order' ? 'active' : ''}`} onClick={() => setTab('order')}>Order history</button>
                <button type="button" className={`profile-tab ${tab === 'favourite' ? 'active' : ''}`} onClick={() => setTab('favourite')}>Favourite</button>
            </div>
            {tab === 'order' ? renderOrders() : renderFavorite()}
        </div>
    )
}

export default Profile
