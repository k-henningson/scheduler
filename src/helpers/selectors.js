export function getAppointmentsForDay(state, day) {
  //Find provided day from object
  let specificDay = state.days.filter(d => d.name === day)[0];
  if(!specificDay) {
   return [];
  }
  let result = [];

  // Find where id matches id of states.appointments
  for(const id of specificDay.appointments) {
    const appointmentObj = state.appointments[id];
  
    result.push(appointmentObj);
  }
  return result
};

export function getInterview(state, interview) {
  if (!interview) return null;
  const interviewObj = {
    student: interview.student
  };
  interviewObj.interviewer = state.interviewers[interview.interviewer];
  return interviewObj;
};
