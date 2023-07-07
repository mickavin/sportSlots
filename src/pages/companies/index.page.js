import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Input,
  Select,
  Col, 
  Row,
  Tag,
  Typography,
  Card,
  Avatar
} from 'antd';
import React, { useState, createRef } from 'react';
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
import programs from '../../constants/programs';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { 
    EditOutlined, 
    EllipsisOutlined, 
    SettingOutlined, 
    EyeOutlined, 
    CheckCircleOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined
 } from '@ant-design/icons';

const { Meta } = Card;
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


const Sports = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');
    const [icon, setIcon] = useState('');
    const [image, setImage] = useState('');
    const [localIcon, setLocalIcon] = useState(null);
    const [banner, setBanner] = useState('');
    const [video, setVideo] = useState('');
    const [step, setStep] = useState(1);

    const [sport, setSport] = useState(null);
    const [program, setProgram] = useState(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [prevSlide, setPrevSlide] = useState(0);
    const ref1 = createRef(null)
    const ref2 = createRef(null)

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
            video,
            localIcon
        }
        const response = await axios.post('/sport', sport)
    };
    const validateMessages = {
        required: 'Ce champ est requis.',
    };

    const Sports = (
    <Row className={'m-20'}>
        {
            icons.map(icon =>  
                <Col lg={8} md={12} sm={24} style={{marginBottom: '15px'}}> 
                    <a href='#' onClick={() => setSport(icon.id)}>

                        <Card
                            style={{
                            maxWidth: '300px',
                            borderRadius: '20px',
                            overflow: 'hidden'
                            }}
                            cover={
                                <div className='centerDiv' style={{
                                    backgroundColor: colors.find(color => icon.color == color.color)?.normal,
                                    height: '200px',
                                    position: 'relative'
                                }}> 
                                {
                                    sport === icon.id ?
                                        <div className='transparent-blue centerDiv'> 
                                            <CheckCircleOutlined 
                                            style={{ fontSize: '100px'}}
                                            fill="white"/>
                                        </div> 
                                    : null
                                }
                                    <Image
                                        alt={icon.title}
                                        src={icon.logo.default}
                                        width={80}
                                        height={80}
                                    />
                                </div> 
                            }
                            // actions={[
                            // <EyeOutlined key="setting" />,
                            // <EditOutlined key="edit" />,
                            // <EllipsisOutlined key="ellipsis" />,
                            // ]}
                        >
                            <Meta
                            title={icon.title}
                            //description="This is the description"
                            />
                        </Card>
                    </a>
                </Col>)
        }   
    </Row>)

const Sports2 = (
    <Row className={'m-20'}>
        {
            programs.map(p =>  
                <Col className='centerDiv' lg={12} sm={24} style={{marginBottom: '15px'}}> 
                    <a href='#' 
                    onClick={() => setProgram(p.id)}
                    >

                        <Card
                            style={{
                            width: 350,
                            borderRadius: '20px',
                            overflow: 'hidden'
                            }}
                            cover={
                                <div className='centerDiv' style={{
                                    //backgroundColor: colors.find(color => icon.color == color.color)?.normal,
                                    height: '250px',
                                    position: 'relative'
                                }}> 
                                {
                                    program === p.id ?
                                        <div className='transparent-blue centerDiv'> 
                                            <CheckCircleOutlined 
                                            style={{ fontSize: '150px'}}
                                            fill="white"/>
                                        </div> 
                                    : null
                                }
                                    <Image
                                        alt={p.title}
                                        src={p.animation.default}
                                        width={200}
                                        height={200}
                                    />
                                </div> 
                            }
                            // actions={[
                            // <EyeOutlined key="setting" />,
                            // <EditOutlined key="edit" />,
                            // <EllipsisOutlined key="ellipsis" />,
                            // ]}
                        >
                            <Meta
                            title={p.title}
                            //description="This is the description"
                            />
                        </Card>
                    </a>
                </Col>)
        }   
    </Row>)

    const slides = [Sports2, Sports]

    return (
    <Layout>
        <h2 className='mb-25 mt-25'>
            Ajouter un sport
        </h2>            
        <TransitionGroup>
            
                <CSSTransition key={currentSlide} timeout={3000} classNames={prevSlide < currentSlide ?  "slide" : 'inverse-slide'}>
                <div className="slide">{slides[currentSlide]}</div>
                </CSSTransition>
        
            
        </TransitionGroup>
        <a className='btn-slide btn-prev' href='#' onClick={() => {
                setPrevSlide(currentSlide)
                setCurrentSlide(currentSlide - 1)
            }}>
            <ArrowLeftOutlined/>
        </a>
        <a className='btn-slide btn-next' href='#' onClick={() => {
                setPrevSlide(currentSlide)
                setCurrentSlide(currentSlide + 1)
            }}>
            <ArrowRightOutlined/>
        </a>
        
    </Layout>
  );
};
export default () => <Sports/>;