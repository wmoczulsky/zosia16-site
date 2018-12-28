
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import AccessTime from './AccessTime'
import Break from './Break'

const BreakGenerator = () => {
	return (
		<Draggable draggableId={"break_gen"} index={0}>
			{(provided, snapshot) => (
				<div 
					ref={provided.innerRef} 
					{...provided.dragHandleProps} 
					{...provided.draggableProps} 
					className="entry"
				>
					<div> Drag for 10 minute break </div>
				</div>
			)}
		</Draggable>
	)
}

const Lecture = (props) =>
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
					<div> {lecture.title} </div>
					<div> {lecture.name} </div>
					<div> <AccessTime/> {lecture.duration} </div>
				</div>
			)}
		</Draggable>
	)
}

class LectureList extends React.Component {

	getLecture(lectureId) {
		return this.props.allLectures[lectureId];
	}

	element(lectureId, i) {
		const lecture = this.getLecture(lectureId);
		if (lecture.type === "lecture")
		{
			return (<Lecture lecture={lecture} index={i}/>);
		}
		else if (lecture.type === "break")
		{
			return (<Break lecture={lecture} index={i}/>);
		}
		else
		{
			console.log("Error unhandled type");	
		}
	}

	/* eslint-disable no-unused-expressions */
	render() {
		return (
			<div className="schedule">
				<div><h4>{this.props.title}</h4></div>
				<Droppable droppableId={this.props.id} type="PERSON">	
				{(provided, snapshot) => (
					<div 
						ref={provided.innerRef} 
						{...provided.droppableProps}
						className="expand"
					>
						<BreakGenerator/>
						{this.props.lectureIds.map(
							(lectureId, i) => this.element(lectureId, i)
						)}
						{provided.placeholder}
					</div>
				)}			
				</Droppable>
			</div>);	
	}
}

export default LectureList;

