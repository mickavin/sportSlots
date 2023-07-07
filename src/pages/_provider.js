import React, {useEffect, useState} from "react";
import {ConfigProvider} from "antd";
import {useSelector} from "react-redux";
import cx from 'classnames';
import { useRouter } from "next/router";
import {Row} from "antd";
import {Spinner} from "../components";
import { toast } from "react-toastify";

ConfigProvider.config({theme: {primaryColor: '#5753f6'}});

export default function AntProvider({ children }) {
  const router = useRouter()
  const auth = useSelector(s => s.auth.isLogin)
  const isLogin = (typeof window != 'undefined' && localStorage.getItem('token') && auth ? localStorage.getItem('token') : false) 
  const darkMode = useSelector(s => s.auth.mode === 'dark');
  const user = useSelector((s) => s?.auth?.user?.data) || {};
  const [init, setInit] = useState(false)
  const pages = [
    ['add-company', 'add-sport', 'my-programs', 'companies', 'company', 'join-program', 'list-companies', 'list-sports', 'list-users', 'sport', 'edit-program', 'list-registered', 'settings'],
    ['add-company', 'add-sport', 'companies', 'company', 'list-companies', 'list-sports', 'list-users', 'sport', 'edit-program', 'list-registered', 'settings'],
    ['join-program', 'my-programs', 'settings'],
  ]
  const handleRouteChangeToCodeAuth = (url) => {
    if(url.startsWith('/code') && isLogin){
      setInit(true)
    }
  }

  const handleRouteChangeToDashboard = (url) => {
    if((url.startsWith('/list-programs') || url.startsWith('/join-program')) && isLogin){
      setInit(true)
    }
  }

  const handleRouteChangeToLogin = (url) => {
    if((url.startsWith('/login') || url.startsWith('/signup')) && !isLogin){
      setInit(true)
      toast.warn('Connectez-vous pour avoir accès à cette page.')
    }
  }

  const handleRouteStartChange = (url, { shallow }) => {
   setInit(false)
  }

  useEffect(() => {
    const url = router.pathname
    console.log(user?.role, pages?.[!isNaN(user?.role) ? (user?.role - 1) : 2], pages?.[!isNaN(user?.role) ? (user?.role - 1) : 3]?.findIndex(page => url.includes(page)) > -1, 'gfgfg')
    router.events.on("routeChangeStart", handleRouteStartChange);
    if(user?.role == 3 && !user?.company){
      console.log(1)
      router.events.on("routeChangeComplete", handleRouteChangeToCodeAuth);
      router.push('/code')
      return () => {
        router.events.off("routeChangeComplete", handleRouteChangeToCodeAuth);
        router.events.off("routeChangeStart", handleRouteStartChange);
      }
    } else if((url.startsWith('/signup') || url.startsWith('/login')) && isLogin && user.token){
      console.log(2)
      router.events.on("routeChangeComplete", handleRouteChangeToDashboard);
      if(user.role == 1){
        router.push('/list-programs')
      } else if(user.role === 2) {
        router.push('/list-programs')
      } else {
        router.push('/join-program')
      }
      return () => {
        router.events.off("routeChangeComplete", handleRouteChangeToDashboard);
        router.events.off("routeChangeStart", handleRouteStartChange);
      }
    } else if((!url.startsWith('/signup') && !url.startsWith('/login')) && (!isLogin || !user?.token)){
      console.log(3)
      router.events.on("routeChangeComplete", handleRouteChangeToLogin);
      router.push('/login')
      return () => {
        router.events.off("routeChangeComplete", handleRouteChangeToLogin);
        router.events.off("routeChangeStart", handleRouteStartChange);
      }
    } else if(isLogin && user?.token && pages?.[!isNaN(user?.role) ? (user?.role - 1) : 2]?.findIndex(page => url.includes(page)) === -1){
      console.log(4)
      router.events.on("routeChangeComplete", handleRouteChangeToDashboard);
      if(user.role == 1){
        router.push('/list-programs')
      } else if(user.role === 2) {
        router.push('/list-programs')
      } else {
        router.push('/join-program')
      }
      return () => {
        router.events.off("routeChangeComplete", handleRouteChangeToDashboard);
        router.events.off("routeChangeStart", handleRouteStartChange);
      }
    } else {
      console.log(5)
      setInit(true)
    }
  }, [router.pathname])

  if (!init) return <div id='antProvider' className={cx('app', {dark: darkMode})}>
                      <style jsx>{`
                            #antProvider {
                                min-height: 100vh
                            }
                        `}
                      </style>
                      <Row style={{height:'100vh'}} align="middle" justify="center"><Spinner size="large"/></Row>
                    </div>


  return <div id='antProvider' className={cx('app', {dark: darkMode})}>
            <style jsx>{`
                  #antProvider {
                      min-height: 100vh
                  }
              `}
            </style>
          {children}
        </div>

}
