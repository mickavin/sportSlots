import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  Select,
  Col, 
  Row,
  Tag,
  Typography
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
import icons from '../../icons';
import Image from 'next/image'
import colors from '../../constants/colors';
import {addSport} from '../sports/actions'
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Paragraph } = Typography;

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const icon = icons.find(icon => icon.id === label)
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        color={colors.find(color => color?.color === icon.color)?.light}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        <Image src={icon.logo.default} width={50} height={50}/>
      </Tag>
    );
  };


const AddSport = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');
    const [logo, setIcon] = useState('');
    const [image, setImage] = useState('');
    const [localIcon, setLocalIcon] = useState(null);
    const [banner, setBanner] = useState('');
    const [video, setVideo] = useState('');
    const dispatch = useDispatch()
    const router = useRouter();

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
        const sport = {
            title,
            description,
            color,
            logo,
            image,
            banner,
            video,
            localIcon
        }
        dispatch(addSport({data: sport, navigateTo: () => router.push('/list-sports')}))
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
        <Row>
        <Col span={10}>
            <Form.Item name="icon" label="Sélectionnez une icône" valuePropName="fileList" rules={[
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('icon') != null || logo) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Une icône est obligatoire pour illustrer ce sport'));
                    },
                  }),
            ]}>
                <Select
                    //mode="multiple"
                    showArrow={false}
                    tagRender={tagRender}
                    style={{
                        width: '90px',
                        height: '90px',
                    }}
                    placeholder='Sélectionnez une icône'
                    className='center'
                    allowClear
                    onChange={setLocalIcon}
                    value={localIcon}
                    // options={icons.map(icon => {
                    //     return {value: icon.id}
                    // })}
                >   
                    {
                        icons.map(icon => 
                            <Select.Option value={icon.id} 
                            //label="China"
                            >
                                <div className="demo-option-label-item">
                                    <Image src={icon.logo.default} width={50} height={50}/>
                                </div>
                            </Select.Option>
                        )
                    }
                   
                </Select>
            </Form.Item>
        </Col>

        <Col span={4}>
            <div className='centerDiv'>
                <Paragraph>
                    OU
                </Paragraph>
            </div>
        </Col>

        <Col span={10}>
            <Form.Item label="Ajouter une icône" valuePropName="fileList" style={{
                alignItems: 'flex-end'
            }}>
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
                                    Icône
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
export default () => <AddSport/>;