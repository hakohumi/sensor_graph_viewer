import {
  RouterContext,
  helpers,
  Status,
} from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'
import { InstanceIdTableController } from '../../sql_controler/InstanceTableController.ts'
import { SqlController } from '../../sql_controler/sql_controller.ts'
import { ValueTableController } from '../../sql_controler/ValueTableController.ts'

const database = new SqlController(new DB('sqlite.db'))

export const powerSensorController = {
  // センサーのインスタンスを作成、インスタンスIDを返す
  create_sensor_instance(ctx: RouterContext) {
    console.log('create_sensor_instance')

    const instance_id = InstanceIdTableController.addInstance(database.db)
    console.log(`Instance_id ${instance_id}`)

    ctx.response.body = { id: instance_id }
    ctx.response.status = Status.Created
  },

  get_sensor_instance(ctx: RouterContext) {
    console.log('get_sensor_instance')
    const table = InstanceIdTableController.getAllInstanceTable(database.db)
    console.log(`table ${table}`)
    ctx.response.body = { instance_table: table }
  },

  // TODO: センサーデータの追加
  add_sensor_value(ctx: RouterContext) {
    const { id, value } = helpers.getQuery(ctx, { mergeParams: true })
    ValueTableController.addData(database.db, Number(id), Number(value))

    ctx.response.body = { id, value }
    ctx.response.status = Status.NoContent
  },

  // TODO: あるインスタンスのデータを取得する
  get_sensor_data(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true })
    // TODO: データベースに指定したインスタンスIDが存在するか確認する
    if (!InstanceIdTableController.existInstance(database.db, Number(id))) {
      ctx.response.body = `not instance ${id}`
      ctx.response.status = Status.BadRequest
      return
    }
    const values = database.getSensorData(Number(id))

    if (values == undefined) {
      throw new Error('cant pass here')
    }

    ctx.response.body = { id, values }
    return
  },

  getAll(ctx: RouterContext) {
    const all_data = database.getAllData()
    ctx.response.body = all_data
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
