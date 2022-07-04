import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'
import { InstanceIdTableController } from './InstanceTableController.ts'

type InstanceID = number

export class SqlController implements InstanceIdTableController {
  constructor(readonly db: DB) {
    const instance_id_list = this.checkInstanceTable()

    for (const instance_id of instance_id_list) {
      this.checkInstanceDataTable(instance_id)
    }
  }

  checkInstanceDataTable(instance_id: InstanceID) {
    const isExistInstanceDataTable = this.db
      .query<[InstanceID]>(
        `SELECT COUNT(*) FROM sqlite_master WHERE TYPE='table' AND name='instance_id_${instance_id}';`
      )
      .flat()[0]

    if (isExistInstanceDataTable == 0) {
      console.log(`instance_id_${isExistInstanceDataTable} table is not exist. create table.`)

      this.db.query(
        `CREATE TABLE IF NOT EXISTS instance_id_${instance_id}(id INTEGER PRIMARY KEY AUTOINCREMENT, value INT)`
      )
    }
  }

  // TODO: テーブルごとに、SQLの操作を抽象化したInterfaceを実装したテーブルコントローラークラスを作成する

  // TODO: データベースチェック
  // TODO: データベース内のInstanceIDに重複がないかの確認
  checkInstanceTable(): InstanceID[] {
    const instance_id_list = this.db
      .query<[number]>(`select instance_id from instances`)
      .flat()

    if (instance_id_list.length != new Set(instance_id_list).size) {
      console.log(`重複あり`)
      throw new Error(
        'There is an abnormality in the database. Duplicate instance ID.'
      )
    }
    return instance_id_list
  }

  getSensorData(instance_id: InstanceID): InstanceID[] | undefined {
    // TODO: データがない場合
    let values: InstanceID[]
    try {
      values = this.db

        .query<[InstanceID]>(`select value from instance_id_${instance_id}`)
        .flat()
    } catch {
      console.log('not get data')
      return undefined
    }

    return values
  }

  close() {
    this.db.close()
  }

  getAllData() {
    console.log(`getAllData`)

    const instance_id_list = InstanceIdTableController.getInstanceList(this.db)

    if (instance_id_list == undefined) {
      throw new Error('cant get all data')
    }

    return instance_id_list.map((id) => {
      if (!InstanceIdTableController.existInstance(this.db, id)) {
        return { id, value: {} }
      }
      console.log(`id = ${id}`)
      const value = this.db
        .query<[number]>(`select value from instance_id_${id}`)
        .flat()
      return { id, value }
    })
  }
}
