import axios from "axios";
import moment from "moment";

enum Almanac_status {
    HOLIDAY = "1", // 因为节日休息
    MAKE_UP_WORK = "2" // 补班日
}

type Almanac_TYPE = 'i' | 't' | 'h' | 'c' | 'a'

export interface Almanac {
    animal: string // 属相
    avoid: string // 忌
    cnDay: string // 星期，汉字
    day: number // 公历日
    desc: string // 节日
    gzDate: string // 日干支
    gzMonth: string // 月干支
    gzYear: string // 年干支
    isBigMonth: number // 是否大月
    lDate: string // 农历日，汉字
    lMonth: string // 农历月份，汉字
    lunarDate: number // 农历日，数字
    lunarMonth: number // 农历月份，数字
    lunarYear: string // 农历年, 数字
    month: number // 公历月
    oDate: string // Date， GMT 0
    suit: string // 宜
    term: string // 日子带有特殊性（节气、节日、北方小年等）
    type: Almanac_TYPE // 待推测
    value: string // 国家纪念日、国际节日、三九天（如国际艾滋病日、中国国家警察日、一九等）
    year: number // 公历年份
    status: Almanac_status // 类型
    date?: string

    legalHoliday?: string
}

interface OpAladdinRes {
    status: number;
    data: {
        almanac: Almanac[]
    }[];
}

const BAIDU_OP_URL = 'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?co=&resource_id=39043&t=1624698379808&ie=utf8&oe=utf8&cb=op_aladdin_callback&format=json&tn=wisetpl&_=1624698374167'

export async function getOpAladdin(year: number, month: number): Promise<Almanac[]> {
    const query_month = `${year}年${month}月`
    const query_url = BAIDU_OP_URL + `&query=${encodeURIComponent(query_month)}`
    const jsonp_res = await axios.get(query_url)

    const json_string = jsonp_res.data.split('op_aladdin_callback(').pop().split(')').shift()
    const res = JSON.parse(json_string) as OpAladdinRes

    // 日期按时间线排序
    return res.data[0].almanac.map(a => {
        return {...a, date: moment(a.oDate).utcOffset(8).format('YYYYMMDD')}
    }).sort((a, b) => moment(b.oDate).diff(moment(a.oDate))) as Almanac[]
}