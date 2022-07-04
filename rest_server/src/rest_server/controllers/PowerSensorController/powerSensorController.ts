import {
  RouterContext,
  helpers,
  Status,
} from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'
import { InstanceIdTableController } from './InstanceTableController.ts'
import { SqlController } from '../../../sql_controler/sql_controller.ts'
import { ValueTableController } from './ValueTableController.ts'

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
    if (!InstanceIdTableController.existInstanceId(database.db, Number(id))) {
      ctx.response.body = `not instance ${id}`
      ctx.response.status = Status.BadRequest
      return
    }
    const values = ValueTableController.getSensorData(database.db, Number(id))

    if (values == undefined) {
      throw new Error('cant pass here')
    }

    ctx.response.body = { id, values }
    return
  },

  getAll(ctx: RouterContext) {
    console.log(`getAllData`)

    const instance_id_list = InstanceIdTableController.getInstanceList(
      database.db
    )

    if (instance_id_list == undefined) {
      throw new Error('cant get all data')
    }

    const all_data = instance_id_list.map((id) => {
      if (!InstanceIdTableController.existInstanceId(database.db, id)) {
        return { id, value: {} }
      }

      const value = database.db
        .query<[number]>(`select value from instance_id_${id}`)
        .flat()
      return { id, value }
    })

    // TODO: ここで各センサーのデータを組み立てる
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
