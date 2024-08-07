# op-calendar

> Notice: 未来一年的数据不一定准确，如2021年中导出的2022年数据就有偏差，在2021年底重新导出后正常

抓取百度万年历API获取日期详细信息
文件导出至 ./export 中，每年一个文件 `${year}.json`
文件内容为`Almanac[]`，当年1月1日至12月31日，按时间排序，具体定义下文定义部分

## Usage

数据抓取

```bash
npm i
npm run dump_data // 默认抓取2015-2025年的数据 `./export/${year}.json`

npm run merge_data // 合并到同一个文件 `./export/2015-2022.json`
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
```

```json
{
    "animal": "猪",
    "avoid": "诸事不宜",
    "cnDay": "三",
    "day": "1",
    "festivalInfoList": [
        {
            "baikeId": "137017",
            "baikeName": "元旦",
            "baikeUrl": "https://baike.baidu.com/item/元旦/137017",
            "name": "元旦"
        }
    ],
    "festivalList": "元旦",
    "gzDate": "癸卯",
    "gzMonth": "丙子",
    "gzYear": "己亥",
    "isBigMonth": "1",
    "lDate": "初七",
    "lMonth": "腊",
    "lunarDate": "7",
    "lunarMonth": "12",
    "lunarYear": "2019",
    "month": "1",
    "oDate": "2019-12-31T16:00:00Z",
    "status": "1",
    "suit": "馀事勿取.铺路",
    "term": "元旦",
    "timestamp": "1577808000",
    "type": "h",
    "year": "2020",
    "yjJumpUrl": "https://mobile.51wnl-cq.com/huangli_tab_h5/?posId=BDSS&STIME=2020-01-01",
    "yj_from": "51wnl",
    "date": "20200101",
    "legalHoliday": "元旦节"
}
```

### TODOLIST

1. <del>当前数据无法根据单天数据推测法定假日数据，如国庆放假7天，仅10月1日当天desc为国庆节</del>
    
    增加`legalHoliday`字段，使用脚本导出时，自动补全节日[dump_op_aladdin_data.ts](https://github.com/sosohime/op-calendar/blob/b9ea33a2f3a494f56d8c24677ec50be0c3671037/script/dump_op_aladdin_data.ts#L16)

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
