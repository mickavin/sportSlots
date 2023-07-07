import { Button, Table, Input,Tag, Popconfirm, Row, Col, Select, Space } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../dashboard/Layout';
import Image from 'next/image';
import icons from '../../icons';
import { fixImgPath } from '../../utils/helpers'; 
import {useDispatch, useSelector} from "react-redux";
import { getUsers, updateRole } from '../login/actions';
import { CIVILITIES, ROLES } from '../../constants/options';
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
                alt="logo"
                src={icons.find(i => i?.id === icon)?.logo?.default}
                />
            : null
        }
    
    </div>
)




const ListUsers = () => {
  const dispatch = useDispatch()
  const users = useSelector(s => s.auth?.users?.data || [])
  const [pageParams, setPageParams] = useState({
    position: ['bottomRight'],
      current: 1,
      pageSize: 15,
  });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  useEffect(() => {
    dispatch(getUsers())
  }, [])

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

  const handleTableChange = (
    pagination
  ) => {
    setPageParams(pagination);
  };

  const selectRender = (id, role) => {
    const onChange = (role) => {
      dispatch(updateRole({id, role}))
    }
   return (
    <Select
      showArrow
      placeholder='Rôle'
      allowClear
      onChange={onChange}
      value={role}
      options={[
        ...ROLES.map(role => {
          return {
            value: role.id,
            label: role.title
          }
      })]}
    /> 
    )
  }

  const cancel = (e) => {
    console.log(e);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <div>{text}</div>,
      onFilter: (value, record) => record._id.indexOf(value) > -1,
      filterSearch: true,
      ...getColumnSearchProps('_id')
    },
    {
      title: 'Civilité',
      dataIndex: 'civility',
      key: 'civility',
      render: (text) => <div>{CIVILITIES.find(civility => civility.id == text)?.title || 'Non rensigné'}</div>,
    },
    {
      title: 'Nom',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text) => <div>{text || 'Non renseigné'}</div>,
      onFilter: (value, record) => record.lastName.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      ...getColumnSearchProps('lastName')
    },
    {
      title: 'Prénom',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => <div>{text || 'Non renseigné'}</div>,
      onFilter: (value, record) => record.firstName.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      ...getColumnSearchProps('firstName')
    },
    {
      title: 'Adresse mail',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <div>{text}</div>,
      onFilter: (value, record) => record.email.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email')
    },
    {
      title: 'Entreprise',
      key: 'company',
      dataIndex: 'company.title',
      render: (title, record) => <div>{record?.company?.title || ''}</div>,
      onFilter: (value, record) => record?.company?.title?.indexOf(value) > -1,
      filterSearch: true,
      sortDirections: ['ascend', 'descend'],
      sorter: true,
      sorter: (a, b) => a?.title?.localeCompare(b?.title),
      ...getColumnSearchProps('company', 'title')
    },
    {
      title: 'Rôles',
      key: 'role',
      dataIndex: 'role',
      render: (role, record) => selectRender(record._id, role),
      onFilter: (value, record) => record.role == value,
      filters: ROLES.map(role => {
        return {
          text: role.title,
          value: role.id
        }
      })
    }
   
  ];

  return (
    <Layout>
      <Row justify='space-between' align=''>
        <Col>
          
          <h2 className='mb-25 mt-25'>
                Liste des utilisateurs
          </h2>   
        </Col>   
      </Row>
     
      <Table
        columns={columns}
        pagination={pageParams}
        dataSource={users}
        onChange={handleTableChange}
        showSorterTooltip
        sticky
      />
    </Layout>
  );
};
export default ListUsers;