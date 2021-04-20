import React, { Fragment, useState, useEffect, useContext } from 'react'
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
import './scss/schedulerBoard.scss'

export default function SchedulerBoard(props) {
    let [selection, setSelection] = useState([])
    let [count, setCount] = useState(0)
    let groupSelection = props.groupSelection

    useEffect(() => {
        console.log('groupSelection', props.groupSelection);
        if(props.groupSelection) {
            props.groupSelection.map(e => console.log(`this is ${e.name}'s schedules`, e.schedules))
        }
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
            //mobile view
            <div className='d-flex scheduler__Container'>
                {props.days && props.scheduler ? props.days.map((day, index) => {
                    let dayName = getDay(day, 'America/Los_Angeles')
                    let MonthAndDayNumber = formatDate(day, 'America/Los_Angeles' )
                    return (
                        <div key={`${day}${index}`} className='scheduler__day--column'>
                            <div className='scheduler__day--header'>
                                <h6>{MonthAndDayNumber}</h6>
                                <h5>{dayName}</h5>
                            </div>
                            <Fragment>
                                
                                {props.scheduler.map((h) => (
                                    <div key={`${h}${day}`}
                                        className={`scheduler__cell ${selection.includes(`${MonthAndDayNumber}${h}`) ? 'selected' : null}`}
                                        onClick={() => handleOnClick(MonthAndDayNumber, h)}
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
            <div className='d-flex scheduler__Container'>
                {props.days && props.scheduler ? props.days.map((day, index) => {
                    let dayName = getDay(day, 'America/Los_Angeles')
                    let MonthAndDayNumber = formatDate(day, 'America/Los_Angeles' )
                    return (
                        <div key={`${day}${index}`} className='scheduler__day--column position-relative'>
                            <div className='scheduler__day--header'>
                                <h6>{MonthAndDayNumber}</h6>
                                <h5>{dayName}</h5>
                            </div>
                            <Fragment>
                                {/* TODO: show groups participants */}
                                {props.scheduler.map((h) => (
                                    <div key={`${day}${h}`} className='cell__container position-relative'>
                                        {props.groupSelection.map((person, pindex) => (
                                            <div key={`${person}${h}${pindex}`}
                                                className={`scheduler__cell ${pindex === 0 ? 'cell-relative' : 'cell-absolute'} ${person.schedules.includes(`${MonthAndDayNumber}${h}`) ? 'selected' : null}`}
                                            > 
                                                {index === 0 && pindex === 0 ? `${h.includes("30") ? '' : h}` : null }
                                            </div>
                                        ))}
                                        {/* <div
                                            className={`scheduler__cell ${props.groupSelection[2].schedules.includes(`${MonthAndDayNumber}${h}`) ? 'selected' : null}`}
                                            // onClick={() => handleOnClick(MonthAndDayNumber, h)}
                                        >
                                            {index === 0 ? `${h.includes("30") ? '' : h}` : null }
                                        </div> */}

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
