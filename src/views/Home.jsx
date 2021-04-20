import React, { useState, useEffect } from 'react';
import { format, formatISO, eachMinuteOfInterval } from 'date-fns';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DayPicker, { DateUtils } from 'react-day-picker';
import WeekDayPicker from '../components/WeekDayPicker';
import Layout from './Layout';
import axios from 'axios';
import { useHistory } from 'react-router';
import timezones from '../utils/timezones';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const dayHours = [
  [0, '12:00 am'],
  [1, '01:00 am'],
  [2, '02:00 am'],
  [3, '03:00 am'],
  [4, '04:00 am'],
  [5, '05:00 am'],
  [6, '06:00 am'],
  [7, '07:00 am'],
  [8, '08:00 am'],
  [9, '09:00 am'],
  [10, '10:00 am'],
  [11, '11:00 am'],
  [12, '12:00 pm'],
  [13, '01:00 pm'],
  [14, '02:00 pm'],
  [15, '03:00 pm'],
  [16, '04:00 pm'],
  [17, '05:00 pm'],
  [18, '06:00 pm'],
  [19, '07:00 pm'],
  [20, '08:00 pm'],
  [21, '09:00 pm'],
  [22, '10:00 pm'],
  [23, '11:00 pm'],
];

/**
 * Calculates the surrounding 15 days after the user current day for the options of the survey end day
 * @returns An array with two arrays: one for the days in ISO 8601 format and another one with the days formatted like 'April, Monday 1st'
 */
function getSurveyEndDays() {
  let todayInMillis = new Date().getTime();
  let surveyEndDaysISO = [];
  let surveyEndDaysFormatted = [];

  [...Array(15)].map(() => {
    todayInMillis += 86400000;

    // Here you can see the date-fns format options for the dates: https://date-fns.org/v2.21.1/docs/format
    surveyEndDaysISO.push(formatISO(new Date(todayInMillis)));
    surveyEndDaysFormatted.push(
      format(new Date(todayInMillis), 'EEEE, MMMM do')
    );
  });

  return [surveyEndDaysISO, surveyEndDaysFormatted];
}

/**
 * This method was created with the eachMinuteOfInterval() function in date-fns library to easily get the hour intervals between the selected hours by the user
 * @param {number} interval Steps the schedule going to follow
 * @param {number} initialTime The initial hour of the event (0 - 23)
 * @param {number} finishTime  The finish hour of the event (0 - 23)
 * @returns An array with the current steps intervals and parsed hour format
 */
function setTimeIntervals(interval, initialTime, finishTime) {
  //TODO: Change the way we do this with specific dates in calendar
  let nextDay;

  finishTime <= initialTime ? (nextDay = 2) : (nextDay = 1);

  const result = eachMinuteOfInterval(
    {
      start: new Date(2021, 1, 1, initialTime, 0),
      end: new Date(2021, 1, nextDay, finishTime, 0),
    },
    { step: interval }
  );

  const times = result.map((item) => format(item, 'hh:mmaaa'));

  return times;
}

