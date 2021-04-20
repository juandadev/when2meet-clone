import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import 'react-day-picker/lib/style.css';
import SchedulerBoard from '../components/schedulerBoard';
import SchedulerRecurrentBoard from '../components/schedulerRecurrentBoard';

import axios from 'axios';
import { useParams } from 'react-router';
import Timezones from '../utils/timezones'
import Layout from './Layout';

export default function EventDetail(props) {
    const {id} = useParams()
    const [selectedDays, setSelectedDays] = useState([])
    const [eventInformation, setEventInformation] = useState({})
    const [loading, setLoading] = useState(true)
    const [isHidden, setIsHidden] = useState(true)
    const [selectTimezones, setSelectTimezones] = useState([])
    const [yourSelection, setYourSelection] = useState([])
    const [name, setName] = useState('')
    const [selectedTimezone, setSelectedTimezone] = useState(null)
    const [userTimezone, setUserTimezone] = useState('')

    useEffect(() => {
        console.log('selectedDays', selectedDays)

        Timezones.map(t => {
            let newTimezone = {value: t, label: t}
            setSelectTimezones(selectTimezones => [...selectTimezones, newTimezone])
        })

        getEventInformation(id)
        .then(res => {
            console.log(`getEventInformation success! =>`, res.data);
            setEventInformation(res.data)
        })
        .catch(err => {
            console.error(`Ups!, there have been an error => ${err}`);
        })
        .finally(res => {
            setLoading(false)
        })
    }, [id])

    // setEventInformation(id)
    const getEventInformation = async eventId => {
        let res = await axios.get(`https://us-central1-nrggo-test.cloudfunctions.net/app/rest/events/${eventId}`)
        return res.data
    }

    let handleVisibility = () => {
        setIsHidden(!isHidden)
    }

    let handleSelectTimezone = (selectedOption) => {
        setSelectedTimezone(selectedOption)
        setUserTimezone(selectedOption.value)
    }

    let handleInputChange = e => {
        let value = e.target.value
        setName(value)
    }

    const saveSchedules = async (eventId, data) => {
        let res = await axios.post(`https://us-central1-nrggo-test.cloudfunctions.net/app/rest/schedules/${eventId}`, data)
        console.log('saveSchedules', res.data);
        return res.data
    }

    let handleSchedulerChange = schedules => {
        // console.log('handleSchedulerChange', schedules);
        setYourSelection(schedules);
    }

    let onScheduleSubmit = () => {
        if(!name || !userTimezone || !yourSelection ) {
            alert('Please, complete form to save your schedules')
        } else {
            setLoading(true)
            const data = {
                name: name,
                schedules: yourSelection,
                timezone: userTimezone
            }
            console.log('onScheduleSubmit', data);
            saveSchedules(id, data).then(res => {
                getEventInformation(id)
                .then(res => {
                    console.log(`getEventInformation success! =>`, res.data);
                    setEventInformation(res.data)
                })
                .catch(err => {
                    console.error(`Ups!, there have been an error => ${err}`);
                })
                .finally(res => {
                    setLoading(false)
                })
            })
        }

    }

    if(!eventInformation.active) {
        return(
            <Layout>
                <div className='row'>
                    <div className='col-12'>
                        <h2>{eventInformation.name}</h2>
                        <p>The Event will be on Thu Apr 13 at 12:00pm, to enter the event go to:
                        *link*</p>
                    </div>
                </div>
            </Layout>
        )
    } else {
        return (
            <Layout>
                {loading ? (
                    <h1 className='text-center'>Loading...</h1>
                ):(
                    <Fragment>
                        <div className='row no-gutters form__container px-3'>
                            <div className='col-12'>
                                <h1 className='title main'>{eventInformation.name}</h1>
                            </div>
                            <div className='col-12 col-md-5'>
                                <label className='form-label'>To safe your vote, we need your name</label>
                                <input
                                    type='text'
                                    className='form-control input'
                                    placeholder='Type your name here.'
                                    onChange={handleInputChange}
                                    value={name}
                                />
                            </div>
                            <div className='col-12 col-md-5 ml-md-4 align-self-end'>
                                <Select 
                                    options={selectTimezones}
                                    className={'select'}
                                    value={selectedTimezone}
                                    onChange={handleSelectTimezone}
                                />
                            </div>
                        </div>
                        <div className='row no-gutters  px-md-3'>
                            <div className='col-12 col-md-5 mr-md-4' >
                                {isHidden ? (
                                    <Fragment>
                                        {/* TODO: what if is a isRecurrent event */}

                                        {eventInformation.days ? (
                                            <Fragment>
                                                <h2 className='title px-3'>Your availability</h2>
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
                                        ) : (
                                            <h6>Loading...</h6>
                                        )}
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <h2 className='title px-3'>Your group's availability</h2>
                                            {eventInformation.isRecurrent ? (
                                                <SchedulerRecurrentBoard
                                                    days={eventInformation.days}
                                                    scheduler={eventInformation.hours}
                                                    onChange={handleSchedulerChange}
                                                    groupSelection={eventInformation.schedules}
                                                    timezone={'America/Los_Angeles'}
                                                />
                                            ) : (
                                                <SchedulerBoard
                                                    event={eventInformation}
                                                    days={eventInformation.days}
                                                    scheduler={eventInformation.hours}
                                                    // groupSelection={dummyGroupScheduler}
                                                    groupSelection={eventInformation.schedules}
                                                    timezone={'America/Los_Angeles'}
                                                />
                                            )}
                                        
                                    </Fragment>
                                )}
                            </div>
                            <div className='col-12 col-md-5 d-none d-md-block' >
                                <h2 className='title px-3'>Your group's availability</h2>
                                    {eventInformation.isRecurrent ? (
                                        <SchedulerRecurrentBoard
                                            days={eventInformation.days}
                                            scheduler={eventInformation.hours}
                                            onChange={handleSchedulerChange}
                                            groupSelection={eventInformation.schedules}
                                            timezone={'America/Los_Angeles'}
                                        />
                                    ) : (
                                        <SchedulerBoard
                                            days={eventInformation.days}
                                            scheduler={eventInformation.hours}
                                            // groupSelection={dummyGroupScheduler}
                                            groupSelection={eventInformation.schedules}
                                            timezone={'America/Los_Angeles'}
                                        />
                                    )}
                                
                            </div>

                            <div className='col-12 col-md-5 mt-4'>
                                <div role='button' className='btn' onClick={() => onScheduleSubmit()}>
                                    set schedules
                                </div>
                            </div>
                            
                        </div>

                        <div className='btn__container d-flex d-md-none fixed-bottom'>
                            <div className='btn' role='button' onClick={() => handleVisibility()}>
                                {isHidden ? 'See group’s availability' : 'See your availability'}
                            </div>
                        </div>
                        
                    </Fragment>
                )}
                
            </Layout>
        )
    }
}

