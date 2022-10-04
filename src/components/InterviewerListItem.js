import React from 'react';
import classNames from "classnames";

import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  console.log('ILI props: ', props);

  const interviewClass = classNames("interviewers__item", {"interviewers__item--selected": props.selected});

  
  return (
    <li onClick={() => props.setInterviewer(props.id)} className={interviewClass}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}




// const interviewer = {
//   id: 1,
//   name: "Sylvia Palmer",
//   avatar: "https://i.imgur.com/LpaY82x.png"
// };