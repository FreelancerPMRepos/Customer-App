import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import reducers from '../Reducers'
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducers)

export default () => {
    let store = createStore(persistedReducer, {}, applyMiddleware(thunk));
    let persistor = persistStore(store)
    return { store, persistor}
}