import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import rootReducer from './rootReducer';

import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer } from 'redux-persist';
import makeRootReducer from './rootReducer';
import thunk from "redux-thunk";
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { createWrapper } from 'next-redux-wrapper';
import logger from 'redux-logger'
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export const persistConfig = {
  key: 'copratik-root-2',
  storage,
  whitelist: ['auth','project','dashboard','chat','sport','program', 'company'],
  stateReconciler: hardSet
}


const persistingReducer = persistReducer(persistConfig,rootReducer);

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [thunk, sagaMiddleware];

  const store = createStore(
    persistingReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(rootSaga);

  return store;
}


export const wrapper = createWrapper(configureStore)