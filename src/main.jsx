import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './assets/css/main.css'
import { history } from './middlewares/history'
import { store } from './redux/store'
import HomeTemplate from './templates/HomeTemplate'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Carts from './pages/Carts'
import ChangePassword from './pages/ChangePassword'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HistoryRouter history={history} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Provider store={store}>
        <Routes>
          <Route path="" element={<HomeTemplate />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="detail/:id" element={<Detail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="carts" element={<Carts />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="*" element={<Navigate to="" />} />
          </Route>
        </Routes>
      </Provider>
    </HistoryRouter>
  </StrictMode>,
)
