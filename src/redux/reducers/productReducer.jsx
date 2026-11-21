import { createSlice } from '@reduxjs/toolkit'
import { http } from '../../middlewares/interceptors'

const productReducer = createSlice({
    name: 'productReducer',
    initialState: {
        arrProduct: [],
        productDetail: {},
        arrFavorite: [],
        arrSearch: [],
        arrCategory: [],
        paging: { items: [], totalRow: 0 },
        isSearching: false
    },
    reducers: {
        setArrProductRedux: (state, action) => {
            state.arrProduct = action.payload
        },
        setProductDetailRedux: (state, action) => {
            state.productDetail = action.payload
        },
        setArrFavoriteRedux: (state, action) => {
            state.arrFavorite = action.payload
        },
        setArrSearchRedux: (state, action) => {
            state.arrSearch = action.payload
        },
        setArrCategoryRedux: (state, action) => {
            state.arrCategory = action.payload
        },
        setPagingRedux: (state, action) => {
            state.paging = action.payload
        },
        setIsSearchingRedux: (state, action) => {
            state.isSearching = action.payload
        }
    }
})

export const {
    setArrProductRedux,
    setProductDetailRedux,
    setArrFavoriteRedux,
    setArrSearchRedux,
    setArrCategoryRedux,
    setPagingRedux,
    setIsSearchingRedux
} = productReducer.actions
export default productReducer.reducer

export const getAllProductThunk = () => {
    return async (dispatch) => {
        try {
            const res = await http.get('/api/Product')
            dispatch(setArrProductRedux(res.data.content))
        } catch (error) {
            alert(error.response?.data?.message || 'Không tải được danh sách sản phẩm')
        }
    }
}

export const getProductDetailThunk = (id) => {
    return async (dispatch) => {
        try {
            const res = await http.get(`/api/Product/getbyid?id=${id}`)
            dispatch(setProductDetailRedux(res.data.content))
        } catch (error) {
            alert(error.response?.data?.message || 'Không tải được chi tiết sản phẩm')
        }
    }
}

export const getProductFavoriteThunk = () => {
    return async (dispatch) => {
        try {
            const res = await http.get('/api/Users/getproductfavorite')
            dispatch(setArrFavoriteRedux(res.data.content.productsFavorite))
        } catch (error) {
            alert(error.response?.data?.message || 'Không tải được sản phẩm yêu thích')
        }
    }
}

export const toggleFavoriteThunk = (id, isFavorite) => {
    return async (dispatch) => {
        try {
            await http.get(`/api/Users/${isFavorite ? 'unlike' : 'like'}?productId=${id}`)
            dispatch(getProductFavoriteThunk())
        } catch (error) {
            alert(error.response?.data?.message || 'Không thực hiện được thao tác')
        }
    }
}

export const searchProductThunk = (keyword) => {
    return async (dispatch) => {
        dispatch(setIsSearchingRedux(true))
        try {
            const res = await http.get(`/api/Product?keyword=${encodeURIComponent(keyword)}`)
            dispatch(setArrSearchRedux(res.data.content))
        } catch (error) {
            dispatch(setArrSearchRedux([]))
            alert(error.response?.data?.message || 'Không tìm kiếm được sản phẩm')
        } finally {
            dispatch(setIsSearchingRedux(false))
        }
    }
}

export const getAllCategoryThunk = () => {
    return async (dispatch) => {
        try {
            const res = await http.get('/api/Product/getAllCategory')
            dispatch(setArrCategoryRedux(res.data.content))
        } catch (error) {
            alert(error.response?.data?.message || 'Không tải được danh mục')
        }
    }
}

export const getProductByCategoryThunk = (categoryId) => {
    return async (dispatch) => {
        dispatch(setIsSearchingRedux(true))
        try {
            let list = []
            try {
                const res = await http.get(`/api/Product/getProductByCategory?categoryId=${categoryId}`)
                list = res.data.content
            } catch {
                list = []
            }
            if (!list || list.length === 0) {
                // API getProductByCategory đang lỗi 404 nên tự lọc theo categories của sản phẩm
                const [resCategory, resProduct] = await Promise.all([
                    http.get('/api/Product/getAllCategory'),
                    http.get('/api/Product')
                ])
                const parseJson = (str) => { try { return JSON.parse(str) } catch { return [] } }
                // Danh mục con (MEN, WOMEN) gồm các hãng có categoryParent chứa nó
                const matchIds = resCategory.data.content
                    .filter(c => c.id === categoryId || parseJson(c.categoryParent).some(p => p.id === categoryId))
                    .map(c => c.id)
                list = resProduct.data.content.filter(p => parseJson(p.categories).some(c => matchIds.includes(c.id)))
            }
            dispatch(setArrSearchRedux(list))
        } catch (error) {
            dispatch(setArrSearchRedux([]))
            alert(error.response?.data?.message || 'Không tải được sản phẩm theo danh mục')
        } finally {
            dispatch(setIsSearchingRedux(false))
        }
    }
}

export const getPagingThunk = (pageIndex, pageSize = 6) => {
    return async (dispatch) => {
        dispatch(setIsSearchingRedux(true))
        try {
            const res = await http.get(`/api/Product/getpaging?pageIndex=${pageIndex}&pageSize=${pageSize}`)
            dispatch(setPagingRedux({ items: res.data.content.items, totalRow: res.data.content.totalRow }))
        } catch (error) {
            alert(error.response?.data?.message || 'Không tải được danh sách sản phẩm')
        } finally {
            dispatch(setIsSearchingRedux(false))
        }
    }
}
