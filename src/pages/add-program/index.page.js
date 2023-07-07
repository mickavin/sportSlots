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
  Space
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
import {getSports} from '../sports/actions'
import {axios}  from '../../config';
import icons from '../../icons';
import Image from 'next/image'
import colors from '../../constants/colors';
import {addCompany, getCompanies} from '../companies/actions'
import {getCoachs, addProgram} from '../programs/actions'
import { useRouter } from 'next/navigation';
import { Avatar, Card } from 'antd';
import { toast } from 'react-toastify';
import LocationSearch from '../../components/PlacesComplete';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Script from 'next/script';
import KEYS from '../../config/constants';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import locale from 'antd/lib/date-picker/locale/fr_FR';
import 'moment/locale/fr';
import moment from 'moment';
moment.locale('fr');

const { TextArea } = Input;
const { Meta } = Card;
const { RangePicker } = DatePicker;

const AddCompany = () => {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [mail, setMail] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sport, setSport] = useState(null);
    const [assignableCoach, setAssignableCoach] = useState([]);
    const [assignableCompanies, setAssignableCompanies] = useState([]);

    const sports = useSelector(s => s.sport.sports.data) || []
    const companies = useSelector(s => s.company.companies.data) || []
    const coachs = useSelector(s => s.program.coachs.data) || []
    const user = useSelector(s => s.auth.user.data)

    const dispatch = useDispatch()
    const router = useRouter();

    useEffect(() => {
        dispatch(getSports())
        dispatch(getCompanies())
        dispatch(getCoachs())
    }, [])

    const onChange = (setter, value) => {
        setter(value)
    }
    const uploadLogo = React.useCallback((setter, val) => {
        const url = URL.createObjectURL(val);
        const formData = new FormData();
        formData.append('image', val);
        dispatch(uploadImage({formData, setter}));
      }, []);


      const clearAddress = () => {
        // Clear with this.props.form.setFieldsValue();
      };
    
      
    
      const handleAddressSelect = (address, placeID) => {
        setAddress(address)
        geocodeByAddress(address)
          .then(async (results) => {
            return getLatLng(results[0]);
          })
          .then((latLng) => {
            setLatitude(latLng.lat)
            setLongitude(latLng.lng)
          })
          .catch((error) => {
            console.error("Error", error);
          });
      };

      const onFinish = async () => {
        let coach = null
        let companies = null
        let registered = null
        if(user.role == 3) {
            companies = [user.company]
            registered = [user._id]
        } else if(user.role == 2) {
            coach = user._id
        } else {
            coach = assignableCoach
            companies = assignableCompanies
        }

        const program = {
            title,
            description,
            address,
            contact,
            mail,
            image,
            longitude,
            latitude,
            startDate,
            endDate,
            coach,
            companies,
            registered,
            sport
        }

        dispatch(addProgram({data: program, callback, 
            navigateTo: () => router.push('/list-programs')
        }))
      };
      const validateMessages = {
        required: 'Ce champ est requis.',
      };

    const callback = (code) => {
    }

    const onChangeDate = (value, dateString) => {
        setStartDate(dateString[0])
        setEndDate(dateString[1])
      };


    return (
    <Layout>
        <h2 className='mb-25 mt-25'>
            Ajouter un programme
        </h2>
        
      <Form
        layout="vertical"
        onFinish={onFinish}
        validateMessages={validateMessages}
        >
         <Form.Item name='title' label={'Intitulé du programme'} rules={[{ required: true }]}>
          <Input 
            value={title}
            onChange={(event) => onChange(setTitle, event.target.value)}
            placeholder={'Intitulé du programme'}/>
        </Form.Item>
        <Form.Item name='description' label="Description" rules={[{ required: true }]}>
          <TextArea 
            value={description}
            onChange={(event) => onChange(setDescription, event.target.value)}
            rows={4} 
            placeholder="Description"/>
        </Form.Item>
        <Form.Item name='sport' label={'Sport associé'} rules={[{ required: true }]}>
            <Select
            showArrow
            placeholder='Sport associé'
            allowClear
            onChange={setSport}
            value={sport}
            options={[
            ...sports.map(sport => {
                return {
                value: sport._id,
                label: sport.title
                }
            })]}
            /> 
        </Form.Item>  
       
        <Form.Item name='address' label={'Adresse'} rules={[
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (address && typeof longitude == 'number' && typeof latitude == 'number') {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Ce champ est requis'));
                    },
                    required: true
                  }),
            ]}>
            <LocationSearch
                address={address}
                clearAddress={clearAddress}
                onChange={setAddress}
                onAddressSelect={handleAddressSelect}
            />
        </Form.Item>
        <Form.Item name='contact' label={'Numéro de téléphone à contacter'}>
          <Input 
            value={contact}
            onChange={(event) => onChange(setContact, event.target.value)}
            placeholder={'Numéro de téléphone à contacter'}/>
        </Form.Item>
        <Form.Item name='mail' label={'Adresse mail à contacter'}>
          <Input 
            value={mail}
            onChange={(event) => onChange(setMail, event.target.value)}
            placeholder={'Adresse mail à contacter'}/>
        </Form.Item>  

        <Form.Item name='date' label={'Date'} rules={[{ required: true }]}>
            <RangePicker
            locale={locale}
            showTime={{
                format: 'HH:mm',
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChangeDate}
            />
        </Form.Item>     


        {
            user.role === 1 ?
            <>
                <Form.Item name='companies' label={'Entreprises concernées'} rules={[{ required: true }]}>  
                    <Select
                    mode="multiple"
                    allowClear
                    placeholder="Entreprises concernées"
                    onChange={setAssignableCompanies}
                    options={companies.map(company => {
                        return {
                        value: company._id,
                        label: company.title
                        }
                    })}
                    />   
                </Form.Item> 
                <Form.Item name='coach' label={'Coach associé'} rules={[{ required: true }]}>  
                    <Select
                    allowClear
                    placeholder="Coach associé"
                    onChange={setAssignableCoach}
                    options={coachs.map(coach => {
                        return {
                        value: coach._id,
                        label: `${coach.lastName} ${coach.firstName} (${coach.email})`
                        }
                    })}
                    />   
                </Form.Item>     
            </>
            : null
        }   

     
        <Row className='m-20'>
            <Col span={12}>
                <Form.Item label="Image" valuePropName="fileList">
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
          
        </Row>
        
        <Form.Item>
          <Button
          htmlType="submit"
          >Enregistrer le programme</Button>
        </Form.Item>
      </Form>
      <Script src={`https://maps.googleapis.com/maps/api/js?key=${KEYS.GOOGLE_KEY}&libraries=places&callback=autocomplete`}/>

    </Layout>
  );
};
export default () => <AddCompany/>;