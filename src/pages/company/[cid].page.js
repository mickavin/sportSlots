import { PlusOutlined, CloseOutlined, CopyOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  Select,
  Col, 
  Row,
  Tag,
  Typography,
} from 'antd';
import React, { useState, useEffect } from 'react';
import Layout from '../dashboard/Layout'
import { SketchPicker } from 'react-color'
import Button from '../../components/basics/Button';
import {uploadImage} from "../login/actions";
import {useDispatch, useSelector} from "react-redux";
import { UploadWrapper } from '../../components';
import cx from 'classnames';
import {fixImgPath} from "../../utils/helpers";
import {axios}  from '../../config';
import icons from '../../icons';
import Image from 'next/image'
import colors from '../../constants/colors';
import {editCompany, getCompany} from '../companies/actions'
import { useRouter } from 'next/navigation';
import { Avatar, Card } from 'antd';
import { toast } from 'react-toastify';
import { useRouter as useRouteForQueries } from 'next/router';

const { TextArea } = Input;
const { Meta } = Card;

const EditCompany = () => {
    const formRef = React.useRef(null)

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setIcon] = useState('');
    const [image, setImage] = useState('');
    const [banner, setBanner] = useState('');
    const [code, setCode] = useState('');
    const [video, setVideo] = useState('');
    const [isAdded, setIsAdded] = useState(false);
    const routeForQueries = useRouteForQueries()
    const router = useRouter();

    const {cid} = routeForQueries.query

    const company = useSelector(s => s.company?.companyDetail?.data)

    const dispatch = useDispatch()

    useEffect(() => {
        if(cid){
            dispatch(getCompany(cid))
        }
    }, [cid])
    
    useEffect(() => {
        if(company){
            setTitle(company.title)
            setDescription(company.description)
            setPhone(company.phone)
            setMail(company.mail)
            setAddress(company.address)
            setIcon(company.logo)
            setImage(company.image)
            setBanner(company.banner)
            setVideo(company.video)
            formRef?.current?.setFieldsValue({
                title: company.title,
                description: company.description,
                address: company.address,
                phone: company.phone,
                mail: company.mail
            })
        }
    }, [company])

    const onChange = (setter, value) => {
        setter(value)
    }
    const uploadLogo = React.useCallback((setter, val) => {
        const url = URL.createObjectURL(val);
        const formData = new FormData();
        formData.append('image', val);
        dispatch(uploadImage({formData, setter}));
      }, []);

      const onFinish = async () => {
        const company = {
            title,
            description,
            address,
            phone,
            mail,
            logo,
            image,
            banner,
            video,
        }
        dispatch(editCompany({data: company, navigateTo: () => router.push('/list-companies')}))
      };
      const validateMessages = {
        required: 'Ce champ est requis.',
      };

    const callback = (code) => {
        setIsAdded(true)
        setCode(code)
    }


    return (
    <Layout>
        <h2 className='mb-25 mt-25'>
            Modifier une entreprise
        </h2>
        
      <Form
        ref={formRef}
        layout="vertical"
        onFinish={onFinish}
        validateMessages={validateMessages}
        >
         <Form.Item name='title' label={'Nom de l\'entreprise'} rules={[{ required: true }]}>
          <Input 
            value={title}
            onChange={(event) => onChange(setTitle, event.target.value)}
            placeholder={'Nom de l\'entreprise'}/>
        </Form.Item>
        <Form.Item name='description' label="Description" rules={[{ required: true }]}>
          <TextArea 
            value={description}
            onChange={(event) => onChange(setDescription, event.target.value)}
            rows={4} 
            placeholder="Description"/>
        </Form.Item>
        <Form.Item name='address' label={'Adresse de l\'entreprise'}>
          <Input 
            value={address}
            onChange={(event) => onChange(setAddress, event.target.value)}
            placeholder={'Adresse de l\'entreprise'}/>
        </Form.Item>
        <Form.Item name='phone' label={'Numéro de téléphone de l\'entreprise'}>
          <Input 
            value={phone}
            onChange={(event) => onChange(setPhone, event.target.value)}
            placeholder={'Numéro de téléphone de l\'entreprise'}/>
        </Form.Item>
        <Form.Item name='mail' label={'Adresse mail de l\'entreprise'}>
          <Input 
            value={mail}
            onChange={(event) => onChange(setMail, event.target.value)}
            placeholder={'Adresse mail de l\'entreprise'}/>
        </Form.Item>        
        <Row className='m-20'>
            <Col span={12}>
                <Form.Item label="Ajouter un logo" valuePropName="fileList">
                    <UploadWrapper onlyImg onChange={(val) => uploadLogo(setIcon, val)}>
                        <div
                         style={{
                            width: "120px",
                            height: "120px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: "center"
                        }}
                         className={cx('ant-upload', {noBg: !!logo})}>
                            {logo ? 
                            <img src={logo} alt=""  style={{
                                maxHeight: '100%',
                                maxWidth: '100%'
                            }}/> : 
                            <div>
                                <div 
                                    style={{
                                        textAlign: 'center'
                                    }}>
                                    <PlusOutlined />
                                </div>
                                <div
                                    style={{
                                    marginTop: 8,
                                    textAlign: 'center'
                                    }}
                                >
                                    Logo
                                </div>
                            </div>
                            }
                        </div>
                    </UploadWrapper>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Vidéo" valuePropName="fileList">
                    <UploadWrapper onlyVideo onChange={(val) => uploadLogo(setVideo, val)}>
                        <div
                         style={{
                            width: "120px",
                            height: "120px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: "center"
                        }}
                         className={cx('ant-upload', {noBg: !!video})}>
                            {video ? 
                            <video src={video} alt="" height={120}/> : 
                            <div>
                                <div 
                                    style={{
                                        textAlign: 'center'
                                    }}>
                                    <PlusOutlined />
                                </div>
                                <div
                                    style={{
                                    marginTop: 8,
                                    textAlign: 'center'
                                    }}
                                >
                                    Vidéo
                                </div>
                            </div>
                            }
                        </div>
                    </UploadWrapper>
                </Form.Item>
            </Col>
        </Row>
        <Row className='m-20'>
            <Col span={12}>
                <Form.Item label="Image d'illustration" valuePropName="fileList">
                    <UploadWrapper onlyImg onChange={(val) => uploadLogo(setImage, val)}>
                        <div
                         style={{
                            width: "120px",
                            height: "120px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: "center"
                        }}
                         className={cx('ant-upload', {noBg: !!image})}>
                            {image ? 
                            <img src={image} alt=""  style={{
                                maxHeight: '100%',
                                maxWidth: '100%'
                            }}/> : 
                            <div>
                                <div 
                                    style={{
                                        textAlign: 'center'
                                    }}>
                                    <PlusOutlined />
                                </div>
                                <div
                                    style={{
                                    marginTop: 8,
                                    textAlign: 'center'
                                    }}
                                >
                                    Image
                                </div>
                            </div>
                            }
                        </div>
                    </UploadWrapper>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Bannière" valuePropName="fileList" name="banner">
                    <UploadWrapper onlyImg onChange={(val) => uploadLogo(setBanner, val)}>
                        <div
                         style={{
                            width: "240px",
                            height: "120px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: "center",
                            overflow: 'hidden'
                        }}
                         className={cx('ant-upload', {noBg: !!banner})}>
                            {banner ? 
                            <img src={banner} alt="" style={{
                                maxHeight: '100%',
                                maxWidth: '100%'
                            }}/> : 
                            <div>
                                <div 
                                    style={{
                                        textAlign: 'center'
                                    }}>
                                    <PlusOutlined />
                                </div>
                                <div
                                    style={{
                                    marginTop: 8,
                                    textAlign: 'center'
                                    }}
                                >
                                    Bannière
                                </div>
                            </div>
                            }
                        </div>
                    </UploadWrapper>
                </Form.Item>
            </Col>
        </Row>
        
        <Form.Item>
          <Button
          htmlType="submit"
          >Enregistrer les modifications</Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};
export default () => <EditCompany/>;