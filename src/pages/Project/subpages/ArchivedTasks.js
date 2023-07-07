import React from 'react';
import {Icon, MemberList, Modal} from "../../../components";
import Progress from "../../../components/basics/Progress";
import {Row, Tag} from "antd";
import {moment} from "../../../utils/moment";
import {useDispatch, useSelector} from "react-redux";
import {getArchivedTasks} from "../actions";
import {fixImgPath} from "../../../utils/helpers";

const ArchivedTasks = ({visible, close, setTask}) => {
  const taskList = useSelector(s => s.project.taskList);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (visible) dispatch(getArchivedTasks());
  }, [visible]);

  const renderCard = React.useCallback(task => {
    const {members, endDate, comments, attachments, tags, todoGroup} = task;
    const image = attachments?.find(item => item.type.includes('image'))?.src;
    const progress = () => {
      if (todoGroup?.length) {
        let total = 0;
        let checked = 0;
        todoGroup.forEach(t => {total += t.list.length; t.list.forEach(l => {if (l.checked) checked += 1})});
        return (checked / total) * 100;
      }
    };
    return (
      <div className="taskCard cardContainer" key={task._id}>
        <div className="card" onClick={() => setTask(task)}>
          <div className="cardTitle">{task.title}</div>
          {image && <div className="imageContainer"><img src={fixImgPath(image)} alt="" className="cardImage"/></div>}
          {!!progress() && <div className="progressContainer"><Progress percent={progress()} color="#48B990"/></div>}
          {!!tags?.length && <Row gutter={10} className="tags">
            {tags.map(tag => <Tag key={tag._id} color={tag.color}>{tag.name}</Tag>)}
          </Row>}
          {members?.length || endDate || comments?.length || attachments?.length ?
            <Row justify="space-between" align="middle" className="cardFooter">
              {!!members?.length ? <MemberList members={members} size={25}/> : <div/>}
              <Row className="footerRight" align="middle">
                {endDate && <div><Icon name="time" size={15}/> {moment(endDate).format('DD MMM')}</div>}
                {comments?.length && <div><Icon name="comments"/> {comments.length}</div>}
                {attachments?.length && <div><Icon name="attachment"/> {attachments.length}</div>}
              </Row>
            </Row> : null
          }
        </div>
      </div>
    );
  }, []);

  return (
    <Modal title="Archived Tasks" className="archivedTasksModal" visible={visible} onCancel={close} style={{top: 50}} footer={null} zIndex={999}>
      <div className="archivedTasks">
        {visible && taskList.filter(t => t.archived).length ?  taskList.filter(t => t.archived).map(renderCard):
          <div className="empty">
            <img src={require('../../../images/empty.svg').default} alt=""/> <div>No Data</div>
          </div>
        }
      </div>
    </Modal>
  );
};

export default ArchivedTasks;
