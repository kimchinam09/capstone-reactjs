import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import { ACCESS_TOKEN, getStore } from '../constants/appConstants'
import { history } from '../middlewares/history'
import { getAllProductThunk, getProductFavoriteThunk, toggleFavoriteThunk } from '../redux/reducers/productReducer'

const Home = () => {
    const { arrProduct, arrFavorite } = useSelector(state => state.productReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllProductThunk())
        if (getStore(ACCESS_TOKEN)) {
            dispatch(getProductFavoriteThunk())
        }
    }, [dispatch])

    const handleToggleFavorite = (id) => {
        if (!getStore(ACCESS_TOKEN)) {
            history.push('/login')
            return
        }
        const isFav = arrFavorite.some(p => p.id === id)
        dispatch(toggleFavoriteThunk(id, isFav))
    }

    return (
        <div>
            <Carousel products={arrProduct.slice(0, 4)} />
            <div className="section-light">
                <div className="container py-4">
                    <div className="mb-4">
                        <span className="title-gradient">Product Feature</span>
                    </div>
                    <div className="row g-4">
                        {arrProduct.slice(0, 9).map((product) => (
                        <div key={product.id} className="col-12 col-md-6 col-lg-4">
                            <ProductCard
                                product={product}
                                isFavorite={arrFavorite.some(p => p.id === product.id)}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/search" className="btn btn-outline-dark">Xem tất cả sản phẩm</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
