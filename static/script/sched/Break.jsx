import React from 'react'
import { Draggable } from 'react-beautiful-dnd';
import AccessTime from './AccessTime'

const Break = (props) =>
{
	const { lecture, index } = props;
	return (
		<Draggable draggableId={lecture.id} index={index}>
			{(provided, snapshot) => (
				<div 
					ref={provided.innerRef} 
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					className="entry"
				>
					Break	<AccessTime/>	{lecture.duration} 
				</div>
			)}
		</Draggable>
	)
}

export default Break;
