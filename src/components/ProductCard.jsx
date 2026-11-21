import { useNavigate } from 'react-router-dom'

const FALLBACK_IMG = 'https://placehold.co/300x200?text=No+image'

const ProductCard = ({ product, isFavorite = false, onToggleFavorite }) => {
    const navigate = useNavigate()

    return (
        <div className="product-card">
            <i
                className={`${isFavorite ? 'fa-solid text-danger' : 'fa-regular'} fa-heart product-card-heart`}
                onClick={() => onToggleFavorite?.(product.id)}
            ></i>
            <div className="product-card-img">
                <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG }}
                />
            </div>
            <div className="product-card-body">
                <h6 className="product-card-name">{product.name}</h6>
                <p className="product-card-desc">{product.shortDescription}</p>
            </div>
            <div className="product-card-footer">
                <button type="button" className="btn-buy" onClick={() => navigate(`/detail/${product.id}`)}>Buy now</button>
                <div className="product-card-price">{product.price}$</div>
            </div>
        </div>
    )
}

export default ProductCard
