import { Navigate, Outlet } from 'react-router-dom'
import { ACCESS_TOKEN, getStore } from '../constants/appConstants'

const ProtectedRoute = () => {
    if (!getStore(ACCESS_TOKEN)) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoute
