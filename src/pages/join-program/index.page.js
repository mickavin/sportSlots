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
import {getSportsForFilter} from '../sports/actions'
import { 
    EditOutlined, 
    EllipsisOutlined, 
    SettingOutlined, 
    EyeOutlined, 
    CheckCircleOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined
 } from '@ant-design/icons';
import { useEffect } from 'react';
import CardWithTabs from '../../components/CardWithTabs'
import ReactSlidy from 'react-slidy';
import 'react-slidy/lib/styles.css'

const { Meta } = Card;

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
    const [isNext, setIsNext] = useState(true)
    const [sport, setSport] = useState(null);
    const [program, setProgram] = useState(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [prevSlide, setPrevSlide] = useState(0);

    const sports = useSelector(s => s?.sport?.sports?.data || []);

    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getSportsForFilter())
    }, [])

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

    const getPrograms = () => {
        return (sports.find(s => s?._id === sport)?.programs || [])
    }

    const goToNextPage = () => {
        setPrevSlide(currentSlide)
        setCurrentSlide(currentSlide + 1)
        setIsNext(true)
    }

    const goToPrevPage = () => {
        const current = currentSlide
        if(current === 2){
            setSport(null)
        }
        if(current === 1){
            setProgram(null)
        }
        setPrevSlide(current)
        setCurrentSlide(current - 1)
        setIsNext(false)      
    }

    const Sports = (
    <Row className={'m-20'}>
        {
            sports.map(s => { 
                const icon = icons?.find(icon => icon?.id === s?.localIcon) || s?.logo
                const image = s?.image
                const color = colors.find(color => icon.color == color.color)?.normal || s?.color || '#373b43'
                return (<Col className='sld' lg={8} md={12} sm={24} style={{marginBottom: '15px'}}> 
                    <a href='#' onClick={() => {
                            setSport(s._id)
                            goToNextPage()
                        }}>

                        <Card
                            style={{
                            maxWidth: '300px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            marginLeft: 'auto', 
                            marginRight: 'auto'
                            }}
                            cover={
                                <> 
                                {
                                    typeof icon === 'string' && icon ?
                                    <div className='centerDiv' style={{
                                        backgroundColor: color,
                                        height: '200px',
                                        position: 'relative'
                                    }}> 
                                    {
                                        sport === s._id ?
                                            <div className='transparent-blue centerDiv'> 
                                                <CheckCircleOutlined 
                                                style={{ fontSize: '100px'}}
                                                fill="white"/>
                                            </div> 
                                        : null
                                    }
                                        <Image
                                            className='sportImg'
                                            alt={s.title}
                                            src={icon}
                                            width={80}
                                            height={80}
                                        />
                                    </div> 
                                    :  typeof image === 'string' && image ?
                                    <div className='centerDiv' style={{
                                        backgroundColor: color,
                                        height: '200px',
                                        position: 'relative'
                                    }}> 
                                    {
                                        sport === s._id ?
                                            <div className='transparent-blue centerDiv'> 
                                                <CheckCircleOutlined 
                                                style={{ fontSize: '100px'}}
                                                fill="white"/>
                                            </div> 
                                        : null
                                    }
                                    <Image
                                        className='activityImg'
                                        alt={s.title}
                                        src={image}
                                        width={150}
                                        height={200}
                                    />
                                </div> 
                                   : <div className='centerDiv' style={{
                                        backgroundColor: color,
                                        height: '200px',
                                        position: 'relative'
                                    }}> 
                                    {
                                        sport === s._id ?
                                            <div className='transparent-blue centerDiv'> 
                                                <CheckCircleOutlined 
                                                style={{ fontSize: '100px'}}
                                                fill="white"/>
                                            </div> 
                                        : null
                                    }
                                    <Image
                                        className='sportImg'
                                        alt={s.title}
                                        src={icon.logo.default}
                                        width={80}
                                        height={80}
                                    />
                                </div> 
                                }
                                
                            </> 
                            }
                           
                        >
                            <Meta
                            title={s.title}
                            />
                        </Card>
                    </a>
                </Col>)})
        }   
    </Row>)

const Sports2 = (
    <Row className={'m-20'}>
        {
            programs.map(p =>  
                <Col className='sld' lg={12} sm={24} style={{marginBottom: '15px', marginLeft: 'auto', marginRight: 'auto'}}> 
                    <a href='#' 
                    onClick={() => {
                        if(!p.disabled){
                            setProgram(p.id)
                            goToNextPage()
                        }
                    }}
                    >

                        <Card
                            style={{
                            maxWidth: '350px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            marginLeft: 'auto', 
                            marginRight: 'auto'
                            }}
                            cover={
                                <div className='centerDiv' style={{
                                    height: '250px',
                                    position: 'relative'
                                }}> 
                                {
                                    p.disabled ?
                                    <div className='transparent-black centerDiv'> 
                                        <h4 
                                        >
                                            Bientôt disponible
                                        </h4> 
                                    </div> 
                                    :
                                    program === p.id ?
                                        <div className='transparent-blue centerDiv'> 
                                            <CheckCircleOutlined 
                                            style={{ fontSize: '150px'}}
                                            fill="white"/>
                                        </div> 
                                    : null
                                }
                                    <Image
                                        className='illusImg'
                                        alt={p.title}
                                        src={p.animation.default}
                                        width={200}
                                        height={200}
                                    />
                                </div> 
                            }
                        >
                            <Meta
                            title={p.title}
                            />
                        </Card>
                    </a>
                </Col>)
        }   
    </Row>)

const Sports3 = (
    <Row className={'m-20'}>
        {
            getPrograms().map(p =>  
                <Col className='sld' lg={12} sm={24} style={{marginBottom: '15px', marginLeft: 'auto', marginRight: 'auto'}}> 
                    <CardWithTabs program={p}/> 
                </Col>)
        }   
    </Row>)

    const slides = [Sports2, Sports, Sports3]
    return (
    <Layout>
        <h2 className='mb-25 mt-25'>
            Rejoindre un programme
        </h2>            
       
        {
            sports.length === 0 ?
            <div className="centerDiv" style={{flexDirection: 'column', width: '100%'}}>
                <Image style={{marginTop: '-100px'}} width={500} height={500} alt="no data" src={require('../../animation/noData.svg')}/>
                <h2 style={{fontWeight: 100, marginTop: '0px'}}>
                    Aucun programme trouvé
                </h2>

            </div>
            : 
            <ReactSlidy classNameBase="slide react-Slidy" showArrows={false} slide={currentSlide}>
                {slides.map(slide => slide)}
            </ReactSlidy>
            
           
        }
        {
            currentSlide > 0 ?
            <a className='btn-slide btn-prev' href='#' onClick={() => {
                    goToPrevPage()
                }}>
                <ArrowLeftOutlined/>
            </a>
            : null
        }
        {/* {
            (currentSlide < 1 && sport) || (currentSlide < 2 && sport && program) ?
            <a className='btn-slide btn-next' href='#' onClick={() => {
                    setPrevSlide(currentSlide)
                    setCurrentSlide(currentSlide + 1)
                    setIsNext(true)
                }}>
                <ArrowRightOutlined/>
            </a>
            : null
        } */}
        
        
    </Layout>
  );
};
export default () => <Sports/>;