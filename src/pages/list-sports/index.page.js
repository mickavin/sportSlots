import { Radio, Space, Table, Tag, Popconfirm, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import Layout from '../dashboard/Layout';
import Image from 'next/image';
import icons from '../../icons';
import { fixImgPath } from '../../utils/helpers'; 
import {useDispatch, useSelector} from "react-redux";
import { getSports, deleteSport } from '../sports/actions';
import Link from 'next/link';
import Button from '../../components/basics/Button';

const imageRender = (image) => (
    <div style={{
        maxWidth: '40px',
        maxHeight: '40px'
    }}>
        {
            image ?
                <Image src={fixImgPath(image)} 
                width={40}
                height={40}
                alt="image"
                style={{
                    maxWidth: '40px',
                    maxHeight: '40px'
                }}/>
            : null
        }
    
    </div>
)

const iconRender = (icon) => (
    <div style={{
        maxWidth: '40px',
        maxHeight: '40px'
    }}>
        {
            icon ?
                <Image 
                width={40}
                height={40}
                src={icons.find(i => i?.id === icon)?.logo?.default}
                alt="logo"
                />
            : null
        }
    
    </div>
)



const ListSports = () => {
  const dispatch = useDispatch()
  const sports = useSelector(s => s.sport.sports.data)
  const [pageParams, setPageParams] = useState({
    position: ['bottomRight'],
      current: 1,
      pageSize: 10,
  });

  useEffect(() => {
    dispatch(getSports())
  }, [])

  const confirm = (id) => {
    dispatch(deleteSport(id))
  };

  const handleTableChange = (
    pagination
  ) => {
    setPageParams(pagination);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const columns = [
    {
      title: 'Intitulé du sport',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <div>{text.slice(0,25)}...</div>,
    },
    {
      title: 'Icône',
      key: 'logo',
      dataIndex: 'logo',
      render: imageRender,
    },
    {
      title: 'Icône (local)',
      key: 'localIcon',
      dataIndex: 'localIcon',
      render: iconRender,
    },
    {
      title: 'Image d\'illustration',
      key: 'image',
      dataIndex: 'image',
      render: imageRender,
    },
    {
      title: 'Bannière',
      key: 'banner',
      dataIndex: 'banner',
      render: imageRender,
    },
    {
      title: 'Actions',
      key: 'action',
      dataIndex: '_id',
      render: (id, record) => (
        <Space size="middle">
          <Link 
           href={{
            pathname: '/sport/[sid]',
            query: { sid: id },
          }}
          >Modifier</Link>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce sport ?"
              onConfirm={() => confirm(id)}
              onCancel={cancel}
              okText="Oui"
              cancelText="Non"
            >
              <a className='text-danger'>
                Supprimer
              </a>
            </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Row justify='space-between' align=''>
        <Col>
          
          <h2 className='mb-25 mt-25'>
                Liste des sports
          </h2>   
        </Col> 
        <Col>  

          <Link href="/add-sport">  
            <Button className='mb-25 mt-50'>Ajouter un sport</Button>
          </Link>  

        </Col>   
      </Row>
     
      <Table
        columns={columns}
        pagination={pageParams}
        dataSource={sports}
        onChange={handleTableChange}
      />
    </Layout>
  );
};
export default ListSports;