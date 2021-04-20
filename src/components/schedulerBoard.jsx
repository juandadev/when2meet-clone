import React, { Fragment, useState, useEffect, useContext } from 'react'
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
import './scss/schedulerBoard.scss'

export default function SchedulerBoard(props) {
    let [selection, setSelection] = useState([])
    let [count, setCount] = useState(0)
    let groupSelection = props.groupSelection

    useEffect(() => {
        console.log('Effect', selection);
        // props.onChange(selection)
    }, [selection])


    let formatDate = (day, timezone) => {
        let date = new Date(day)
        let zonedDate = utcToZonedTime(date, timezone)
        const pattern = 'LLL dd'
        const output = format(zonedDate, pattern, { timeZone: timezone })
        return output
    }

    let getDay = (day, timezone) => {
        let date = new Date(day)
        let zonedDate = utcToZonedTime(date, timezone)
        const pattern = 'ccc'
        const output = format(zonedDate, pattern, { timeZone: timezone })
        return output
    }

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
            <div className='d-flex scheduler__Container'>
                {props.days && props.scheduler ? props.days.map((day, index) => {
                    let dayName = getDay(day, 'America/Los_Angeles')
                    let MonthAndDayNumber = formatDate(day, 'America/Los_Angeles' )
                    return (
                        <div className='scheduler__day--column'>
                        <div className='scheduler__day--header'>
                            <h6>{MonthAndDayNumber}</h6>
                            <h5>{dayName}</h5>
                        </div>
                        <Fragment>
                            {props.scheduler.map((h) => (
                                <div
                                    className={`scheduler__cell ${selection.includes(`${MonthAndDayNumber}${h}`) ? 'selected' : null}`}
                                    onClick={() => handleOnClick(MonthAndDayNumber, h)}
                                >
                                    {index === 0 ? `${h.includes("30") ? '' : h}` : null }
                                </div>
                            ))}
                        </Fragment>
                    </div>
                    )
                }) : 'Cargando...'}
            </div>
        )
    } else {
        return (
            <div className='d-flex scheduler__Container'>
                {props.days && props.scheduler ? props.days.map((day, index) => {
                    let dayName = getDay(day, 'America/Los_Angeles')
                    let MonthAndDayNumber = formatDate(day, 'America/Los_Angeles' )
                    return (
                        <div className='scheduler__day--column'>
                        <div className='scheduler__day--header'>
                            <h6>{MonthAndDayNumber}</h6>
                            <h5>{dayName}</h5>
                        </div>
                        <Fragment>
                            {/* TODO: show groups participants */}
                            {props.scheduler.map((h) => (
                                <div
                                    className={`scheduler__cell ${groupSelection.includes(`${MonthAndDayNumber}${h}`) ? 'selected' : null}`}
                                    // onClick={() => handleOnClick(MonthAndDayNumber, h)}
                                >
                                    {index === 0 ? `${h.includes("30") ? '' : h}` : null }
                                </div>
                            ))}
                        </Fragment>
                    </div>
                    )
                }) : 'Cargando...'}
            </div>
        )
    }

    
}
