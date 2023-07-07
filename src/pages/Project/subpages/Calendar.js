import React from 'react';
import {ProjectHead} from "../../../components";
import Calendar from "../../../components/Calendar";
import {useDispatch, useSelector} from "react-redux";
import {updateProjectCalendar} from "../actions";

const ProjectCalendar = () => {
  const project = useSelector(s => s.project.project.data);
  const dispatch = useDispatch();

  const updateCalendar = data => {
    dispatch(updateProjectCalendar({_id: project._id, data}));
  };

  return (
    <div>
      <ProjectHead/>
      <Calendar data={project.calendar || []} updateCalendar={updateCalendar} />
    </div>
  );
};

export default ProjectCalendar;
