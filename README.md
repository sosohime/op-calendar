# op-calendar

抓取百度万年历API获取日期详细信息
文件导出至 ./lib 中，每年一个文件 `${year}.json`
文件内容为`Almanac[]`，当年1月1日至12月31日，按时间排序，具体定义下文定义部分

## Usage

数据抓取

```bash
npm i
npm run dump_data // 默认抓取2011-2022年的数据
```

应用示例
[雨量-流量-节假日关系图](https://yuanbo.online/op_demo/)
./demo/area-rainfall.html

## 定义

```typescript
enum Almanac_status {
    HOLIDAY = "1", // 因为节日休息
    MAKE_UP_WORK = "2" // 补班日
}

type Almanac_TYPE = 'i' | 't' | 'h' | 'c' | 'a' // 这个尚未推测出含义，见下文描述

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
}
```

```json
{
        "animal": "虎",
        "avoid": "装修.入宅.动土.安床.出行.上梁.作灶.旅游.修造.伐木.经络.求医.竖柱.作梁.词讼.置产.出师.打官司",
        "cnDay": "六",
        "day": "1",
        "desc": "元旦",
        "festival": "元旦",
        "gzDate": "丙辰",
        "gzMonth": "戊子",
        "gzYear": "庚寅",
        "isBigMonth": "",
        "lDate": "廿七",
        "lMonth": "十一",
        "lunarDate": "27",
        "lunarMonth": "11",
        "lunarYear": "2010",
        "month": "1",
        "oDate": "2010-12-31T16:00:00.000Z",
        "status": "1",
        "suit": "搬家.开业.结婚.领证.开工.订婚.安葬.开张.入学.求嗣.破土.祈福.祭祀.拆卸.开市.纳财.纳畜.裁衣.出火.开光.嫁娶.纳采.移徙.盖屋.冠笄.斋醮.求财.招赘.挂匾.纳婿",
        "term": "",
        "type": "h",
        "value": "元旦",
        "year": "2011",
        "date": "2011-1-1"
    },
```

### TODOLIST

1. 当前数据无法根据单天数据推测法定假日数据，如国庆放假7天，仅10月1日当天desc为国庆节

----

### 关于type字段的推测

尝试从`value`、`term`、`desc`三个字段，来分析，尚未得出结论

```json
value
i : ["湿地日","妇女节","","愚人节","地球日","劳动节","母亲节","护士节","博物馆日","环境日","国际奥林匹克日","","学生日","艾滋病日"]
t : ["腊八节","","除夕","春节","元宵节","白色情人节","端午节","七夕节","中元节","中秋节","世界标准日","寒衣节","下元节"]
h : ["元旦","植树节","世界哮喘日","儿童节","建党节","建军节","中国抗战胜利纪念日","教师节","国际音乐日","国家公祭日"]
c : ["平安夜","圣诞节"]
a : ["情人节","父亲节","感恩节"]
```

```json
term
i : ["","","","","","","","防灾减灾日","","芒种","","","",""]
t : ["大寒","北方小年","","","元宵节","国际警察日","","","","国际和平日","","",""]
h : ["","","五四青年节","","建党节","","","","国庆节",""]
c : ["",""]
a : ["","",""]
```

```json
desc
i : ["湿地日","妇女节","消费者权益日","愚人节","地球日","劳动节","母亲节","护士节","博物馆日","环境日","","","学生日","艾滋病日"]
t : ["腊八节","","除夕","春节","元宵节","龙头节","端午节","七夕节","中元节","中秋节","重阳节","寒衣节","下元节"]
h : ["元旦","植树节","五四青年节","儿童节","香港回归日","建军节","","教师节","国庆节",""]
c : ["平安夜","圣诞节"]
a : ["情人节","父亲节","感恩节"]
```
