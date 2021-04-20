import React, { useState, useEffect } from 'react';
import { format, formatISO, eachMinuteOfInterval } from 'date-fns';
import { Row, Col, Form, Button } from 'react-bootstrap';
import DayPicker, { DateUtils } from 'react-day-picker';
import WeekDayPicker from '../components/WeekDayPicker';
import Layout from './Layout';
import axios from 'axios';
import { useHistory } from 'react-router';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const aryIannaTimeZones = [
  'Europe/Andorra',
  'Asia/Dubai',
  'Asia/Kabul',
  'Europe/Tirane',
  'Asia/Yerevan',
  'Antarctica/Casey',
  'Antarctica/Davis',
  'Antarctica/DumontDUrville', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
  'Antarctica/Mawson',
  'Antarctica/Palmer',
  'Antarctica/Rothera',
  'Antarctica/Syowa',
  'Antarctica/Troll',
  'Antarctica/Vostok',
  'America/Argentina/Buenos_Aires',
  'America/Argentina/Cordoba',
  'America/Argentina/Salta',
  'America/Argentina/Jujuy',
  'America/Argentina/Tucuman',
  'America/Argentina/Catamarca',
  'America/Argentina/La_Rioja',
  'America/Argentina/San_Juan',
  'America/Argentina/Mendoza',
  'America/Argentina/San_Luis',
  'America/Argentina/Rio_Gallegos',
  'America/Argentina/Ushuaia',
  'Pacific/Pago_Pago',
  'Europe/Vienna',
  'Australia/Lord_Howe',
  'Antarctica/Macquarie',
  'Australia/Hobart',
  'Australia/Currie',
  'Australia/Melbourne',
  'Australia/Sydney',
  'Australia/Broken_Hill',
  'Australia/Brisbane',
  'Australia/Lindeman',
  'Australia/Adelaide',
  'Australia/Darwin',
  'Australia/Perth',
  'Australia/Eucla',
  'Asia/Baku',
  'America/Barbados',
  'Asia/Dhaka',
  'Europe/Brussels',
  'Europe/Sofia',
  'Atlantic/Bermuda',
  'Asia/Brunei',
  'America/La_Paz',
  'America/Noronha',
  'America/Belem',
  'America/Fortaleza',
  'America/Recife',
  'America/Araguaina',
  'America/Maceio',
  'America/Bahia',
  'America/Sao_Paulo',
  'America/Campo_Grande',
  'America/Cuiaba',
  'America/Santarem',
  'America/Porto_Velho',
  'America/Boa_Vista',
  'America/Manaus',
  'America/Eirunepe',
  'America/Rio_Branco',
  'America/Nassau',
  'Asia/Thimphu',
  'Europe/Minsk',
  'America/Belize',
  'America/St_Johns',
  'America/Halifax',
  'America/Glace_Bay',
  'America/Moncton',
  'America/Goose_Bay',
  'America/Blanc-Sablon',
  'America/Toronto',
  'America/Nipigon',
  'America/Thunder_Bay',
  'America/Iqaluit',
  'America/Pangnirtung',
  'America/Atikokan',
  'America/Winnipeg',
  'America/Rainy_River',
  'America/Resolute',
  'America/Rankin_Inlet',
  'America/Regina',
  'America/Swift_Current',
  'America/Edmonton',
  'America/Cambridge_Bay',
  'America/Yellowknife',
  'America/Inuvik',
  'America/Creston',
  'America/Dawson_Creek',
  'America/Fort_Nelson',
  'America/Vancouver',
  'America/Whitehorse',
  'America/Dawson',
  'Indian/Cocos',
  'Europe/Zurich',
  'Africa/Abidjan',
  'Pacific/Rarotonga',
  'America/Santiago',
  'America/Punta_Arenas',
  'Pacific/Easter',
  'Asia/Shanghai',
  'Asia/Urumqi',
  'America/Bogota',
  'America/Costa_Rica',
  'America/Havana',
  'Atlantic/Cape_Verde',
  'America/Curacao',
  'Indian/Christmas',
  'Asia/Nicosia',
  'Asia/Famagusta',
  'Europe/Prague',
  'Europe/Berlin',
  'Europe/Copenhagen',
  'America/Santo_Domingo',
  'Africa/Algiers',
  'America/Guayaquil',
  'Pacific/Galapagos',
  'Europe/Tallinn',
  'Africa/Cairo',
  'Africa/El_Aaiun',
  'Europe/Madrid',
  'Africa/Ceuta',
  'Atlantic/Canary',
  'Europe/Helsinki',
  'Pacific/Fiji',
  'Atlantic/Stanley',
  'Pacific/Chuuk',
  'Pacific/Pohnpei',
  'Pacific/Kosrae',
  'Atlantic/Faroe',
  'Europe/Paris',
  'Europe/London',
  'Asia/Tbilisi',
  'America/Cayenne',
  'Africa/Accra',
  'Europe/Gibraltar',
  'America/Godthab',
  'America/Danmarkshavn',
  'America/Scoresbysund',
  'America/Thule',
  'Europe/Athens',
  'Atlantic/South_Georgia',
  'America/Guatemala',
  'Pacific/Guam',
  'Africa/Bissau',
  'America/Guyana',
  'Asia/Hong_Kong',
  'America/Tegucigalpa',
  'America/Port-au-Prince',
  'Europe/Budapest',
  'Asia/Jakarta',
  'Asia/Pontianak',
  'Asia/Makassar',
  'Asia/Jayapura',
  'Europe/Dublin',
  'Asia/Jerusalem',
  'Asia/Kolkata',
  'Indian/Chagos',
  'Asia/Baghdad',
  'Asia/Tehran',
  'Atlantic/Reykjavik',
  'Europe/Rome',
  'America/Jamaica',
  'Asia/Amman',
  'Asia/Tokyo',
  'Africa/Nairobi',
  'Asia/Bishkek',
  'Pacific/Tarawa',
  'Pacific/Enderbury',
  'Pacific/Kiritimati',
  'Asia/Pyongyang',
  'Asia/Seoul',
  'Asia/Almaty',
  'Asia/Qyzylorda',
  'Asia/Qostanay', // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
  'Asia/Aqtobe',
  'Asia/Aqtau',
  'Asia/Atyrau',
  'Asia/Oral',
  'Asia/Beirut',
  'Asia/Colombo',
  'Africa/Monrovia',
  'Europe/Vilnius',
  'Europe/Luxembourg',
  'Europe/Riga',
  'Africa/Tripoli',
  'Africa/Casablanca',
  'Europe/Monaco',
  'Europe/Chisinau',
  'Pacific/Majuro',
  'Pacific/Kwajalein',
  'Asia/Yangon',
  'Asia/Ulaanbaatar',
  'Asia/Hovd',
  'Asia/Choibalsan',
  'Asia/Macau',
  'America/Martinique',
  'Europe/Malta',
  'Indian/Mauritius',
  'Indian/Maldives',
  'America/Mexico_City',
  'America/Cancun',
  'America/Merida',
  'America/Monterrey',
  'America/Matamoros',
  'America/Mazatlan',
  'America/Chihuahua',
  'America/Ojinaga',
  'America/Hermosillo',
  'America/Tijuana',
  'America/Bahia_Banderas',
  'Asia/Kuala_Lumpur',
  'Asia/Kuching',
  'Africa/Maputo',
  'Africa/Windhoek',
  'Pacific/Noumea',
  'Pacific/Norfolk',
  'Africa/Lagos',
  'America/Managua',
  'Europe/Amsterdam',
  'Europe/Oslo',
  'Asia/Kathmandu',
  'Pacific/Nauru',
  'Pacific/Niue',
  'Pacific/Auckland',
  'Pacific/Chatham',
  'America/Panama',
  'America/Lima',
  'Pacific/Tahiti',
  'Pacific/Marquesas',
  'Pacific/Gambier',
  'Pacific/Port_Moresby',
  'Pacific/Bougainville',
  'Asia/Manila',
  'Asia/Karachi',
  'Europe/Warsaw',
  'America/Miquelon',
  'Pacific/Pitcairn',
  'America/Puerto_Rico',
  'Asia/Gaza',
  'Asia/Hebron',
  'Europe/Lisbon',
  'Atlantic/Madeira',
  'Atlantic/Azores',
  'Pacific/Palau',
  'America/Asuncion',
  'Asia/Qatar',
  'Indian/Reunion',
  'Europe/Bucharest',
  'Europe/Belgrade',
  'Europe/Kaliningrad',
  'Europe/Moscow',
  'Europe/Simferopol',
  'Europe/Kirov',
  'Europe/Astrakhan',
  'Europe/Volgograd',
  'Europe/Saratov',
  'Europe/Ulyanovsk',
  'Europe/Samara',
  'Asia/Yekaterinburg',
  'Asia/Omsk',
  'Asia/Novosibirsk',
  'Asia/Barnaul',
  'Asia/Tomsk',
  'Asia/Novokuznetsk',
  'Asia/Krasnoyarsk',
  'Asia/Irkutsk',
  'Asia/Chita',
  'Asia/Yakutsk',
  'Asia/Khandyga',
  'Asia/Vladivostok',
  'Asia/Ust-Nera',
  'Asia/Magadan',
  'Asia/Sakhalin',
  'Asia/Srednekolymsk',
  'Asia/Kamchatka',
  'Asia/Anadyr',
  'Asia/Riyadh',
  'Pacific/Guadalcanal',
  'Indian/Mahe',
  'Africa/Khartoum',
  'Europe/Stockholm',
  'Asia/Singapore',
  'America/Paramaribo',
  'Africa/Juba',
  'Africa/Sao_Tome',
  'America/El_Salvador',
  'Asia/Damascus',
  'America/Grand_Turk',
  'Africa/Ndjamena',
  'Indian/Kerguelen',
  'Asia/Bangkok',
  'Asia/Dushanbe',
  'Pacific/Fakaofo',
  'Asia/Dili',
  'Asia/Ashgabat',
  'Africa/Tunis',
  'Pacific/Tongatapu',
  'Europe/Istanbul',
  'America/Port_of_Spain',
  'Pacific/Funafuti',
  'Asia/Taipei',
  'Europe/Kiev',
  'Europe/Uzhgorod',
  'Europe/Zaporozhye',
  'Pacific/Wake',
  'America/New_York',
  'America/Detroit',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Indiana/Indianapolis',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Vevay',
  'America/Chicago',
  'America/Indiana/Tell_City',
  'America/Indiana/Knox',
  'America/Menominee',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/North_Dakota/Beulah',
  'America/Denver',
  'America/Boise',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Juneau',
  'America/Sitka',
  'America/Metlakatla',
  'America/Yakutat',
  'America/Nome',
  'America/Adak',
  'Pacific/Honolulu',
  'America/Montevideo',
  'Asia/Samarkand',
  'Asia/Tashkent',
  'America/Caracas',
  'Asia/Ho_Chi_Minh',
  'Pacific/Efate',
  'Pacific/Wallis',
  'Pacific/Apia',
  'Africa/Johannesburg',
];
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
 * @param {*} interval Steps the schedule going to follow
 * @param {*} initialTime The initial hour of the event
 * @param {*} finishTime  The finish hour of the event
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
  const history = useHistory()
  const [eventData, setEventData] = useState({
    name: '',
    safeWord: '',
    isRecurrent: false,
    initialTime: 'default',
    finishTime: 'default',
    deadLine: 'default',
    timeZone: 'default',
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

  function handleSubmit(eventData) {
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

    console.log(data);

    axios
      .post(
        'https://us-central1-nrggo-test.cloudfunctions.net/app/rest/events',
        data
      )
      .then((response) => {
        let id = response.data.eventId
        history.push(`/event/${id}`);
      })
      .catch(error => {
        console.error(error);
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
          {/* TODO: Validate fields before submitting the data */}
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
                    {dayHours.map((hour, index) => (
                      <option key={`init-hour-${index}`} value={hour[0]}>
                        {hour[1]}
                      </option>
                    ))}
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
                    {dayHours.map((hour, index) => (
                      <option key={`finish-hour-${index}`} value={hour[0]}>
                        {hour[1]}
                      </option>
                    ))}
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
                <option value="default">Enter the survey's end day</option>
                {endDaysFormatted.map((days, index) => (
                  <option
                    key={`survey-end-day-${index}`}
                    value={endDaysISO[index]}
                  >
                    {days}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="timeZone">
              <Form.Control
                name="timeZone"
                as="select"
                value={timeZone}
                onChange={handleChange}
              >
                {aryIannaTimeZones.map((timeZone, index) => (
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
        </Col>

        <Col xs={12} className="create-event__data__submit">
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
