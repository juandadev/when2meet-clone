import React, { Fragment, useState, useEffect, useContext } from 'react'
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
import './scss/schedulerBoard.scss'

export default function SchedulerRecurrentBoard(props) {
    let [selection, setSelection] = useState([])
    let [count, setCount] = useState(0)
    let groupSelection = props.groupSelection
    let [dayOfWeek, setDayOfWeek] = useState([])

    let day_of_week = new Date().getDay();

    useEffect(() => {
        console.log('groupSelection', props.groupSelection);
        if(props.groupSelection) {
            props.groupSelection.map(e => console.log(`this is ${e.name}'s schedules`, e.schedules))
        }

        let arr = ['', '', '', '', '', '', '']

        // for (const [key, value] of Object.entries(props.days)) {
        //         if (key === 'monday' && value === true) arr[0] = 'monday'
        //         if (key === 'tuesday' && value === true) arr[1] = 'tuesday'
        //         if (key === 'wednesday' && value === true) arr[2] = 'wednesday'
        //         if (key === 'thursday' && value === true) arr[3] = 'thursday'
        //         if (key === 'friday' && value === true) arr[4] = 'friday'
        //         if (key === 'saturday' && value === true) arr[5] = 'saturday'
        //         if (key === 'sunday' && value === true) arr[6] = 'sunday'
        //     // if(value === true && key === 'sunday') {
        //     //     // console.log(`${key}: ${value}`);
        //     //     setDayOfWeek(dayOfWeek => [...dayOfWeek, key])
        //     // }
        // }
        
        Object.entries(props.days).forEach(([key, value]) => {
                if (key === 'monday' && value === true) arr[0] = 'monday'
                if (key === 'tuesday' && value === true) arr[1] = 'tuesday'
                if (key === 'wednesday' && value === true) arr[2] = 'wednesday'
                if (key === 'thursday' && value === true) arr[3] = 'thursday'
                if (key === 'friday' && value === true) arr[4] = 'friday'
                if (key === 'saturday' && value === true) arr[5] = 'saturday'
                if (key === 'sunday' && value === true) arr[6] = 'sunday'
        })
        
        let newArr = arr.filter(str => str !== '')
        // setDayOfWeek(dayOfWeek => [...dayOfWeek, newArr])
        setDayOfWeek(newArr)

        const sortDays = days => {
            let arr = ['', '', '', '', '', '', '']
            days.forEach(day => {
                if (day === 'Sun') arr[0] = 'Sun'
                if (day === 'Mon') arr[1] = 'Mon'
                if (day === 'Tue') arr[2] = 'Tue'
                if (day === 'Wed') arr[3] = 'Wed'
                if (day === 'Thu') arr[4] = 'Thu'
                if (day === 'Fri') arr[5] = 'Fri'
                if (day === 'Sat') arr[6] = 'Sat'
            })
            return arr.filter(str => str !== '')
        }
        
    }, [selection])


    let handleOnClick = (day, hrs) => {
        let curretSelection = selection
        
        if(curretSelection.includes(`${day}${hrs}`)){
            let indexToRemove = curretSelection.findIndex(e => e === `${day}${hrs}`)
            curretSelection.splice(indexToRemove, 1);
            setSelection(selection => [...curretSelection])
            // console.log(`removed => ${day}${hrs}`, selection);
            props.onChange([...curretSelection])
        } else {
            setSelection(selection => [...selection, `${day}${hrs}`])
            // console.log(`added => ${day}${hrs}`, selection);
            props.onChange([...curretSelection, `${day}${hrs}`])
        }
    }

    if(!groupSelection) {
        return (
            //mobile view
            <div className='d-flex scheduler__Container'>
                {props.days && props.scheduler ? dayOfWeek.map((day, index) => {
                    return (
                        <div key={`${day}${index}`} className='scheduler__day--column'>
                            <div className='scheduler__day--header'>
                                <h5>{day}</h5>
                            </div>
                            <Fragment>
                                {props.scheduler.map((h) => (
                                    <div
                                        key={h}
                                        className={`scheduler__cell ${selection.includes(`${day}${h}`) ? 'selected' : null}`}
                                        onClick={() => handleOnClick(day,h)}

                                    >
                                        {index === 0 ? `${h.includes("30") ? '' : h}` : null }
                                    </div>
                                ))}
                            </Fragment>
                        </div>
                    )
                }) : null}
            </div>
        )
    } else {
        return (
            // desktop view
            <Fragment>
                <div className='d-flex scheduler__Container'>
                    {props.days && props.scheduler ? dayOfWeek.map((day,index) => {
                        return (
                            <div key={`${day}${index}`} className='scheduler__day--column position-relative'>
                                <div className='scheduler__day--header'>
                                    <h5>{day}</h5>
                                </div>
                                <Fragment>
                                    {props.scheduler.map((h) => {
                                        return (
                                        <div key={h} className='cell__container position-relative'>
                                            {props.groupSelection.map((person, pindex) => {
                                                return (
                                                <div key={`${person}${pindex}${h}`} className={`scheduler__cell ${pindex === 0 ? 'cell-relative' : 'cell-absolute'} ${person.schedules.includes(`${day}${h}`) ? 'selected' : null}`}>
                                                    {index === 0 && pindex === 0 ? `${h.includes("30") ? '' : h}` : null }
                                                </div>)
                                            })}
                                        </div>
                                    )})}
                                </Fragment>
                            </div>
                        )
                    }) : null}
                </div>
            </Fragment>
        )
    }

    
}
