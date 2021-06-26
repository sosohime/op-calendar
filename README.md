# op-calendar

抓取百度万年历API获取日期详细信息

## Usage

```bash
npm i
npm run dump_data // 默认抓取2011-2022年的数据

// 文件导出至 ./src/export_data 中
```

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

----
关于type字段的推测: 尝试从`value`、`term`、`desc`三个字段，来分析，尚未得出结论

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

