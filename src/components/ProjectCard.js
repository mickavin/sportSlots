import React from 'react';
import {Avatar, Card, Icon, PopConfirm, Popover} from "./index";
import {moment} from "../utils/moment";
import {Row} from "antd";
import Link from 'next/link';
import {useDispatch} from "react-redux";
import {archiveProject, deleteProject, unarchiveProject} from "../pages/dashboard/actions";
import {getProjectLogo} from "../utils/helpers";

const ProjectCard = ({data}) => {
  const {name, image, members, createdAt, _id} = data;
  const dispatch = useDispatch();

  const unarchiveLabel = React.useMemo(() => <PopConfirm
    title="Are you sure to unarchive this project?"
    onConfirm={() => dispatch(unarchiveProject(_id))}
    content={<div>Unarchive</div>}
  />, []);
  const archiveLabel = React.useMemo(() => <PopConfirm
    title="Are you sure to archive this project?"
    onConfirm={() => dispatch(archiveProject(_id))}
    content={<div>Archive</div>}
  />, []);
  const deleteLabel = React.useMemo(() => <PopConfirm
    title="Are you sure to delete this project?"
    onConfirm={() => dispatch(deleteProject(_id))}
    content={<div>Delete</div>}
  />, [_id]);

  return (
    <Card className="projectCard">
      <div className="top">
        <div className="date">{moment(createdAt).format('DD MMM YYYY')}</div>
        <div className="menuLink">
          <Popover
            button={<div className="menu-icon"><div><Icon name="dots-horizontal" /></div></div>}
            menu={[data.archived ? {value: 1, label: unarchiveLabel} : {value: 1, label: archiveLabel}, {value: 2, label: deleteLabel}]}
          />
        </div>
      </div>
      <Link to={'/project/' + _id + '/board'} className="projectImg"><img src={getProjectLogo(image)} alt="" className="img"/></Link>
      <Link className="nameContainer" to={'/project/' + _id + '/board'}><div className="name">{name}</div></Link>
      <Row className="members">
        {members.slice(0, 3).map(({user}) => <div key={user._id} className="member"><Avatar src={user.avatar} name={user.firstName}/></div>)}
        {(members.length - 3) > 0 ? <div className="memberSize">+{members.length - 3}</div> : null}
      </Row>
    </Card>
  )
};

export default ProjectCard;
