import fs from 'fs';
import moment from 'moment';
import { pick } from 'lodash'
import path from 'path';
import { getOpAladdin, Almanac } from '../api/baidu_op_calendar'
import { getYearHoliday, HolidayType } from '../lib/legal_holidays'

const MOUNTH_OF_YEAR = Array.from({length: 12}).map((v, i) => i + 1)

const DUMP_DIR = path.resolve(__dirname, '../export')

async function pickAndMerge(years: number[], keys: (keyof Almanac)[]): Promise<void> {
    const map = {} as {[key in string]: any}
    for(const year of years) {
        const data = JSON.parse(await fs.readFileSync(`${DUMP_DIR}/${year}.json`, { encoding: 'utf-8' })) as Almanac[]
        data.forEach(item => {
            const obj = pick(item, keys)
            map[obj.date] = obj
        })
    }
    await fs.writeFileSync(`${DUMP_DIR}/merge-${years[0]}-${years[years.length - 1]}.json`, JSON.stringify(map))
}

pickAndMerge([2020, 2021], ['date', 'cnDay', 'desc', 'term', 'day', 'value','month', 'year', 'status', 'legalHoliday'])