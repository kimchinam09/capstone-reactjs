import { useNavigate } from 'react-router-dom'

const FALLBACK_IMG = 'https://placehold.co/400x400?text=No+image'

const Carousel = ({ products = [] }) => {
    const navigate = useNavigate()

    if (products.length === 0) return null

    return (
        <div id="homeCarousel" className="carousel slide home-carousel" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {products.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        data-bs-target="#homeCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner">
                {products.map((item, index) => (
                    <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <div className="container">
                            <div className="row align-items-center home-carousel-slide">
                                <div className="col-md-6 text-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="home-carousel-img"
                                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h2 className="fw-bold">{item.name}</h2>
                                    <p className="home-carousel-desc">{item.shortDescription}</p>
                                    <button type="button" className="btn-buy home-carousel-btn" onClick={() => navigate(`/detail/${item.id}`)}>Buy now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                <i className="fa-solid fa-chevron-left home-carousel-arrow"></i>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                <i className="fa-solid fa-chevron-right home-carousel-arrow"></i>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}

export default Carousel
