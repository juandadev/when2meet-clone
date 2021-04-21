import React, { Fragment, useEffect, useState } from 'react';
import Layout from './Layout';
import Select from 'react-select';
import SchedulerBoard from '../components/schedulerBoard';
import SchedulerRecurrentBoard from '../components/schedulerRecurrentBoard';
import axios from 'axios';
import { useParams } from 'react-router';
import Timezones from '../utils/timezones';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import 'react-day-picker/lib/style.css';

export default function EventDetail(props) {
  const { id } = useParams();
  const [eventInformation, setEventInformation] = useState({});
  const [isoHours, setIsoHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [selectTimezones, setSelectTimezones] = useState([]);
  const [yourSelection, setYourSelection] = useState([]);
  const [name, setName] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [userTimezone, setUserTimezone] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [eventsDate, setEventsDate] = useState('');
  const [eventsLink, setEventsLink] = useState('');
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    Timezones.map((t) => {
      let newTimezone = { value: t, label: t };
      setSelectTimezones((selectTimezones) => [
        ...selectTimezones,
        newTimezone,
      ]);
    });

    const getEventInformation = async (eventId) => {
      let res = await axios.get(
        `https://us-central1-nrggo-test.cloudfunctions.net/app/rest/events/${eventId}`
      );
      return res.data;
    };

    getEventInformation(id)
      .then((res) => {
        console.log(`getEventInformation success! =>`, res.data);

        const { hours } = res.data;

        setEventInformation({
          ...res.data,
          hours: hours.map((item) =>
            format(utcToZonedTime(item, currentTimeZone), 'hh:mm aaaa')
          ),
        });
        setIsoHours(hours);
        setSelectedTimezone({ value: currentTimeZone, label: currentTimeZone });
        setUserTimezone(currentTimeZone);
      })
      .catch((err) => {
        console.error(`Ups!, there have been an error => ${err}`);
      })
      .finally((res) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, [id]);

  let handleSelectTimezone = (selectedOption) => {
    setSelectedTimezone(selectedOption);
    setUserTimezone(selectedOption.value);
  };

  let handleInputChange = (e) => {
    let value = e.target.value;
    setName(value);
  };

  let handleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const saveSchedules = async (eventId, data) => {
    let res = await axios.post(
      `https://us-central1-nrggo-test.cloudfunctions.net/app/rest/schedules/${eventId}`,
      data
    );
    console.log('saveSchedules', res.data);
    return res.data;
  };

  let handleSchedulerChange = (schedules) => {
    // console.log('handleSchedulerChange', schedules);
    setYourSelection(schedules);
  };

  let onScheduleSubmit = () => {
    if (!name || !userTimezone || !yourSelection) {
      alert('Please, complete form to save your schedules');
    } else {
      setLoading(true);
      const data = {
        name: name,
        schedules: yourSelection,
        timezone: userTimezone,
      };

      console.log('onScheduleSubmit', data);

      saveSchedules(id, data)
        .then((res) => {})
        .catch((err) => {
          console.error(`Ups!, there have been an error => ${err}`);
        })
        .finally((res) => {
          setLoading(false);
        });
    }
  };

  let handleEventsDateOnChange = (e) => {
    setEventsDate(e.target.value);
  };

  let handleEventsLinkOnChange = (e) => {
    setEventsLink(e.target.value);
  };

  let editEventComponent = () => (
    <div className="row no-gutters">
      <div className="col-12 col-md-12">
        <label className="form-label">Enter the date of the Event.</label>
        <input
          type="text"
          className="form-control input"
          placeholder="Enter the date of the event."
          onChange={handleEventsDateOnChange}
          value={eventsDate}
        />
      </div>
      <div className="col-12 col-md-12 mt-2">
        <label className="form-label">Where will the event be? (link)</label>
        <input
          type="text"
          className="form-control input"
          placeholder="Enter the link of the meeting."
          onChange={handleEventsLinkOnChange}
          value={eventsLink}
        />
      </div>
      <div className="col-12 mt-2">
        <div
          role="buttom"
          className="btn"
          onClick={() => handleEventOnchange()}
        >
          Guardar
        </div>
      </div>
    </div>
  );

  let onEditClick = () => {
    let safeword = prompt('What is the safe word?');
    if (safeword === eventInformation.safeWord) {
      alert('safe word correct.');
      setCanEdit(!canEdit);
    } else {
      alert('safe word is wrong.');
    }
  };

  let saveEventchanges = async (eventId, data) => {
    let res = await axios.post(
      `https://us-central1-nrggo-test.cloudfunctions.net/app/rest/events/close/${eventId}`,
      data
    );
    return res.data;
  };

  let handleEventOnchange = () => {
    setLoading(true);
    let data = {
      eventsDate: eventsDate,
      eventsLink: eventsLink,
    };
    saveEventchanges(id, data)
      .then((res) => {
        setCanEdit(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally((res) => {
        setLoading(false);
      });
  };

  let handleSelect = (data) => {
    handleSelectTimezone(data);

    console.log(
      isoHours.map((item) =>
        format(utcToZonedTime(item, data.value), 'hh:mm aaaa')
      ),
      data.value
    );

    setEventInformation({
      ...eventInformation,
      hours: isoHours.map((item) =>
        format(utcToZonedTime(item, data.value), 'hh:mm aaaa')
      ),
    });
  };

  if (!eventInformation.active) {
    return (
      <Layout>
        <div className="row">
          <div className="col-12">
            <h2>{eventInformation.name}</h2>
            <p>
              The Event will be on {eventInformation.eventsDate}, to enter the
              event enter here {`${eventInformation.eventsLink}`}
            </p>
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        {loading ? (
          <h1 className="text-center">Loading...</h1>
        ) : (
          <Fragment>
            <div className="row no-gutters form__container px-3">
              <div className="col-12 d-flex align-items-center">
                <h1 className="title main">{eventInformation.name}</h1>
                {!canEdit ? (
                  <div className="ml-3 edit-btn" onClick={() => onEditClick()}>
                    Edit event
                  </div>
                ) : null}
              </div>

              {!canEdit ? (
                <Fragment>
                  <div className="col-12 col-md-5">
                    <label className="form-label">
                      To safe your vote, we need your name
                    </label>
                    <input
                      type="text"
                      className="form-control input"
                      placeholder="Type your name here."
                      onChange={handleInputChange}
                      value={name}
                    />
                  </div>
                  <div className="col-12 col-md-5 ml-md-4 align-self-end">
                    <Select
                      options={selectTimezones}
                      className={'select'}
                      value={selectedTimezone}
                      onChange={handleSelect}
                    />
                  </div>
                </Fragment>
              ) : null}
            </div>

            <div className="row no-gutters  px-md-3">
              <div className="col-12 col-md-5 mr-md-4">
                {!canEdit ? (
                  <Fragment>
                    {/* Mobile view */}
                    {isHidden ? (
                      <Fragment>
                        {eventInformation.days ? (
                          <Fragment>
                            <h2 className="title px-3">Your availability</h2>
                            {eventInformation.isRecurrent ? (
                              <SchedulerRecurrentBoard
                                days={eventInformation.days}
                                scheduler={eventInformation.hours}
                                onChange={handleSchedulerChange}
                              />
                            ) : (
                              <SchedulerBoard
                                days={eventInformation.days}
                                scheduler={eventInformation.hours}
                                onChange={handleSchedulerChange}
                              />
                            )}
                          </Fragment>
                        ) : null}
                        <div className="col-12 col-md-5 mt-4 d-flex d-md-none">
                          <div
                            role="button"
                            className="btn"
                            onClick={onScheduleSubmit}
                          >
                            Set schedules
                          </div>
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <h2 className="title px-3">
                          Your group's availability
                        </h2>
                        {eventInformation.isRecurrent ? (
                          <SchedulerRecurrentBoard
                            days={eventInformation.days}
                            scheduler={eventInformation.hours}
                            onChange={handleSchedulerChange}
                            groupSelection={eventInformation.schedules}
                            timezone={eventInformation.timeZone}
                          />
                        ) : (
                          <SchedulerBoard
                            event={eventInformation}
                            days={eventInformation.days}
                            scheduler={eventInformation.hours}
                            groupSelection={eventInformation.schedules}
                            timezone={eventInformation.timeZone}
                          />
                        )}
                      </Fragment>
                    )}
                    <div className="col-12 col-md-12 mt-4 d-none d-md-flex p-0">
                      <div
                        role="button"
                        className="btn"
                        onClick={() => onScheduleSubmit()}
                      >
                        set schedules
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>{editEventComponent()}</Fragment>
                )}
              </div>

              <div className="col-12 col-md-5 d-none d-md-block">
                <h2 className="title px-3">Your group's availability</h2>
                {eventInformation.isRecurrent ? (
                  <SchedulerRecurrentBoard
                    days={eventInformation.days}
                    scheduler={eventInformation.hours}
                    onChange={handleSchedulerChange}
                    groupSelection={eventInformation.schedules}
                    timezone={eventInformation.timeZone}
                  />
                ) : (
                  <SchedulerBoard
                    days={eventInformation.days}
                    scheduler={eventInformation.hours}
                    groupSelection={eventInformation.schedules}
                    timezone={eventInformation.timeZone}
                  />
                )}
              </div>
            </div>

            <div className="btn__container d-flex d-md-none fixed-bottom">
              <div
                className="btn"
                role="button"
                onClick={() => handleVisibility()}
              >
                {isHidden
                  ? 'See group’s availability'
                  : 'See your availability'}
              </div>
            </div>
          </Fragment>
        )}
      </Layout>
    );
  }
}
