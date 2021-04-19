const resuqest1 = {
  name: 'Platzi Master X Day',
  safeword: 'neverstoplearning',
  isRecurrent: true,
  days: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: true,
    saturday: true,
    sunday: true,
  },
  initialTime: '5:00am',
  finishTime: '03:00pm',
  deadLine: '2021-04-27T14:51:45-06:00',
  timeZone: 'America/Chihuahua',
};

const request2 = {
  name: 'Platzi Master X Day',
  safeword: 'neverstoplearning',
  isRecurrent: false,
  days: [
    '2021-04-11T14:51:45-06:00',
    '2021-04-12T14:51:45-06:00',
    '2021-04-13T14:51:45-06:00',
  ],
  initialTime: '5:00am',
  finishTime: '03:00pm',
  deadLine: '2021-04-27T14:51:45-06:00',
  timeZone: 'America/Chihuahua',
};
