import { takeLatest, put, call } from 'redux-saga/effects'
import { setProducts, setLoading, setError, addProduct, updateProduct, deleteProduct } from './productsSlice'
import api from '@/core/api'
import { Product } from './productsSlice'

function* fetchProducts (): Generator<any, void, any> {
    try {
        yield put(setLoading(true))
        const response = yield call(api.get, '/products')
        yield put(setProducts(response.data))
    } catch (error) {
        yield put(setError(error instanceof Error ? error.message : 'Erro ao carregar produtos'))
    } finally {
        yield put(setLoading(false))
    }
}

function* createProduct (action: { type: string; payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }): Generator<any, void, any> {
    try {
        yield put(setLoading(true))
        const response = yield call(api.post, '/products', action.payload)
        yield put(addProduct(response.data))
    } catch (error) {
        yield put(setError(error instanceof Error ? error.message : 'Erro ao criar produto'))
    } finally {
        yield put(setLoading(false))
    }
}

function* editProduct (action: { type: string; payload: { id: string; data: Partial<Product> } }): Generator<any, void, any> {
    try {
        yield put(setLoading(true))
        const response = yield call(api.put, `/products/${action.payload.id}`, action.payload.data)
        yield put(updateProduct(response.data))
    } catch (error) {
        yield put(setError(error instanceof Error ? error.message : 'Erro ao atualizar produto'))
    } finally {
        yield put(setLoading(false))
    }
}

function* removeProduct (action: { type: string; payload: string }): Generator<any, void, any> {
    try {
        yield put(setLoading(true))
        yield call(api.delete, `/products/${action.payload}`)
        yield put(deleteProduct(action.payload))
    } catch (error) {
        yield put(setError(error instanceof Error ? error.message : 'Erro ao excluir produto'))
    } finally {
        yield put(setLoading(false))
    }
}

export function* productsSaga (): Generator<any, void, any> {
    yield takeLatest('FETCH_PRODUCTS', fetchProducts)
    yield takeLatest('CREATE_PRODUCT', createProduct)
    yield takeLatest('EDIT_PRODUCT', editProduct)
    yield takeLatest('DELETE_PRODUCT', removeProduct)
}
