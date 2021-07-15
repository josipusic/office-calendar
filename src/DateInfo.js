export default function DateInfo(date) {
    const isOddDay = date.getDate() % 2 !== 0
    const isSaturday = date.getDay() === 6
    const isSunday = date.getDay() === 0
    const isWorkSaturday = isSaturday && !isOddDay
    const isWorkDay = !isSunday && (isSaturday ? (isWorkSaturday ? true : false) : true)
    return {isOddDay, isSaturday, isSunday, isWorkSaturday, isWorkDay}
}
