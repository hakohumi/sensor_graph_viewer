import {
  RouterContext,
  helpers,
  Status,
} from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'
import { SqlController } from '../../sql_controler/sql_controller.ts'

const database = new SqlController(new DB('sqlite.db'))

export const powerSensorController = {
  // センサーのインスタンスを作成、インスタンスIDを返す
  create_sensor_instance(ctx: RouterContext) {
    const a = ctx.request.body
    console.log(`create sensor ${a.toString}`)

    const instance_id = database.createInstanceTable()
    console.log(`Instance_id ${instance_id}`)
    const table = database.getAllInstanceTable()
    console.log(`table ${table}`)

    ctx.response.body = { id: instance_id, table: table }
    ctx.response.status = Status.Created
  },
  // TODO: センサーデータの追加
  add_sensor_value(ctx: RouterContext) {
    const { id, value, aaa } = helpers.getQuery(ctx, { mergeParams: true })
    ctx.response.body = `add sensor data: ${id} value: ${value} aaa: ${aaa}`
  },
  get_sensor_data(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true })
    ctx.response.body = `Get sensor data: ${id}`
  },

  getAll(ctx: RouterContext) {
    ctx.response.body = 'Get All sensor data'
  },

  //   // センサー側から設定の変更
  //   update(ctx: RouterContext) {
  //     const { id } = helpers.getQuery(ctx, { mergeParams: true })
  //     ctx.response.body = `Update Book By ID: ${id}`
  //   },

  //   delete(ctx: RouterContext) {
  //     const { id } = helpers.getQuery(ctx, { mergeParams: true })
  //     ctx.response.body = `Delete Book By ID: ${id}`
  //   },
}
