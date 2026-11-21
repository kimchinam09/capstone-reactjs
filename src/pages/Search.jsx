import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import _ from 'lodash'
import ProductCard from '../components/ProductCard'
import { ACCESS_TOKEN, getStore } from '../constants/appConstants'
import { history } from '../middlewares/history'
import {
    getAllCategoryThunk,
    getPagingThunk,
    getProductByCategoryThunk,
    getProductFavoriteThunk,
    searchProductThunk,
    toggleFavoriteThunk
} from '../redux/reducers/productReducer'

const PAGE_SIZE = 6

// Tạo danh sách số trang, rút gọn bằng '...' khi nhiều trang
const buildPages = (current, total) => {
    const pages = []
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - current) <= 1) {
            pages.push(i)
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...')
        }
    }
    return pages
}

const Search = () => {
    const { arrSearch, arrCategory, arrFavorite, paging, isSearching } = useSelector(state => state.productReducer)
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const k = searchParams.get('k') || ''
    const category = searchParams.get('category') || ''
    const page = Number(searchParams.get('page')) || 1
    const [keyword, setKeyword] = useState(k)
    const [sort, setSort] = useState('none')

    useEffect(() => {
        dispatch(getAllCategoryThunk())
        if (getStore(ACCESS_TOKEN)) {
            dispatch(getProductFavoriteThunk())
        }
    }, [dispatch])

    useEffect(() => {
        if (category) {
            dispatch(getProductByCategoryThunk(category))
        } else if (k) {
            dispatch(searchProductThunk(k))
        } else {
            dispatch(getPagingThunk(page, PAGE_SIZE))
        }
    }, [k, category, page, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        setSearchParams(keyword.trim() ? { k: keyword.trim() } : {})
    }

    const handleCategory = (e) => {
        setSearchParams(e.target.value ? { category: e.target.value } : {})
    }

    const handlePage = (p) => {
        setSearchParams(p > 1 ? { page: p } : {})
    }

    const handleToggleFavorite = (id) => {
        if (!getStore(ACCESS_TOKEN)) {
            history.push('/login')
            return
        }
        const isFav = arrFavorite.some(p => p.id === id)
        dispatch(toggleFavoriteThunk(id, isFav))
    }

    const isPaging = !k && !category
    const baseList = isPaging ? paging.items : arrSearch
    const list = sort === 'none' ? baseList : _.orderBy(baseList, ['price'], [sort])
    const totalPage = Math.ceil(paging.totalRow / PAGE_SIZE)

    return (
        <div className="section-light">
        <div className="container py-4">
            <form onSubmit={handleSubmit} className="mb-4">
                <label htmlFor="keyword" className="search-label mb-2">Search</label>
                <div className="d-flex align-items-center gap-3 search-box">
                    <input
                        id="keyword"
                        type="text"
                        className="input-grey"
                        placeholder="product name ..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button type="submit" className="btn-purple">SEARCH</button>
                </div>
            </form>
            <div className="title-gradient title-full mb-4">Search result</div>
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <label htmlFor="price" className="search-label mb-1">Price</label>
                    <select id="price" className="input-grey" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="none">none</option>
                        <option value="desc">decrease</option>
                        <option value="asc">ascending</option>
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="category" className="search-label mb-1">Category</label>
                    <select id="category" className="input-grey" value={category} onChange={handleCategory}>
                        <option value="">all</option>
                        {arrCategory.map((item) => (
                            <option key={item.id} value={item.id}>{item.category}</option>
                        ))}
                    </select>
                </div>
            </div>
            {!isSearching && list.length === 0 && (
                <p className="text-center text-muted">Không tìm thấy sản phẩm phù hợp</p>
            )}
            <div className="row g-4">
                {list.map((product) => (
                    <div key={product.id} className="col-12 col-md-6 col-lg-4">
                        <ProductCard
                            product={product}
                            isFavorite={arrFavorite.some(p => p.id === product.id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    </div>
                ))}
            </div>
            {isPaging && totalPage > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center search-pagination">
                        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                            <button type="button" className="page-link" onClick={() => handlePage(page - 1)}>Prev</button>
                        </li>
                        {buildPages(page, totalPage).map((p, index) => (
                            <li key={`${p}-${index}`} className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
                                <button type="button" className="page-link" onClick={() => handlePage(p)}>{p}</button>
                            </li>
                        ))}
                        <li className={`page-item ${page >= totalPage ? 'disabled' : ''}`}>
                            <button type="button" className="page-link" onClick={() => handlePage(page + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
        </div>
    )
}

export default Search
