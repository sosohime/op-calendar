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
    desc?: string // 节日
    festivalInfoList?: {
        baikeId: string // 百度百科ID
        baikeName: string // 百度百科名称
        baikeUrl: string // 百度百科链接
        name: string // 同desc，节日名称
    }[]
    festivalList?: string // 当日所有节日、节气、纪念日，以逗号分割
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
    date: string
    yjJumpUrl: string // 宜忌查看跳转链接
    yj_from: string // 宜忌来源

    legalHoliday?: string
}

const BAIDU_OP_URL = 'https://opendata.baidu.com/data/inner?tn=reserved_all_res_tn&type=json&resource_id=52109&query=2024%E5%B9%B410%E6%9C%88&apiType=yearMonthData'

export async function getOpAladdin(year: number, month: number): Promise<Almanac[]> {
    const query_month = `${year}年${month}月`
    const query_url = BAIDU_OP_URL + `&query=${encodeURIComponent(query_month)}`
    const res = await axios.get(query_url)

    const data = res.data.Result[0].DisplayData.resultData.tplData.data.almanac as Almanac[]

    // 日期按时间线排序
    return data.map(a => {
        return {...a, date: moment(a.oDate).utcOffset(8).format('YYYYMMDD')}
    }).sort((a, b) => moment(b.oDate).diff(moment(a.oDate))) as Almanac[]
}
