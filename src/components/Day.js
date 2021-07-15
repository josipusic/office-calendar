import React from 'react'
import Appointment from './Appointment'
import DateInfo from '../DateInfo'

export default function Day({date, myAppointments, scheduledAppointments}) {
    const name = date.toLocaleDateString('hr-HR', { weekday: 'long' })
    const formatedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    const {isOddDay, isWorkDay} = DateInfo(date)

    // generate appointment components
    const FIRST_APPOINTMENT = new Date(date.setHours(8))
    const LAST_APPOINTMENT = new Date(date.setHours(18, 30))
    const appointments = []
    let i = 0
    for (let d = FIRST_APPOINTMENT; d <= LAST_APPOINTMENT; d.setTime(d.getTime() + 30 * 60 * 1000)) {
        i++
        let appointmentDate = new Date(d)
        let isMySchedule = false
        if (myAppointments) {
            isMySchedule = myAppointments.map(a => new Date(a))
                .filter(a => a.getTime() === appointmentDate.getTime()).length > 0
        }
        const isPreviouslyScheduled = scheduledAppointments.filter(a => a.getTime() === appointmentDate.getTime()).length > 0
        appointments.push(
            <Appointment
                key={i}
                datetime={appointmentDate}
                isOddDay={isOddDay}
                isWorkDay={isWorkDay}
                isPreviouslyScheduled={isPreviouslyScheduled}
                isMySchedule={isMySchedule}
            />
        )
    }

    return (
        <div className='day'>
            <div className='heading'>
                <div className='day-name'>{name}</div>
                <div className='date'>{formatedDate}</div>
            </div>
            {appointments}
        </div>
    )
}
