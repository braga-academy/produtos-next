import { combineReducers } from '@reduxjs/toolkit'
import productsReducer from '@/features/products/store/productsSlice'

const rootReducer = combineReducers({
    products: productsReducer,
})

export default rootReducer
