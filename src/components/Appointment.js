import React, {useState} from 'react'


export default function Appointment({datetime, isOddDay, isWorkDay, isPreviouslyScheduled, isMySchedule}) {
    const ls = window.localStorage
    const MORNING_BREAK = new Date(new Date(datetime).setHours(11, 0))
    const AFTERNOON_BREAK = new Date(new Date(datetime).setHours(16, 0))
    const time = `${datetime.getHours()}:${datetime.getMinutes() ? '30' : '00'}`

    const [isBreakTime] = useState(
                isWorkDay &&
            (
                (isOddDay && datetime.getTime() === AFTERNOON_BREAK.getTime()) ||
                (!isOddDay && datetime.getTime() === MORNING_BREAK.getTime())
            )
        )
    const [isWorkTime] = useState(
            !(
                (!isOddDay && datetime.getHours() >= 14) ||
                (isOddDay && datetime.getHours() < 13) ||
                !isWorkDay
            )
        )
    const [isScheduled, setIsScheduled] = useState(isMySchedule)

    

    function toggleIsScheduled() {
        if (!isBreakTime && isWorkTime && !isPreviouslyScheduled && isAllowedToBeScheduled(isScheduled)) {
            setIsScheduled(prevIsScheduled => {
                updateMyAppointmentsLocalStorage(prevIsScheduled)
                return !prevIsScheduled
            })
        } else if (isBreakTime) {
            alert(`Ne možete se naručiti u ${time} sati jer je tada vrijeme pauze.`)
        } else if (!isWorkTime) {
            alert('Nije radno vrijeme. Ne možete se naručiti.')
        } else if (isPreviouslyScheduled) {
            alert('Netko se već naručio za ovaj termin.')
        } else {
            alert('Moguće se naručiti za jedan termin u danu ili dva u tjednu.')
        }
    }

    function updateMyAppointmentsLocalStorage(IsScheduled) {
        // dependent on the prevIsScheduled add or remove from localStorage
        if (!IsScheduled) {
            let myExistingAppointment = JSON.parse(ls.getItem('myAppointments'))
            if (myExistingAppointment) {
                myExistingAppointment = myExistingAppointment.map(a => new Date(a))
                // if there is already one scheduled appointment
                ls.setItem('myAppointments', JSON.stringify([datetime, ...myExistingAppointment]))
            } else {
                ls.setItem('myAppointments', JSON.stringify([datetime]))
            }
        } else {
            let myExistingAppointments = JSON.parse(ls.getItem('myAppointments')).map(a => new Date(a))
            myExistingAppointments = myExistingAppointments.filter(a => a.getTime() !== datetime.getTime())
            ls.setItem('myAppointments', JSON.stringify([...myExistingAppointments]))
        }
    }

    function isAllowedToBeScheduled(isScheduled) {
        let myAppointments = JSON.parse(ls.getItem('myAppointments'))
        if (myAppointments) {
            myAppointments = myAppointments.map(a => new Date(a))
            // first check if two schedules inside localStorage
            if (myAppointments.length === 2 && isScheduled === false) return false
            // check if any date from localStorage in from same day as current datetime (except the current date itself)
            return myAppointments.filter(
                a => isSameDay(a, datetime) && !isSameHour(a, datetime)).length === 0 ? true : false
        } else {
            return true
        }
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
      }

    function isSameHour(d1, d2) {
        return d1.getHours() === d2.getHours() &&
            d1.getMinutes() === d2.getMinutes()
    }

    let backgroudColor = 'whitesmoke'
    if (!isWorkTime) {
        backgroudColor = '#f4d4d6'
    }
    if (isBreakTime) {
        backgroudColor = '#bfe9be'
    }
    if (isScheduled || isPreviouslyScheduled) {
        backgroudColor = '#b2d1f6'
    }
    const style = {
        backgroundColor: backgroudColor,
      };

    return (
        <div
            className='appointment'
            style={style}
            onClick={toggleIsScheduled}
        >
            {time}
            <div className='my-appointment'>{isScheduled ? 'Moj termin' : ''}</div> 
        </div>
    )
}