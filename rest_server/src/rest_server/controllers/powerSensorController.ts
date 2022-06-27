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
    console.log('create_sensor_instance')

    const a = ctx.request.body
    console.log(`create sensor ${a.toString}`)

    const instance_id = database.addInstance()
    console.log(`Instance_id ${instance_id}`)

    ctx.response.body = { id: instance_id }
    ctx.response.status = Status.Created
  },

  get_sensor_instance(ctx: RouterContext) {
    console.log('get_sensor_instance')
    const table = database.getAllInstanceTable()
    console.log(`table ${table}`)
    ctx.response.body = { instance_table: table }
  },

  // TODO: センサーデータの追加
  async add_sensor_value(ctx: RouterContext) {
    const { id, value, aaa } = helpers.getQuery(ctx, { mergeParams: true })
    const request_body = await ctx.request.body().value
    console.log(`request body : ${typeof request_body}`)

    // text/plainの場合
    if (typeof request_body == 'string') {
      database.addData(Number(id), Number(value))
      ctx.response.body = `add sensor data: ${id} value: ${value} aaa: ${aaa}`
    } else if (typeof request_body == 'object') {
      // application/jsonの場合
      console.log(` ${Object.entries(request_body)}`)
      if ('id' in request_body && 'value' in request_body) {
        ctx.response.body = `add sensor data: ${id} value: ${value}`
        database.addData(Number(id), Number(value))
        ctx.response.body = { id, value }
        ctx.response.status = Status.Created
      }

      ctx.response.body = { id }
      ctx.response.status = Status.BadRequest
    } else {
      ctx.response.body = { id }
      ctx.response.status = Status.BadRequest
    }
  },
  get_sensor_data(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true })
    database.getData(Number(id))
    ctx.response.body = `Get sensor data: ${id} value: `
  },

  getAll(ctx: RouterContext) {
    const all_data = database.getAllData()
    ctx.response.body = `Get All sensor data: ${all_data}`
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
