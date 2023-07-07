import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {register} from "../login/actions";
import {Row, Col} from "antd";
import Link from 'next/link';
import {Button, Input, Select} from "../../components";
import { useRouter } from 'next/router';
import {validateEmail} from "../../utils/helpers";
import {toast} from "react-toastify";
import Image from 'next/image';
import { CIVILITIES } from '../../constants/options';

const SignUp = () => {
  const [civility, setCivility] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const loading = useSelector(s => s.auth.user.loading);
  const dispatch = useDispatch();
  const navigate = useRouter().push;

  const registerFunc = React.useCallback(() => {
    if (!validateEmail(email)) return toast.warn('L\'adresse mail n\'est pas valide');
      dispatch(register({firstName, lastName, email, password, civility, navigate}))
  }, [firstName, lastName, email, password]);

  return (
    <Row className="loginContainer">
      <Col md={12}>
        <div>
          <div className="left">
          <Image
              src={require('../../images/logo.jpg').default}
              alt="logo"
              width={100}
              height={100}
            />
            <h2>S'enregistrer</h2>
            <Row>     
              <Col md={8}>
                <Select
                  className="text-right"
                  showArrow
                  placeholder='Civilité'
                  allowClear
                  onChange={setCivility}
                  value={civility}
                  options={[
                    ...CIVILITIES.map(civility => {
                      return {
                        value: civility.id,
                        label: civility.title
                      }
                  })]}
                />   
              </Col>     
              <Col md={16} style={{paddingLeft: '10px'}}>     
                <Input placeholder="Nom" value={lastName} onChange={setLastName}/>
              </Col>     
            </Row>     
            <Input placeholder="Prénom" value={firstName} onChange={setFirstName}/>
            <Input placeholder="Adresse mail" value={email} onChange={setEmail}/>
            <Input placeholder="Mot de passe" value={password} onChange={setPassword} type="password"/>
            <Button title="S'enregistrer" onClick={registerFunc}
            //disabled={loading}
            />
            <p>Déjà inscrit ? <Link href="/login">Se connecter</Link></p>
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

export default SignUp;
