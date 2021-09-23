// url: https://sp1.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?tn=wisetpl&format=json&resource_id=39042&query=%E6%B3%95%E5%AE%9A%E8%8A%82%E5%81%87%E6%97%A5&t=1632364115173&cb=op_aladdin_callback1632364115173
import moment from 'moment'
import legalHolidayData from './legal_holidays_data'

export const data = legalHolidayData.data[0].holiday

export type HolidayType = {
    date: string
    name: string
}

export function getYearHoliday(year: number): HolidayType[] {
    return (data.find(item => Number(item.year) === year) || {}).list || []
}

export function getYearHolidayMap(year: number): {[key in string]: HolidayType} {
    const holidays = getYearHoliday(year)

    return holidays.reduce((p, c) => {
        p[moment(c.date).format('YYYYMMDD')] = c
        return p
    }, {} as {[key in string]: HolidayType})
}