import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutAction } from '../redux/reducers/userReducer'

const menu = [
    { label: 'Home', to: '/' },
    { label: 'Men', to: '/search?category=MEN' },
    { label: 'Woman', to: '/search?category=WOMEN' },
    { label: 'Kid', to: '/search?k=kid' },
    { label: 'Sport', to: '/search?k=sport' }
]

const Header = () => {
    const { arrCart } = useSelector(state => state.cartReducer)
    const { userLogin } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cartCount = arrCart.reduce((total, item) => total + item.quantity, 0)

    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(logoutAction())
        navigate('/')
    }

    return (
        <header>
            <div className="header-top d-flex justify-content-between align-items-center px-4">
                <Link to="/" className="header-logo"><i className="fa-solid fa-cube me-2"></i>CYBERSOFT</Link>
                <div className="d-flex align-items-center gap-4 header-actions">
                    <Link to="/search" className="header-search"><i className="fa-solid fa-magnifying-glass me-2"></i>Search</Link>
                    <Link to="/carts" className="header-cart"><i className="fa-solid fa-cart-shopping me-1"></i>({cartCount})</Link>
                    {userLogin ? (
                        <>
                            <Link to="/profile">{userLogin.email}</Link>
                            <a href="/" onClick={handleLogout}>Logout</a>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-small">Login</Link>
                            <Link to="/register" className="header-small">Register</Link>
                        </>
                    )}
                </div>
            </div>
            <nav className="header-menu d-flex gap-4 px-4">
                {menu.map((item) => (
                    <NavLink key={item.label} to={item.to} end className={({ isActive }) => (isActive && item.to === '/' ? 'active' : '')}>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}

export default Header
