import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {registerCompany} from "../login/actions";
import {logout} from "../login/actions";
import {Row, Col} from "antd";
import Link from 'next/link';
import {Button, Input} from "../../components";
import {validateEmail} from "../../utils/helpers";
import {toast} from "react-toastify";
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Code = () => {
  const [code, setCode] = React.useState('');
  const dispatch = useDispatch();
  const isLogin = useSelector(s => s.auth.isLogin)
  const router = useRouter()

  useEffect(() => {
    if(!isLogin){
      router.push('/login')
    }
  }, [isLogin]) 

  const callback = () => {
    dispatch(logout())
  };

  const registerFunc = () => {
    dispatch(registerCompany({code, navigateTo: () => router.push('/dashboard')}))
    router.push('/dashboard')
  };

  const logoutFunc = () => {
    dispatch(logout())
  };

  return (
    <Row className="loginContainer">
      <Col md={12}>
        <div className="right">
        <Image
            src={require('../../images/code.svg').default}
            alt="code"
          />
        </div>
      </Col>
      <Col md={12}>
        <div>
          <div className="left">
          <Image
              src={require('../../images/logo.jpg').default}
              alt="logo"
              width={100}
              height={100}
            />
            <h2 className='mb-0'>Code d'authentification</h2>
            <p className='mb-25'>Ce code doit vous être partagé par votre entreprise</p>
            <Input placeholder="Code d'authentification" value={code} onChange={setCode} type="password"/>
            <Button title="S'authentifier" 
            onClick={registerFunc} 
            />
            <a href='#' onClick={logoutFunc}>Se déconnecter</a>
          </div>
        </div>
      </Col>
    </Row>
  )
};

export default Code;
