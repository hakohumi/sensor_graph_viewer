import { assertEquals } from 'https://deno.land/std@0.126.0/testing/asserts.ts'
import ky from 'https://cdn.skypack.dev/ky?dts'

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
