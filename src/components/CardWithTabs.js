import { Card } from 'antd';
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import KEYS from '../config/constants'
import Image from 'next/image';
import MemberList from './MemberList';
import {PhoneOutlined, MailOutlined, EnvironmentOutlined} from '@ant-design/icons';
import {unregister, register, getUserPrograms} from '../pages/programs/actions'
import {getSportsForFilter} from '../pages/sports/actions'
import { useDispatch, useSelector } from 'react-redux';
const {GOOGLE_KEY} = KEYS

const CardWithTabs = (props) => {
    const defaultProps = {
        center: {
            lat: props.program.latitude,
            lng: props.program.longitude
        },
        zoom: 19
    };
    const dispatch = useDispatch()
    const user = useSelector(s => s.auth.user.data)
  const [activeTabKey, setActiveTabKey] = useState('description');

  const Marker = () => <div style={{
    backgroundColor: '#5753F6',
    width: '30px',
    height: '30px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
    }}>
        <Image
        width={20}
        height={20}
        src={require('../images/dumbell.svg')}/>
    </div>;

    const registerFunc = () => {
        dispatch(register({id: props.program._id, callback}))
    }

    const unregisterFunc = () => {
        dispatch(unregister({id: props.program._id, callback}))
    }

    const callback = () => {
        dispatch(getSportsForFilter())
        dispatch(getUserPrograms())
    }

  const tabList = [
    {
      key: 'description',
      tab: 'Description',
    },
    {
      key: 'place',
      tab: 'Lieu',
    },
    {
      key: 'contacts',
      tab: 'Contacts',
    }
  ];

  const contentList = {
    description: <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <h3>{props.program?.title || ''}</h3> 
                {
                    !props?.program?.registered?.find(it => it?._id == user?._id) ?
                    <a style={{fontSize: '16px'}} href='#' onClick={registerFunc}>S'inscrire</a>
                    :
                    <a style={{fontSize: '16px'}} href='#' onClick={unregisterFunc}>Se désinscrire</a>
                } 
            </div>
            <p style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>                
                <MemberList max={8} size={33} members={[props.program?.coach]}/>
                <div style={{marginRight: '10px'}}/>
                Coaché par {props.program?.coach?.lastName && props.program?.coach?.firstName ? `${props.program?.coach?.lastName} ${props.program?.coach?.firstName}` : ''}
            </p>
           
            
            
            <p>{props.program?.description || ''}</p>
            
            {
                (props.program.registered || []).length ?
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>  
                    <h3 style={{marginRight: '10px', marginTop: '8px'}}>Inscrits :</h3> 
                      
                    <MemberList max={8} size={30} members={props.program.registered || []}/>
                    
                </div>
                : null
            }
           
    </div>,
    place:  <div>   
                <span><EnvironmentOutlined />  {props.program?.address || 'Non renseigné'}</span>
                <div className='centerDiv resized' style={{marginTop: '10px'}}>
                    <GoogleMapReact
                    // style={{width: '310px', height: '200px'}}
                    bootstrapURLKeys={{ key: GOOGLE_KEY }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    >
                    <Marker
                        lat={props.program.latitude}
                        lng={props.program.longitude}
                    />
                    </GoogleMapReact>
                </div>
            </div>    
,
    contacts: <div style={{display: 'flex', flexDirection: 'column'}}> 
        <span><PhoneOutlined />   {props.program?.contact || 'Non renseigné'}</span>
        <span style={{marginTop: '10px'}}><MailOutlined />   {props.program?.mail || 'Non renseigné'}</span>
    </div>
  };

  return (
    <>
      <Card
      cover={
        <div className='centerDiv' style={{
            backgroundColor: "#5753F6",
            height: '200px',
            position: 'relative'
        }}>
            {
              props?.program?.image ?
              <Image
                className='activityImg'
                src={props?.program?.image ? props.program.image : require('../images/logo.jpg')}
                width={150}
                height={150}
                alt='copratik'
              />
              :
              <Image
                  className='logoImg'
                  src={require('../images/logo.jpg')}
                  width={150}
                  height={150}
                  alt='copratik'
              />
            } 
        </div> 
      }
       style={{
        maxWidth: '350px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        marginLeft: 'auto', 
        marginRight: 'auto'
        }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={(key) => {
            setActiveTabKey(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
      <br />
    </>
  );
};
export default CardWithTabs;