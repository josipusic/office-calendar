import DateInfo from './DateInfo'

export default function savePreScheduledAppointments(start, end) {
    // gets all schedulable hours and stores 15 random in localStorage
    const schedulableHours = []
    let date = new Date(start)
    for (date; date <= end; date.setDate(date.getDate() + 1)) {
        const {isOddDay, isWorkDay} = DateInfo(date)
        if (isWorkDay) {
            let START_HOUR = isOddDay ? 13 : 8
            for (let i = 0; i < 12; i++) {
                const hours = START_HOUR + 0.5 * i
                if ((!isOddDay && hours !== 11) || (isOddDay && hours !== 16)) {
                    schedulableHours.push(new Date(date.getTime() + hours * 60 * 60 * 1000))
                }
            }
        }
    }
    // randomly shuffle schedulable hours and get first 15 elements
    const shuffled = schedulableHours.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 15);
    // save them to localStorage
    window.localStorage.setItem('preScheduledAppointments', JSON.stringify([...selected]))
}
