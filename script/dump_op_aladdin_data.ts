import fs from 'fs';
import path from 'path';
import { getOpAladdin, Almanac } from '../api/baidu_op_calendar'

const MOUNTH_OF_YEAR = Array.from({length: 12}).map((v, i) => i + 1)

const DUMP_DIR = path.resolve(__dirname, '../lib')

async function dumpFullYearData(year: number) {
    try{
        console.log(`starting dump ${year} data`)
        const dataMap: {[key: string]: Almanac} = {}
        for(const mounth of MOUNTH_OF_YEAR) {
            const data = await getOpAladdin(year, mounth);
            data.forEach(almanac => {
                const { year: _year, month: _month, day: _day } = almanac
                if(+_year === +year) {
                    const date =`${_year}-${_month}-${_day}`
                    dataMap[date] = {...almanac, date}
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
    const dump_years = Array.from({length: 12}).map((v, i) => i + 2011)
    for(const year of dump_years) {
        await dumpFullYearData(year)
    }
}

main()