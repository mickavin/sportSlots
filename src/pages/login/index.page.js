import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {login} from "./actions";
import {Row, Col} from "antd";
import {Button, Input} from "../../components";
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const loading = useSelector(s => s.auth.user.loading);
  const dispatch = useDispatch();
  const navigate = useRouter().push;

  const loginFunc = React.useCallback(() => {
    dispatch(login({email, password, navigate}))
  }, [email, password]);

  return (
    <Row className="loginContainer">
      <style jsx>{`
          .loginContainer {
              height: 100vh
          }
      `}</style>
      <Col md={12}>
        <div>
          <div className="left">
          <Image
              src={require('../../images/logo.jpg').default}
              alt="logo"
              width={100}
              height={100}
            />
            <h2>Se connecter</h2>
            <Input placeholder="Adresse mail" value={email} onChange={setEmail}/>
            <Input placeholder="Mot de passe" value={password} onChange={setPassword} type="password"/>
            <Button title="Se connecter" block onClick={loginFunc} 
            //loading={loading}
            />
            <p>Pas de compte ? <Link href="/signup">S'enregistrer</Link></p>
          </div>
        </div>
      </Col>
      <Col md={12}>
        <div className="right">
        <Image
            src={require('../../images/login.svg').default}
            alt="login"
          />
        </div>
      </Col>
    </Row>
  )
};

export default Login;
