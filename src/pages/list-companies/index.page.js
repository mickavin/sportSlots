import { Button, Table, Input, Popconfirm, Row, Col, Space } from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../dashboard/Layout';
import Image from 'next/image';
import icons from '../../icons';
import { fixImgPath } from '../../utils/helpers'; 
import {useDispatch, useSelector} from "react-redux";
import { getCompanies, deleteCompany } from '../companies/actions';
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



const ListSports = () => {
  const dispatch = useDispatch()
  const companies = useSelector(s => s.company.companies.data)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [pageParams, setPageParams] = useState({
    position: ['bottomRight'],
      current: 1,
      pageSize: 10,
  });

  useEffect(() => {
    dispatch(getCompanies())
  }, [])

  const confirm = (id) => {
    dispatch(deleteCompany(id))
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

  const getColumnSearchProps = (dataIndex) => ({
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'Nom de l\'entreprise',
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
      title: 'Numéro de téléphone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <div>{text}</div>,
      onFilter: (value, record) => record.phone.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      ...getColumnSearchProps('phone')
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
      title: 'Code d\'authentification',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <div>{text}</div>,
      onFilter: (value, record) => record.code.indexOf(value) > -1,
      filterSearch: true,
      ...getColumnSearchProps('code')
    },
    {
      title: 'Icône',
      key: 'logo',
      dataIndex: 'logo',
      render: imageRender,
    },
    {
      title: 'Actions',
      key: 'action',
      dataIndex: '_id',
      fixed: 'right',
      width: 180,
      render: (id, record) => (
        <Space size="middle">
          <Link 
           href={{
            pathname: '/company/[cid]',
            query: { cid: id },
          }}
          >Modifier</Link>
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette entreprise ?"
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
                Liste des entreprises
          </h2>   
        </Col> 
        <Col>  

          <Link href="/add-company">  
            <AddButton className='mb-25 mt-50'>Ajouter une entreprise</AddButton>
          </Link>  

        </Col>   
      </Row>
     
      <Table
        columns={columns}
        pagination={pageParams}
        dataSource={companies}
        onChange={handleTableChange}
        scroll={{x: 900}}
      />
    </Layout>
  );
};
export default ListSports;