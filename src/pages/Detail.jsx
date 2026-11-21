import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ACCESS_TOKEN, getStore } from '../constants/appConstants'
import { history } from '../middlewares/history'
import { addToCartAction } from '../redux/reducers/cartReducer'
import { getProductDetailThunk, getProductFavoriteThunk, toggleFavoriteThunk } from '../redux/reducers/productReducer'

const FALLBACK_IMG = 'https://placehold.co/400x400?text=No+image'

const Detail = () => {
    const params = useParams()
    const { productDetail, arrFavorite } = useSelector(state => state.productReducer)
    const dispatch = useDispatch()
    const [size, setSize] = useState('')
    // Số lượng gắn với id sản phẩm để tự về 1 khi đổi sản phẩm
    const [qty, setQty] = useState({ id: null, value: 1 })
    const quantity = qty.id === params.id ? qty.value : 1
    const setQuantity = (value) => setQty({ id: params.id, value })
    const [addedId, setAddedId] = useState(null)

    const sizes = Array.isArray(productDetail.size) ? productDetail.size : []
    const selectedSize = sizes.includes(size) ? size : sizes[0]
    const related = productDetail.relatedProducts ?? []

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(getProductDetailThunk(params.id))
    }, [params.id, dispatch])

    useEffect(() => {
        if (getStore(ACCESS_TOKEN)) {
            dispatch(getProductFavoriteThunk())
        }
    }, [dispatch])

    const handleAddToCart = () => {
        const { id, name, image, price } = productDetail
        dispatch(addToCartAction({ id, name, image, price, quantity }))
        setAddedId(id)
    }

    const handleToggleFavorite = (id) => {
        if (!getStore(ACCESS_TOKEN)) {
            history.push('/login')
            return
        }
        dispatch(toggleFavoriteThunk(id, arrFavorite.some(p => p.id === id)))
    }

    return (
        <div>
            <div className="container py-4">
            <div className="row g-4 align-items-center">
                <div className="col-md-5">
                    <div className="detail-img-box">
                        <img
                            src={productDetail.image}
                            alt={productDetail.name}
                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG }}
                        />
                    </div>
                </div>
                <div className="col-md-7">
                    <h2 className="detail-name">{productDetail.name}</h2>
                    <p className="detail-desc">{productDetail.description}</p>
                    <h5 className="detail-size-label">Available size</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {sizes.map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={`detail-size-btn ${item === selectedSize ? 'active' : ''}`}
                                onClick={() => setSize(item)}
                            >{item}</button>
                        ))}
                    </div>
                    <div className="detail-price mb-3">{productDetail.price}$</div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <button type="button" className="detail-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                        <span className="px-2">{quantity}</span>
                        <button type="button" className="detail-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    </div>
                    <button type="button" className="btn-add-cart" onClick={handleAddToCart}>Add to cart</button>
                    {addedId === productDetail.id && <div className="text-success mt-2">Đã thêm vào giỏ hàng!</div>}
                </div>
            </div>

            </div>
            <div className="section-light">
            <div className="container py-4">
            <h3 className="detail-related-title text-center">-Realate Product-</h3>
            <div className="row g-4">
                {related.map((product) => (
                    <div key={product.id} className="col-12 col-md-6 col-lg-4">
                        <ProductCard
                            product={product}
                            isFavorite={arrFavorite.some(p => p.id === product.id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    </div>
                ))}
            </div>
            </div>
            </div>
        </div>
    )
}

export default Detail
