import React from 'react';
import {Avatar, Button, Card as CardComponent, Icon, Input, UploadWrapper} from "../../components";
import {Form} from 'antd'
import {Row, Col, Card} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {fixImgPath, getProjectLogo} from "../../utils/helpers";
import {updateUser, updateUserAvatar} from "../Login/actions";
import Layout from '../dashboard/Layout';
import {getCompany} from '../companies/actions'
import {ProjectMembers} from '../../components';
import Image from 'next/image'
import { CopyOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Meta } = Card;

const Settings = () => {
  const formRef = React.useRef(null)
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const user = useSelector(s => s.auth.user);
  const invitations = useSelector(s => s.dashboard.invitations);
  const company = useSelector(s => s.company?.companyDetail?.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(user?.data?.company){
      dispatch(getCompany(user.data.company))
    }
  }, []);

  React.useEffect(() => {
    setFirstName(user.data.firstName);
    setLastName(user.data.lastName);
    setUploadedImage(user.data.avatar);
    formRef?.current?.setFieldsValue({
      lastName: user.data.lastName,
      firstName: user.data.firstName,
      mail: user.data.email
  })
  }, [user.data]);

  const uploadLogo = React.useCallback((val) => {
    const preview = URL.createObjectURL(val);
    setUploadedImage(preview);
    const formData = new FormData();
    formData.append('avatar', val);
    dispatch(updateUserAvatar({preview, formData}));
  }, []);

  const updateData = React.useCallback(() => {
    dispatch(updateUser({firstName, lastName}))
  }, [firstName, lastName]);

  return (
    <Layout>
      <div className="heading">
        <h2>Paramètres</h2>
      </div>
      <Row gutter={20} className='auth-code'>
      {
          user?.data?.role === 3 ?
          <Col xs={24} md={8}>
            <div className="mt-25">
              <Card
                  style={{ width: 300 }}
                  cover={<Image
                      width={200}
                      height={200}
                      alt="invitation"
                      src={require('../../images/Invite-amico.svg')}
                  />}
                  
                  actions={[
                      <CopyOutlined onClick={() => {
                          if(typeof window != 'undefined'){
                              navigator.clipboard.writeText(company?.code.toLocaleUpperCase());
                              toast.success('Le code a été copié dans le presse-papier')
                          }
                      }}/>,
                  ]}
              >
                  <Meta
                  {...(company?.logo ? {avatar: <Avatar src={company?.logo} />} : {})}
                  {...(company?.title ? {title: `Le code à partager de votre entreprise est le suivant:`} : {})}                        
                  {...(company?.code ? {description: `${company?.code.toLocaleUpperCase()}`} : {})}                        
                  />
            </Card>
          </div>
        </Col>
          : null
        }
        <Col xs={24} md={16}>
          <div className="mt-25">
            <CardComponent>
            <Form
                layout="vertical"
                ref={formRef}
              >
              <div className="imgContainer">
                <UploadWrapper onChange={uploadLogo} onlyImg>
                  <Avatar src={fixImgPath(uploadedImage)} name={firstName} size={70}/>
                </UploadWrapper>
              </div>
              <Form.Item name='firstName' label={'Prénom'}>
                <Input value={firstName} onChange={setFirstName} placeholder="Prénom"/>
              </Form.Item>
              <Form.Item name='lastName' label={'Nom'}>
                <Input value={lastName} onChange={setLastName} placeholder="Nom"/>
              </Form.Item>
              <Form.Item name='mail' label={'Adresse mail'}>
                <Input value={user.data.email} placeholder="Adresse mail" disabled/>
              </Form.Item>
            </Form>
              <br/><br/>
              <Button onClick={updateData} disabled={!firstName || !lastName}>Enregistrer</Button>
            </CardComponent>
          </div>
        </Col>
        {
          user.data?.role === 3 ?
          <Col xs={24} md={12}>
            <div className="mt-25">
              <ProjectMembers height={330} members={company?.employees || []}/>
            </div>

          </Col>
          : null
        }
        
         

      </Row>
    </Layout>
    );
};

export default Settings;
