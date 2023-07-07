import { PlusOutlined } from '@ant-design/icons';
import {
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Upload,
  Col, 
  Row
} from 'antd';
import React, { useState } from 'react';
import Layout from '../dashboard/Layout'
import { SketchPicker } from 'react-color'
import Button from '../../components/basics/Button';
import {uploadImage} from "../login/actions";
import {useDispatch, useSelector} from "react-redux";
import { UploadWrapper } from '../../components';
import cx from 'classnames';
import {fixImgPath} from "../../utils/helpers";
import {axios}  from '../../config';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AddSport = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#fff');
    const [icon, setIcon] = useState('');
    const [image, setImage] = useState('');
    const [banner, setBanner] = useState('');
    const [video, setVideo] = useState('');
    const dispatch = useDispatch()

    const onChange = (setter, value) => {
        setter(value)
    }
    const uploadLogo = React.useCallback((setter, val) => {
        const url = URL.createObjectURL(val);
        const formData = new FormData();
        formData.append('image', val);
        dispatch(uploadImage({formData, setter}));
        setter(url)
      }, []);

      const onFinish = async () => {
        const sport = {
            title,
            description,
            color,
            icon,
            image,
            banner,
            video
        }
        const response = await axios.post('/sport', sport)
      };
      const validateMessages = {
        required: 'Ce champ est requis.',
      };
    return (
    <Layout>
        <h2 className='mb-25 mt-25'>
            Ajouter un sport
        </h2>
        
      <Form
        layout="vertical"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
         <Form.Item name='title' label="Intitulé du sport" rules={[{ required: true }]}>
          <Input 
            value={title}
            onChange={(event) => onChange(setTitle, event.target.value)}
            placeholder='Intitulé du sport'/>
        </Form.Item>

        <Form.Item name='description' label="Description" rules={[{ required: true }]}>
          <TextArea 
            value={description}
            onChange={(event) => onChange(setDescription, event.target.value)}
            rows={4} 
            placeholder="Description"/>
        </Form.Item>
      
        <Form.Item label="Couleur associée">
            <SketchPicker
                color={color}
                onChangeComplete={(color) => onChange(setColor, color.hex)}/>
        </Form.Item>
        
        <Row className='m-20'>
            <Col span={12}>
                <Form.Item label="Icône" valuePropName="fileList">
                    
                    <UploadWrapper onlyImg onChange={(val) => uploadLogo(setIcon, val)}>
                        <div
                         style={{
                            width: "120px",
                            height: "120px",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: "center"
                        }}
                         className={cx('ant-upload', {noBg: !!icon})}>
                            {icon ? 
                            <img src={icon} alt=""  style={{
                                height: "100%"
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
                                    Icône
                                </div>
                            </div>
                            }
                        </div>
                    </UploadWrapper>
                </Form.Item>
            </Col>
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
                                height: "100%"
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
            
        </Row>
            
            
        <Row className='m-20'>
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
                                height: "100%"
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
          >Enregistrer le sport</Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};
export default () => <AddSport />;