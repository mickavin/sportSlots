import React from 'react';
import {Col, Row} from "antd";
import {Card, Icon, Input, Modal, ProjectCard, Select, Upload} from "../../components";
import { useRouter } from 'next/router';
import {useDispatch, useSelector} from "react-redux";
import {createProject, getProjects} from "../dashboard/actions";

const Projects = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [logo, setLogo] = React.useState('');
  const [members, setMembers] = React.useState([]);
  const [filterType, setFilterType] = React.useState(1);
  const projects = useSelector(s => s.dashboard.projects);
  const user = useSelector(s => s.auth.user.data);
  const navigate = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getProjects());
  }, []);

  const createProjectFunc = React.useCallback(() => {
    if (!projects.creating && name) dispatch(createProject({logo, name, members, navigate}));
  }, [logo, name, members, projects]);

  const optsList = React.useMemo(() => [{value: 1, label: 'Active Projects'}, {value: 2, label: 'Archived Projects'}], []);

  return (
    <div className="projects">
      <div className="heading">
        <h1>TaskPro</h1>
        <h4>Projects</h4>
      </div>
      <Select value={filterType} onChange={setFilterType} options={optsList} className="filterSelect"/>
      <Row gutter={20}>
        <Col xs={24} md={12} lg={8}>
          <div className="createBlock" onClick={() => setModalVisible(true)}>
            <Icon name="plus-circle" size={40} />
            <h3>New Project</h3>
          </div>
        </Col>
        {projects.loading ? [1,2,3].map(x => <Col xs={24} md={12} lg={8} key={x}><Card loading minHeight={200}/></Col>):
          projects.data.filter(p => filterType === 2 ? p.archived : !p.archived).map(item =>
          <Col xs={24} md={12} lg={8} key={item._id}><ProjectCard data={item}/></Col>)}
      </Row>
      <Modal title="New Project" visible={modalVisible} onOk={createProjectFunc} okText="Create" onCancel={() => setModalVisible(false)}>
        <div className="align-center">
          <Upload
            listType=""
            preview={logo && URL.createObjectURL(logo)}
            onChange={e => setLogo(e.file)}
            accept="image/png, image/gif, image/jpeg"
          />
        </div>
        <div className="space"/>
        <Input value={name} onChange={setName} placeholder="Project Name" />
        <Select
          value={members}
          placeholder={"Members"}
          onChange={setMembers}
          mode="multiple"
          options={user.contacts.map(m => ({value: m._id, label: m.firstName + ' ' + m.lastName}))}
        />
      </Modal>
    </div>
  )
};

export default Projects;
