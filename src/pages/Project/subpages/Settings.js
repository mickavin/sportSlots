import React from 'react';
import {Button, Card, Input, PopConfirm, ProjectHead, ProjectMembers, UploadWrapper} from "../../../components";
import {Row, Col, Switch, Divider} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {fixImgPath} from "../../../utils/helpers";
import cx from 'classnames';
import {archiveProject, deleteProject, unarchiveProject} from "../../Dashboard/actions";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {leaveProject, muteProject, updateProject, updateProjectLogo} from "../actions";

const ProjectSettings = () => {
  const [uploadedImage, setUploadedImage] = React.useState('');
  const [name, setName] = React.useState('');
  const userId = useSelector(s => s.auth.user.data._id);
  const project = useSelector(s => s.project.project.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMuted = React.useMemo(() => project.mutedBy?.includes(userId), [project, userId]);
  const isAdmin = React.useMemo(() => project.members.find(m => m.user._id === userId).role === 1, [project, userId]);

  React.useEffect(() => {
    setName(project.name);
    setUploadedImage(project.image);
  }, [project]);

  const uploadLogo = React.useCallback(val => {
    const url = URL.createObjectURL(val);
    setUploadedImage(url);
    dispatch(updateProjectLogo({file: val, _id: project._id}));
  }, [uploadedImage, project._id]);

  const removeProjects = React.useCallback(() => {
    dispatch(deleteProject(project._id));
    navigate('/dashboard/projects');
    toast.success('project deleted');
  }, [project._id]);

  const leaveProjectFunc = React.useCallback(() => {
    dispatch(leaveProject(project._id));
    navigate('/dashboard/projects');
  }, [project._id]);


  return (
    <div>
      <ProjectHead/>
      <Row gutter={20}>
        <Col md={12} xs={24}>
          <Card>
            <UploadWrapper onlyImg onChange={uploadLogo}>
              <div className={cx('imgContainer', {noBg: !!uploadedImage})}>
                {uploadedImage ? <img src={fixImgPath(uploadedImage)} alt=""/> : null}
              </div>
            </UploadWrapper>
            <Input value={name} onChange={setName} placeholder="Project name"/>
            <Row align="middle" style={{marginTop: 10}}>
              <Switch checked={isMuted} onChange={checked => dispatch(muteProject({_id: project._id, mute: checked}))} style={{marginRight: 8}}/>
              Mute notifications
            </Row>
            <br/>
            <Button onClick={() => dispatch(updateProject({_id: project._id, name}))} disabled={!name}>Update</Button>
            <Divider/>
            {project.archived ?
              <PopConfirm
                onConfirm={() => dispatch(unarchiveProject(project._id))}
                content={<Button className="warningBg">Unarchive</Button>}
                title="Are you sure to unarchive this project?"
              />
              :
              <PopConfirm
                onConfirm={() => dispatch(archiveProject(project._id))}
                content={<Button className="warningBg">Archive</Button>}
                title="Are you sure to archive this project?"
              />
            }
            <Row gutter={10}>
              <Col xs={24} sm={isAdmin ? 24 : 12}>
                <PopConfirm
                onConfirm={removeProjects}
                content={<Button type="danger" style={{marginTop: 10}}>Delete</Button>}
                title="Are you sure to delete this project?"
              />
              </Col>
              {!isAdmin ? <Col xs={24} sm={12}>
                <PopConfirm
                  onConfirm={leaveProjectFunc}
                  content={<Button type="danger" style={{marginTop: 10}}>Quit project</Button>}
                  title="Are you sure to quit this project?"
                />
              </Col> : null}
            </Row>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <ProjectMembers height={330}/>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectSettings;
