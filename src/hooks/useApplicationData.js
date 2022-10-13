import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => {
    setState((prev) => {
      return { ...prev, day: day };
    });
  };

  const spotsRemaining = function (id, appointments) {
    //Called when booking/editing or canceling appt/interview
    const currentDay = state.days.find((day) => day.appointments.includes(id));
    let counter = 0;
    for (const id of currentDay.appointments) {
      if (!appointments[id].interview) {
        counter++;
      }
    }
    const updatedDay = { ...currentDay, spots: counter };
    const days = [...state.days];
    const index = days.findIndex((item) => item.name === currentDay.name);
    days.splice(index, 1, updatedDay);
    return days;
  };

  const bookInterview = function (id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const days = spotsRemaining(id, appointments);
      setState({
        ...state,
        appointments,
        days,
      });
    });
  };

  const cancelInterview = function (id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.delete(`/api/appointments/${id}`).then(() => {
      const days = spotsRemaining(id, appointments);
      setState({
        ...state,
        appointments,
        days,
      });
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => {
        return {
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        };
      });
    });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
