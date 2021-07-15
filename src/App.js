import './index.css'
import React from 'react'
import savePreScheduledAppointments from './preScheduledAppointments'
import Day from './components/Day'

// TODO: nece sutrasnji datum

function App() {
    const START_DATE = new Date(2021, 6, 10)
    const END_DATE = addDays(START_DATE, 6)
    const ls = window.localStorage
    // populate localStorage with 15 already scheduled appointments only if they don't yet exist
    if (!ls.getItem('preScheduledAppointments')) {
        savePreScheduledAppointments(START_DATE, END_DATE)
    }
    // get localStorage data
    const myAppointments = JSON.parse(ls.getItem('myAppointments'))
    const scheduledAppointments = JSON.parse(ls.getItem('preScheduledAppointments')).map(a => new Date(a))
    
    function addDays(date, days) {
        return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
    }

    // generate day components
    const days = []
    let key = 0
    let d = new Date(START_DATE)
    for (d; d <= END_DATE; d.setDate(d.getDate() + 1)) {
        key++
        days.push(
            <Day
                key={key}
                date={new Date(d)}
                myAppointments={myAppointments}
                scheduledAppointments={scheduledAppointments}
            />
        )
    }

    return (
        <div className='main-grid'>
            <div className='days-grid'>
                {days}
            </div>
        </div>
    )
}

export default App
