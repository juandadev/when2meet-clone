import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DayPicker, { DateUtils } from 'react-day-picker';
import WeekDayPicker from '../components/WeekDayPicker';
import Layout from './Layout';

export default function Home() {
  // TODO: Load automatically the users timezone
  const [eventData, setEventData] = useState({
    name: '',
    safeWord: '',
    isRecurrent: false,
    initialTime: 'default',
    finishTime: 'default',
    deadLine: 'default',
    timeZone: 'default',
  });
  const [selectedDays, setSelectedDays] = useState([]);

  function handleDayClick(day, { selected }) {
    const inputSelectedDays = selectedDays.concat();

    if (selected) {
      const selectedIndex = inputSelectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day)
      );

      inputSelectedDays.splice(selectedIndex, 1);
    } else {
      inputSelectedDays.push(day);
    }

    setSelectedDays(inputSelectedDays);
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
              />
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
                  >
                    <option value="default">Not earlier than</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col xm={6}>
                <Form.Group controlId="finishTime">
                  <Form.Control
                    name="finishTime"
                    as="select"
                    value={finishTime}
                    onChange={handleChange}
                  >
                    <option value="default">Not later than</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="deadLine">
              <Form.Control
                name="deadLine"
                as="select"
                value={deadLine}
                onChange={handleChange}
              >
                {/* TODO: Plan a way to select the day with the calendar instead of the <select> input */}
                <option value="default">Enter the survey's end day</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Form.Control>
            </Form.Group>

            {/* TODO: Load timezones */}
            <Form.Group controlId="timeZone">
              <Form.Control
                name="timeZone"
                as="select"
                value={timeZone}
                onChange={handleChange}
              >
                <option value="default">Select a time zone</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
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
            // TODO: Prevent selecting days before todays date
            <DayPicker
              selectedDays={selectedDays}
              onDayClick={handleDayClick}
            />
          ) : (
            <WeekDayPicker />
          )}
        </Col>

        <Col xs={12} className="create-event__data__submit">
          <Button>Create new event</Button>
        </Col>
      </Row>
    </Layout>
  );
}
