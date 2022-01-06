import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { getOpAladdin, Almanac } from '../api/baidu_op_calendar'
import { getYearHoliday, HolidayType } from '../lib/legal_holidays'

const MOUNTH_OF_YEAR = Array.from({length: 12}).map((v, i) => i + 1)

const DUMP_DIR = path.resolve(__dirname, '../export')

function isRestDay(item: Almanac): boolean {
    const { status, cnDay } = item
    return status === '1' || (['六', '日'].includes(item.cnDay) && status !== '2')
}

function injectLegalHoliday(items: Almanac[], holidays: HolidayType[]): (Almanac & {legalHoliday?: string})[] {
    function walk(items: Almanac[], startIdx: number, name: string,type: 'left' | 'right'):void {
        if(type === 'left') {
            let idx = startIdx;
            while(idx >= 0) {
                const item = items[idx]
                if(item && isRestDay(item)) {
                    item.legalHoliday = name
                    idx--
                } else {
                    idx = -1
                }
            }
        } else {
            let idx = startIdx;
            while(idx < items.length) {
                const item = items[idx]
                if(item && isRestDay(item)) {
                    item.legalHoliday = name
                    idx++
                } else {
                    idx = items.length + 1
                }
            }
        }
    }
    holidays.forEach(({ date, name }) => {
        // 如果当前区间包含节日
        const h_idx = items.findIndex(item => moment(item.date).diff(moment(date, 'YYYY-M-D'), 'day') === 0)
        // 则向前后寻找休息日，标记为假期
        if(h_idx >= 0) {
            walk(items, h_idx, name, 'left')
            walk(items, h_idx, name, 'right')
        }
    })
    return items
}

async function dumpFullYearData(year: number) {
    try{
        console.log(`starting dump ${year} data`)
        const dataMap: {[key: string]: Almanac} = {}
        console.log(`get holidays`)
        const holidays = getYearHoliday(year)
        console.log(`holidays is ${JSON.stringify(holidays)}`)

        for(const mounth of MOUNTH_OF_YEAR) {
            const data = injectLegalHoliday(await getOpAladdin(year, mounth), holidays);
            data.forEach(almanac => {
                const { year: _year, date } = almanac
                if(+_year === +year) {
                    dataMap[date] = almanac
                }
            })
        }
        const fullYearData = Object.values(dataMap).sort((a, b) => new Date(a.oDate) > new Date(b.oDate) ? 1 : -1)
    
        await fs.writeFileSync(`${DUMP_DIR}/${year}.json`, JSON.stringify(fullYearData))
        console.log('finish')
    } catch(e) {
        console.error(`dump ${year} data failed, ${e}`)
    }
}

async function main() {
    // 2011 - 2022年
    const dump_years = Array.from({length: 1}).map((v, i) => i + 2022)
    for(const year of dump_years) {
        await dumpFullYearData(year)
    }
}

main()