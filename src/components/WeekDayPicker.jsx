import React, { useState } from 'react';
import '../assets/scss/WeekDayPicker.scss';

export default function WeekDayPicker({ state, manageState }) {
  function selectedDay(event) {
    const { dataset } = event.target;

    manageState({
      ...state,
      [dataset.day]: !state[dataset.day],
    });
  }

  const {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = state;

  return (
    <div className="weekPicker__week">
      <div
        className={`weekpicker__week--day ${sunday ? 'selected' : ''}`}
        data-day="sunday"
        onClick={selectedDay}
      >
        Sunday
      </div>

      <div
        className={`weekpicker__week--day ${monday ? 'selected' : ''}`}
        data-day="monday"
        onClick={selectedDay}
      >
        Monday
      </div>

      <div
        className={`weekpicker__week--day ${tuesday ? 'selected' : ''}`}
        data-day="tuesday"
        onClick={selectedDay}
      >
        Tuesday
      </div>

      <div
        className={`weekpicker__week--day ${wednesday ? 'selected' : ''}`}
        data-day="wednesday"
        onClick={selectedDay}
      >
        Wednesday
      </div>

      <div
        className={`weekpicker__week--day ${thursday ? 'selected' : ''}`}
        data-day="thursday"
        onClick={selectedDay}
      >
        Thursday
      </div>

      <div
        className={`weekpicker__week--day ${friday ? 'selected' : ''}`}
        data-day="friday"
        onClick={selectedDay}
      >
        Friday
      </div>

      <div
        className={`weekpicker__week--day ${saturday ? 'selected' : ''}`}
        data-day="saturday"
        onClick={selectedDay}
      >
        Saturday
      </div>
    </div>
  );
}
