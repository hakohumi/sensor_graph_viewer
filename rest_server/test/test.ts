import { assertEquals } from 'https://deno.land/std@0.126.0/testing/asserts.ts'
import ky from 'https://cdn.skypack.dev/ky?dts'
import { sleepRandomAmountOfSeconds } from 'https://deno.land/x/sleep/mod.ts'

Deno.test('test 1', () => {
  assertEquals(1, 1)
})

Deno.test(
  'データベース追加速度テスト',
  { permissions: { net: true } },
  async () => {
    let get_data = await ky('http://localhost:8080/api/v1/sensor', {
      method: 'post',
    }).text()
    console.log(`get data: ${get_data}`)
  }
)

Deno.test(
  'インスタンス連続追加テスト',
  { permissions: { net: true } },
  async () => {
    const tests = [...new Array(1000).keys()].map(async (_) => {
      // const get_data = await ky('http://localhost:8080/api/v1/sensor', {
      //   method: 'post',
      // }).text()
      const get_data = 1
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return get_data
    })

    await tests.forEach((e) => e.then())
    // console.log(`get data: ${all_data}`)
  }
)
