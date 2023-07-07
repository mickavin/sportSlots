import { Button, Table, Input, Popconfirm, Row, Col, Space } from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../dashboard/Layout';
import Image from 'next/image';
import icons from '../../icons';
import { fixImgPath } from '../../utils/helpers'; 
import {useDispatch, useSelector} from "react-redux";
import { getPrograms, deleteProgram } from '../programs/actions';
import Link from 'next/link';
import AddButton from '../../components/basics/Button';
import { SearchOutlined } from '@ant-design/icons';

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
                style={{
                    maxWidth: '40px',
                    maxHeight: '40px'
                }}
                alt="image"
                />
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



const ListPrograms = () => {
  const dispatch = useDispatch()
  const user = useSelector(s => s.auth.user.data)
  const companies = useSelector(s => s.company.companies.data)
  const programs = useSelector(s => s.program.programs.data)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [pageParams, setPageParams] = useState({
    position: ['bottomRight'],
      current: 1,
      pageSize: 10,
  });

  useEffect(() => {
    dispatch(getPrograms())
  }, [])

  const confirm = (id) => {
    dispatch(deleteProgram(id))
  };

  const handleTableChange = (
    pagination
  ) => {
    setPageParams(pagination);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, dataIndex2 = null, multipleForName = false) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Rechercher`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Rechercher
          </Button>
          <Button
            onClick={() => {
              if(clearFilters){
                handleReset(clearFilters)
                confirm()
              }
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Réinitialiser
          </Button>
        
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if(multipleForName){
        return (record?.coach?.lastName && record?.coach?.firstName ? `${record?.coach?.lastName} ${record?.coach?.firstName} ${record?.coach?.mail}` : '')?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
      } else if(dataIndex2){
        return record?.[dataIndex]?.[dataIndex2]?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
      } else {
        return record?.[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase())
      }
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Intitulé du programme',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <div>{text}</div>,
      fixed: 'left',
      onFilter: (value, record) => record.title.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title')
    },

    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      render: (text) => <div>{text}</div>,
      onFilter: (value, record) => record.contact.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.contact.localeCompare(b.contact),
      ...getColumnSearchProps('contact')
    },
    {
      title: 'Adresse mail',
      dataIndex: 'mail',
      key: 'mail',
      render: (text) => <div>{text}</div>,
      onFilter: (value, record) => record.mail.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.mail.localeCompare(b.mail),
      ...getColumnSearchProps('mail')
    },
    {
      title: 'Sport',
      key: 'sport',
      dataIndex: 'sport.title',
      render: (title, record) => <div>{record?.sport?.title || ''}</div>,
      onFilter: (value, record) => record?.sport?.title?.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a?.title?.localeCompare(b?.title),
      ...getColumnSearchProps('sport', 'title')
    },
    {
      title: 'Coach',
      key: 'coach',
      dataIndex: 'coach',
      render: (coach) => <div>{ coach?.lastName && coach?.firstName ? `${coach?.lastName} ${coach?.firstName}` : ''}</div>,
      onFilter: (value, record) => (record?.coach?.lastName && record?.coach?.firstName ? `${record?.coach?.lastName} ${record?.coach?.firstName}` : '').indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => (a?.coach?.lastName && a?.coach?.firstName ? `${a?.coach?.lastName} ${a?.coach?.firstName}` : '').localeCompare(b?.coach?.lastName && b?.coach?.firstName ? `${b?.coach?.lastName} ${b?.coach?.firstName}` : ''),
      ...getColumnSearchProps('mail', null, true)
    },
    {
      title: 'Image',
      key: 'image',
      dataIndex: 'image',
      render: imageRender,
    },
    {
      title: 'Actions',
      key: 'action',
      dataIndex: '_id',
      fixed: 'right',
      width: 280,
      render: (id, record) => (
        <Space size="middle">
          <Link 
            href={{
              pathname: '/list-registered/[pid]',
              query: { pid: id },
            }}
          >Voir les participants</Link>
          <Link 
           href={{
            pathname: '/edit-program/[pid]',
            query: { pid: id },
          }}
          >Modifier</Link>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce programme ?"
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
                Liste {user.role === 2 || user.role === 3 ? 'de vos programmes' : 'des programmes'}
          </h2>   
        </Col> 
        <Col>  

          <Link href="/add-program">  
            <AddButton className='mb-25 mt-50'>Ajouter un programme</AddButton>
          </Link>  

        </Col>   
      </Row>
     
      <Table
        columns={columns}
        pagination={pageParams}
        dataSource={programs}
        onChange={handleTableChange}
        scroll={{x: 900}}
      />
    </Layout>
  );
};
export default ListPrograms;