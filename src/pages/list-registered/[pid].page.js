import { Button, Table, Input, Row, Col, Space } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../dashboard/Layout';
import {useDispatch, useSelector} from "react-redux";
import { SearchOutlined } from '@ant-design/icons';
import { getProgram } from '../programs/actions';
import { useRouter as useRouteForQueries } from 'next/router';

const ListRegistered = () => {
  const routeForQueries = useRouteForQueries()
  const {pid} = routeForQueries.query

  const dispatch = useDispatch()
  const users = useSelector(s => s.program?.programDetail?.data?.registered || [])
  const programTitle = useSelector(s => s.program?.programDetail?.data?.title || '')
  const [pageParams, setPageParams] = useState({
    position: ['bottomRight'],
      current: 1,
      pageSize: 15,
  });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  useEffect(() => {
    dispatch(getProgram(pid))
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

  const handleTableChange = (
    pagination
  ) => {
    setPageParams(pagination);
  };

  const columns = [
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
    }
   
  ];

  return (
    <Layout>
      <Row justify='space-between' align=''>
        <Col>
          
          <h2 className='mb-25 mt-25'>
                Liste des participants {programTitle ? `de ${programTitle}` : ''}
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
export default ListRegistered;