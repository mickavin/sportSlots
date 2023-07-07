import React from 'react';
import {Row} from "antd";
import {MemberList} from "./index";
import {useSelector} from "react-redux";

const ProjectHead = ({}) => {
  const project = useSelector(s => s.project.project.data);

  if (!project._id) return null;

  return (
    <Row className="projectHeading">
      <div className="heading">
        <h1>{project.name}</h1>
        <h4>Home</h4>
      </div>
      <MemberList members={project.members} max={4} size={33}/>
    </Row>
  )
};

export default ProjectHead;
