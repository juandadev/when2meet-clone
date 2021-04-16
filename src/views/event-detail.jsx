import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import DayPicker, {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import SchedulerBoard from '../components/schedulerBoard';
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const dummyDays = [
    "2021-04-12T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-04T17:00:00.000Z",
    "2021-04-05T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-04T17:00:00.000Z",
    "2021-04-05T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-04T17:00:00.000Z",
    "2021-04-05T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-12T17:00:00.000Z",
    "2021-04-04T17:00:00.000Z",
    "2021-04-05T17:00:00.000Z",
]

const dummyHrs = [
    "12:00pm",
    "12:30pm",
    "01:00pm",
    "01:30pm",
    "02:00pm",
    "02:30pm",
    "03:00pm",
    "03:30pm",
    "04:00pm",
    "04:30pm",
    "05:00pm",
    "05:30pm",
]

let dummyGroupScheduler = [
    "Apr 1201:00pm",
    "Apr 1201:30pm",
    "Apr 0402:00pm",
    "Apr 0402:30pm",
    "Apr 0405:30pm",
    "Apr 0503:00pm",
    "Apr 0503:30pm",
    "Apr 0504:30pm"
]

export default function EventDetail(props) {
    const [selectedDays, setSelectedDays] = useState([])
    const [isHidden, setIsHidden] = useState(true)

    useEffect(() => {
        console.log('selectedDays', selectedDays)

        let date = new Date('2021-04-04T17:00:00.000Z')
        let timeZone = 'America/Los_Angeles'
        const zonedDate = utcToZonedTime(date, timeZone)
        const pattern = 'LLL dd ccc'
        const output = format(zonedDate, pattern, { timeZone: 'America/Los_Angeles' })
        console.log(output);
    }, [])

    let handleDayClick = (day) => {
        console.log(day)
        if(selectedDays.includes(day)) {
            console.log('Incluye el mismo dia, quitalo');
            let currentDays =  selectedDays
            let selectedIndex = currentDays.findIndex(e => DateUtils.isSameDay(e, day))
            currentDays.splice(selectedIndex, 1);
            setSelectedDays(currentDays)
        } else {
            setSelectedDays(selectedDays => [...selectedDays, day])
        }   
    }

    let handleVisibility = () => {
        setIsHidden(!isHidden)
    }

    return (
        <Fragment>
            <div className='row no-gutters form__container px-3'>
                <div className='col-12 col-md-2'>
                    <label className='form-label'>To safe your vote, we need your name</label>
                    <input
                        type='text'
                        className='form-control input'
                        placeholder='Type your name here.'
                    />
                </div>
                <div className='col-12 col-md-2 ml-md-4 align-self-end'>
                    <Select 
                        options={options}
                        className={'select'}
                    />
                </div>
            </div>
            <div className='row no-gutters justify-content-between px-md-3'>
                <div className='col-12 col-md-5' >
                    
                    {isHidden ? (
                        <Fragment>
                            <h2 className='title px-3'>Your availability</h2>
                            <SchedulerBoard
                                days={dummyDays}
                                scheduler={dummyHrs}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2 className='title px-3'>Your group's availability</h2>
                            <SchedulerBoard
                                days={dummyDays}
                                scheduler={dummyHrs}
                                groupSelection={dummyGroupScheduler}
                            />
                        </Fragment>
                    )}
                </div>
                <div className='col-12 col-md-5 d-none d-md-block' >
                    <h2 className='title px-3'>Your group's availability</h2>
                    <SchedulerBoard
                        days={dummyDays}
                        scheduler={dummyHrs}
                        groupSelection={dummyGroupScheduler}
                    />
                </div>
            </div>

            <div className='btn__container d-flex d-md-none fixed-bottom'>
                <div className='btn' role='button' onClick={() => handleVisibility()}>
                    {isHidden ? 'See group’s availability' : 'See your availability'}
                </div>
            </div>

        </Fragment>
    )
}

