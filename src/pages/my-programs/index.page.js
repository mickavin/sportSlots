import {
  Col, 
  Row,
  Card,
} from 'antd';
import React, { useState } from 'react';
import Layout from '../dashboard/Layout'
import {useDispatch, useSelector} from "react-redux";
import {getUserPrograms} from '../programs/actions'
import { useEffect } from 'react';
import CardWithTabs from '../../components/CardWithTabs'
import Image from 'next/image'

const Sports = () => {
    const [sport, setSport] = useState(null);


    const programs = useSelector(s => s?.program?.programs?.data || []);

    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getUserPrograms())
    }, [])

    return (
    <Layout>
        <h2 className='mb-25 mt-25'>
            Mes programmes
        </h2>            
        <Row className={'m-20'}>
        {
            programs.map(p =>  
                <Col className='sld' lg={12} sm={24} style={{marginBottom: '15px'}}> 
                    <CardWithTabs program={p}/> 
                </Col>)
        }   
        {
            programs.length === 0 ?
            <div className="centerDiv" style={{flexDirection: 'column', width: '100%'}}>
                <Image style={{marginTop: '-100px'}} width={500} height={500} alt="no data" src={require('../../animation/noData.svg')}/>
                <h2 style={{fontWeight: 100, marginTop: '0px'}}>
                    Aucun programme trouvé
                </h2>

            </div>
            : null
        }
    </Row>
        
        
    </Layout>
  );
};
export default () => <Sports/>;