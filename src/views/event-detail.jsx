import React, { Fragment, useEffect, useState } from 'react';
import Layout from './Layout';
import Select from 'react-select';
import SchedulerBoard from '../components/schedulerBoard';
import axios from 'axios';
import { useParams } from 'react-router';
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz');
import Timezones from '../utils/timezones';
import 'react-day-picker/lib/style.css';

const dummyEventData = {
  active: 'true',
  id: 'RZdyWgL3C9fzfNmdvKLT',
  name: 'Parranda 1',
  isRecurring: false,
  hours: [
    '12:00pm',
    '12:30pm',
    '01:00pm',
    '01:30pm',
    '02:00pm',
    '02:30pm',
    '03:00pm',
    '03:30pm',
    '04:00pm',
    '04:30pm',
    '05:00pm',
    '05:30pm',
  ],
  days: [
    '2021-04-12T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-04T17:00:00.000Z',
    '2021-04-05T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-04T17:00:00.000Z',
    '2021-04-05T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-04T17:00:00.000Z',
    '2021-04-05T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-12T17:00:00.000Z',
    '2021-04-04T17:00:00.000Z',
    '2021-04-05T17:00:00.000Z',
  ],
  timezone: 'America/Los_Angeles',
  dueDate: '2021-04-20T17:00:00.000Z',
  createAt: '',
  groupSchedules: [
    {
      name: 'Anthony',
      schedules: [
        'Apr 1201:00pm',
        'Apr 1201:30pm',
        'Apr 0402:00pm',
        'Apr 0402:30pm',
        'Apr 0405:30pm',
        'Apr 0503:00pm',
        'Apr 0503:30pm',
        'Apr 0504:30pm',
      ],
    },
    {
      name: 'juanda',
      schedules: [
        'Apr 1601:00pm',
        'Apr 1701:30pm',
        'Apr 1802:00pm',
        'Apr 0402:30pm',
        'Apr 0405:30pm',
        'Apr 0503:00pm',
        'Apr 0503:30pm',
        'Apr 0504:30pm',
      ],
    },
  ],
};

const dummyHrs = [
  '12:00pm',
  '12:30pm',
  '01:00pm',
  '01:30pm',
  '02:00pm',
  '02:30pm',
  '03:00pm',
  '03:30pm',
  '04:00pm',
  '04:30pm',
  '05:00pm',
  '05:30pm',
];

let dummyGroupScheduler = [
  'Apr 1201:00pm',
  'Apr 1201:30pm',
  'Apr 0402:00pm',
  'Apr 0402:30pm',
  'Apr 0405:30pm',
  'Apr 0503:00pm',
  'Apr 0503:30pm',
  'Apr 0504:30pm',
];

export default function EventDetail(props) {
  const { id } = useParams();
  const [selectedDays, setSelectedDays] = useState([]);
  const [eventInformation, setEventInformation] = useState({});
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [selectTimezones, setSelectTimezones] = useState([]);
  const [yourSelection, setYourSelection] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    console.log('selectedDays', selectedDays);

    Timezones.map((t) => {
      let newTimezone = { value: t, label: t };
      setSelectTimezones((selectTimezones) => [
        ...selectTimezones,
        newTimezone,
      ]);
    });

    // setEventInformation(id)
    const getEventInformation = async (eventId) => {
      let res = await axios.get(
        `https://us-central1-nrggo-test.cloudfunctions.net/app/rest/events/${eventId}`
      );
      return res.data;
    };
    getEventInformation(id)
      .then((res) => {
        console.log(`getEventInformation success! =>`, res.data);
        setEventInformation(res.data);
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

  // let handleDayClick = (day) => {
  //     console.log(day)
  //     if(selectedDays.includes(day)) {
  //         console.log('Incluye el mismo dia, quitalo');
  //         let currentDays =  selectedDays
  //         let selectedIndex = currentDays.findIndex(e => DateUtils.isSameDay(e, day))
  //         currentDays.splice(selectedIndex, 1);
  //         setSelectedDays(currentDays)
  //     } else {
  //         setSelectedDays(selectedDays => [...selectedDays, day])
  //     }
  // }

  let handleVisibility = () => {
    setIsHidden(!isHidden);
  };

  let handleInputChange = (e) => {
    let value = e.target.value;
    setName(value);
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
    // TODO: send timezone to be save in db
    const data = {
      name: name,
      schedules: yourSelection,
    };
    console.log('onScheduleSubmit', data);
    saveSchedules(id, data);
  };

  return (
    <Fragment>
      {loading ? (
        <h1 className="text-center">Loading...</h1>
      ) : (
        <Layout eventName={eventInformation.name}>
          <div className="row no-gutters form__container px-3">
            <div className="col-12 col-md-2">
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
            <div className="col-12 col-md-2 ml-md-4 align-self-end">
              <Select options={selectTimezones} className={'select'} />
            </div>
          </div>
          <div className="row no-gutters justify-content-between px-md-3">
            <div className="col-12 col-md-5">
              {isHidden ? (
                <Fragment>
                  {eventInformation.days ? (
                    <Fragment>
                      <h2 className="title px-3">Your availability</h2>
                      <SchedulerBoard
                        days={eventInformation.days}
                        scheduler={dummyHrs}
                        onChange={handleSchedulerChange}
                      />
                    </Fragment>
                  ) : (
                    <h6>Cargando...</h6>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <h2 className="title px-3">Your group's availability</h2>
                  <SchedulerBoard
                    event={eventInformation}
                    days={eventInformation.days}
                    scheduler={dummyHrs}
                    groupSelection={dummyGroupScheduler}
                  />
                </Fragment>
              )}
            </div>
            <div className="col-12 col-md-5 d-none d-md-block">
              <h2 className="title px-3">Your group's availability</h2>
              <SchedulerBoard
                days={eventInformation.days}
                scheduler={dummyHrs}
                // groupSelection={dummyGroupScheduler}
                groupSelection={eventInformation.schedules}
                timezone={'America/Los_Angeles'}
              />
            </div>
          </div>

          <div className="btn__container d-flex d-md-none fixed-bottom">
            <div
              className="btn"
              role="button"
              onClick={() => handleVisibility()}
            >
              {isHidden ? 'See group’s availability' : 'See your availability'}
            </div>
          </div>
          <div role="button" className="btn" onClick={() => onScheduleSubmit()}>
            set schedules
          </div>
        </Layout>
      )}
    </Fragment>
  );
}
