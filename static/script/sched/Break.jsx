import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import AccessTime from './AccessTime'
import { Entry } from './StyledElelements.jsx';

const Break = (props) =>
{
  const { lecture, index } = props;
  return (
    <Draggable draggableId={lecture.id} index={index}>
    {(provided, snapshot) => (
      <Entry 
      ref={provided.innerRef} 
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      >
      Break <AccessTime/> {lecture.duration} 
      </Entry>
    )}
    </Draggable>
  )
}

export default Break;
