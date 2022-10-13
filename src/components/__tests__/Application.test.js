import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));

      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));
    // Edit Archie Cohen student name to my name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Kyra Henningson" },
    });
    // Change from Tori current interviewer #2 to Sylvia interviewer #1
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // Save new changes
    fireEvent.click(queryByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Kyra Henningson"));
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();
    // Make sure spots have stayed the same for Monday
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  /* test number five */
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    //Find first empty appt which is 12pm Monday
    const appointment = appointments[0];
    //Click on add
    fireEvent.click(getByAltText(appointment, "Add"));
    //Enter name and select interviewer #1 or #2 for 12pm appt slot
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "New Student Name" },
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    //Save
    fireEvent.click(getByText(appointment, "Save"));
    //Wait for Error transition
    await waitForElement(() => getByText(appointment, "Error"));
    //Find error message
    expect(
      getByText(appointment, "Could not save appointment")
    ).toBeInTheDocument();
    //Click close button
    fireEvent.click(getByAltText(appointment, "Close"));
    //Check back at the starting point
    await waitForElement(() => getByText(container, "Archie Cohen"));
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
  });

  /* test number six */
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    //Find first booked appt in schedule
    const appointments = getAllByTestId(container, "appointment");
    const firstBookedAppt = appointments[1];
    //Click on delete
    fireEvent.click(getByAltText(firstBookedAppt, "Delete"));
    //Find delete message
    expect(
      getByText(firstBookedAppt, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    //Click confirm
    fireEvent.click(getByText(firstBookedAppt, "Confirm"));
    //Wait for Delete transition
    await waitForElement(() => getByText(firstBookedAppt, "Deleting"));
    //Find error message
    expect(
      getByText(firstBookedAppt, "Could not delete appointment")
    ).toBeInTheDocument();
    //Click close button
    fireEvent.click(getByAltText(firstBookedAppt, "Close"));
    //Check back at the starting point
    await waitForElement(() => getByText(container, "Archie Cohen"));
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
  });
});
