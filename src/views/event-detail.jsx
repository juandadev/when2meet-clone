import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import momentTZ from 'moment-timezone';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';


export default function EventDetail(props) {
    const [selectedDays, setSelectedDays] = useState([])

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    useEffect(() => {
        const defaultTimeZone = momentTZ.tz.guess();
        const timeZonesList = momentTZ.tz.names();
        console.log(defaultTimeZone, timeZonesList)
        
    }, [])

    let availability = [
        {
            day: '12',
            month: 'apr',
            weekday: 'thu',
        },
        {
            day: '13',
            month: 'apr',
            weekday: 'thu',
        }
    ]

    let EventScheduler = [
        '12:00pm',
        '1:00pm'
    ]

    return (
        <Fragment>
            <div className='row no-gutters form__container px-3'>
                <div className='col-12 col-md-6'>
                    <label className='form-label'>To safe your vote, we need your name</label>
                    <input
                        type='text'
                        className='form-control input'
                        placeholder='Type your name here.'
                    />
                </div>
                <div className='col-12 col-md-6'>
                    <Select options={options} />
                </div>
            </div>


            <div className='btn__container'>
                <div className='btn' role='button'>
                    See group’s availability
                    <DayPicker />
                </div>
            </div>

        </Fragment>
    )
}

