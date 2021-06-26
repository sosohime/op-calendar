import { getOpAladdin } from './src/api/baidu_op_calendar'

async function main() {
    const res = await getOpAladdin(2021, 3)
    console.log(res[0])
}

main()