export default function Home() {
  const history = useHistory();
  const [eventData, setEventData] = useState({
    name: '',
    safeWord: '',
    isRecurrent: false,
    initialTime: '',
    finishTime: '',
    deadLine: '',
    timeZone: '',
  });
  const [validate, setValidate] = useState({
    name: false,
    initialTime: false,
    finishTime: false,
    deadLine: false,
    days: false,
  });
  const [selectedDaysWeek, setSelectedDaysWeek] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [selectedDaysMonth, setSelectedDaysMonth] = useState([]);
  const [endDaysISO, setEndDaysISO] = useState([]);
  const [endDaysFormatted, setEndDaysFormatted] = useState([]);

  useEffect(() => {
    const [ISODays, FormattedDays] = getSurveyEndDays();

    setEventData({
      ...eventData,
      timeZone: currentTimeZone,
    });
    setEndDaysISO(ISODays);
    setEndDaysFormatted(FormattedDays);
  }, []);

  function handleDayClick(day, { selected }) {
    // TODO: Find a way to parse the date format we get from the calendar selected days
    // TODO: Prevent selecting days before todays date
    // TODO: Change the calendar timezone in relation to the one selected from the user
    const inputSelectedDays = selectedDaysMonth.concat();

    if (selected) {
      const selectedIndex = inputSelectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );

      inputSelectedDays.splice(selectedIndex, 1);
    } else {
      inputSelectedDays.push(day);
    }

    setSelectedDaysMonth(inputSelectedDays);
  }

  function handleChange(event) {
    const { value, name } = event.target;

    setEventData({
      ...eventData,
      [name]: value,
    });
  }

  function handleSwitch(event) {
    let { checked } = event.target;

    checked = !isRecurrent;
    setEventData({
      ...eventData,
      isRecurrent: !isRecurrent,
    });
  }

  function handleValidation() {
    let isDaySelected = false;

    if (isRecurrent) {
      selectedDaysWeek.monday ||
      selectedDaysWeek.tuesday ||
      selectedDaysWeek.wednesday ||
      selectedDaysWeek.thursday ||
      selectedDaysWeek.friday ||
      selectedDaysWeek.saturday ||
      selectedDaysWeek.sunday
        ? (isDaySelected = false)
        : (isDaySelected = true);
    } else {
      selectedDaysMonth.length === 0
        ? (isDaySelected = true)
        : (isDaySelected = false);
    }

    setValidate({
      name: name === '',
      initialTime: initialTime === '',
      finishTime: finishTime === '',
      deadLine: deadLine === '',
      days: isDaySelected,
    });

    if (name === '') {
      return false;
    }

    if (initialTime === '') {
      return false;
    }

    if (finishTime === '') {
      return false;
    }

    if (deadLine === '') {
      return false;
    }

    if (isDaySelected) {
      return false;
    }

    return true;
  }

  function handleSubmit(eventData) {
    if (handleValidation()) {
      const {
        name,
        safeWord,
        isRecurrent,
        deadLine,
        timeZone,
        initialTime,
        finishTime,
        selectedDaysWeek,
        selectedDaysMonth,
      } = eventData;
      const hours = setTimeIntervals(30, initialTime, finishTime);
      let days;

      isRecurrent
        ? (days = selectedDaysWeek)
        : (days = selectedDaysMonth.map((item) => formatISO(new Date(item))));

      const data = {
        name,
        safeWord,
        isRecurrent,
        days,
        hours,
        deadLine,
        timeZone,
      };

      axios
        .post(
          'https://us-central1-nrggo-test.cloudfunctions.net/app/rest/events',
          data
        )
        .then((response) => {
          let id = response.data.eventId;
          history.push(`/event/${id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  const {
    name,
    safeWord,
    isRecurrent,
    initialTime,
    finishTime,
    deadLine,
    timeZone,
  } = eventData;

  return (
    <Layout>
      <Row className="create-event__head">
        <Col>
          <h1>New Event</h1>
        </Col>
      </Row>

      <Row className="create-event__data">
        <Col lg={6} xs={12} className="create-event__data__form">
          <Form>
            <Form.Group controlId="name">
              <Form.Control
                name="name"
                type="text"
                placeholder="Type the event's name"
                value={name}
                onChange={handleChange}
                isInvalid={validate.name}
              />
              <Form.Control.Feedback type="invalid">
                Enter a name to the new event
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="safeWord">
              <Form.Control
                name="safeWord"
                type="text"
                placeholder="Type a safe word (optional)"
                value={safeWord}
                onChange={handleChange}
              />

              <Form.Text className="text-muted">
                If you want to edit your event, you need to create a safe word,
                please write one if you think the event information will change.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="isRecurrent">
              <Form.Check
                name="isRecurrent"
                type="switch"
                label="Does this event happen every week?"
                onChange={handleSwitch}
              />
            </Form.Group>

            <Row>
              <Col xm={6}>
                <Form.Group controlId="initialTime">
                  <Form.Control
                    name="initialTime"
                    as="select"
                    value={initialTime}
                    onChange={handleChange}
                    isInvalid={validate.initialTime}
                  >
                    <option value="">Not earlier than</option>
                    {dayHours.map((hour, index) => (
                      <option key={`init-hour-${index}`} value={hour[0]}>
                        {hour[1]}
                      </option>
                    ))}
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    Select an initial hour
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xm={6}>
                <Form.Group controlId="finishTime">
                  <Form.Control
                    name="finishTime"
                    as="select"
                    value={finishTime}
                    onChange={handleChange}
                    isInvalid={validate.finishTime}
                  >
                    <option value="">Not later than</option>
                    {dayHours.map((hour, index) => (
                      <option key={`finish-hour-${index}`} value={hour[0]}>
                        {hour[1]}
                      </option>
                    ))}
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    Select a finish hour
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="deadLine">
              <Form.Control
                name="deadLine"
                as="select"
                value={deadLine}
                onChange={handleChange}
                isInvalid={validate.deadLine}
              >
                <option value="">Enter the survey's end day</option>
                {endDaysFormatted.map((days, index) => (
                  <option
                    key={`survey-end-day-${index}`}
                    value={endDaysISO[index]}
                  >
                    {days}
                  </option>
                ))}
              </Form.Control>

              <Form.Control.Feedback type="invalid">
                Select a due date
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="timeZone">
              <Form.Control
                name="timeZone"
                as="select"
                value={timeZone}
                onChange={handleChange}
              >
                {timezones.map((timeZone, index) => (
                  <option key={`timeZone-${index}`} value={timeZone}>
                    {timeZone}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>

        <Col
          lg={6}
          xs={12}
          className="create-event__data__calendar d-flex flex-column"
        >
          <Form.Label>Please, choose the days that might work</Form.Label>
          {!isRecurrent ? (
            <DayPicker
              selectedDays={selectedDaysMonth}
              onDayClick={handleDayClick}
            />
          ) : (
            <WeekDayPicker
              state={selectedDaysWeek}
              manageState={setSelectedDaysWeek}
            />
          )}

          {validate.days ? (
            <div className="invalid-tooltip">You need to select a day</div>
          ) : (
            ''
          )}
        </Col>

        <Col xs={12} className="create-event__data__submit mt-3">
          <Button
            onClick={() =>
              handleSubmit({
                ...eventData,
                selectedDaysWeek,
                selectedDaysMonth,
              })
            }
          >
            Create new event
          </Button>
        </Col>
      </Row>
    </Layout>
  );
}
