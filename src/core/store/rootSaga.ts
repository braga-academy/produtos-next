import { all } from 'redux-saga/effects'
import { productsSaga } from '@/features/products/store/productsSaga'

export default function* rootSaga () {
    yield all([
        productsSaga(),
    ])
}
