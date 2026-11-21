import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    changeQuantityRedux,
    deleteCartItemRedux,
    submitOrderThunk,
    toggleCheckAllRedux,
    toggleCheckRedux
} from '../redux/reducers/cartReducer'

const FALLBACK_IMG = 'https://placehold.co/80x80?text=No+image'

const Carts = () => {
    const { arrCart } = useSelector(state => state.cartReducer)
    const { userLogin, userProfile } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const checkedItems = arrCart.filter(p => p.checked)
    const allChecked = arrCart.length > 0 && checkedItems.length === arrCart.length
    const grandTotal = checkedItems.reduce((sum, p) => sum + p.price * p.quantity, 0)

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            dispatch(deleteCartItemRedux(id))
        }
    }

    const handleSubmit = () => {
        const email = userLogin?.email || userProfile?.email
        dispatch(submitOrderThunk(checkedItems, email))
    }

    return (
        <div className="container py-4">
            <h3 className="carts-title">Carts</h3>
            <hr />
            {arrCart.length === 0 ? (
                <div className="text-center py-5">
                    <p>Giỏ hàng đang trống.</p>
                    <NavLink to="/" className="btn-purple text-decoration-none">Về trang chủ</NavLink>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table align-middle carts-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={allChecked}
                                            onChange={(e) => dispatch(toggleCheckAllRedux(e.target.checked))}
                                        />
                                    </th>
                                    <th>id</th>
                                    <th>img</th>
                                    <th>name</th>
                                    <th>price</th>
                                    <th>quantity</th>
                                    <th>total</th>
                                    <th>action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrCart.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={!!item.checked}
                                                onChange={() => dispatch(toggleCheckRedux(item.id))}
                                            />
                                        </td>
                                        <td>{item.id}</td>
                                        <td>
                                            <img
                                                className="carts-img"
                                                src={item.image}
                                                alt={item.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG }}
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <button type="button" className="carts-qty-btn" onClick={() => dispatch(changeQuantityRedux({ id: item.id, delta: 1 }))}>+</button>
                                                <span className="carts-qty-num">{item.quantity}</span>
                                                <button type="button" className="carts-qty-btn" onClick={() => dispatch(changeQuantityRedux({ id: item.id, delta: -1 }))}>-</button>
                                            </div>
                                        </td>
                                        <td>{item.price * item.quantity}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button type="button" className="carts-btn-edit" onClick={() => navigate(`/detail/${item.id}`)}>EDIT</button>
                                                <button type="button" className="carts-btn-delete" onClick={() => handleDelete(item.id)}>DELETE</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-end">
                        <div className="mb-2 fw-bold">Tổng cộng: {grandTotal}$</div>
                        <button type="button" className="carts-btn-submit" onClick={handleSubmit}>SUBMIT ORDER</button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Carts
