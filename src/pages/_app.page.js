import React, {useEffect} from "react";
import '../styles/globals.scss'

import { CacheProvider } from '@emotion/react'

import configureStore, { persistConfig, wrapper } from "../utils/store";
import {Provider} from "react-redux";
import history from "../utils/history";
import { persistStore } from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import crossBrowserListener from '../utils/cross-browser-middleware';

import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css';
import {ToastContainer} from 'react-toastify';

import AntProvider from './_provider';

export default function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { emotionCache, clientSideEmotionCache, pageProps } = props;

  const persistedStore = persistStore(store);
  if(typeof window != 'undefined'){
    window.addEventListener('storage', crossBrowserListener(store, persistConfig));
  }

 

  return  <Provider store={store}>
            <CacheProvider value={emotionCache}>
            <PersistGate persistor={persistedStore} loading={null}>
              <ToastContainer/>
              <AntProvider>
                <Component {...pageProps} />
              </AntProvider>
            </PersistGate>
            </CacheProvider>
          </Provider>

}
