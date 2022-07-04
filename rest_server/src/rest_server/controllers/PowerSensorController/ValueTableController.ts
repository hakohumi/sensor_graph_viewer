import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'

type InstanceID = number

// 各インスタンスのデータテーブルを操作するクラス
export class ValueTableController {
  static addData(db: DB, instance_id: InstanceID, value: number) {
    // センサーデータテーブル
    const value_table_name = `instance_id_${instance_id}`

    db.query(`INSERT INTO ${value_table_name} (value) VALUES(:value)`, {
      value,
    })
  }

  static createDataTable(db: DB, instance_id: InstanceID) {
    const isExistInstanceDataTable = db
      .query<[InstanceID]>(
        `SELECT COUNT(*) FROM sqlite_master WHERE TYPE='table' AND name='instance_id_${instance_id}';`
      )
      .flat()[0]

    if (isExistInstanceDataTable == 0) {
      console.log(
        `"instance_id_${instance_id}" table is not exist. create table.`
      )

      db.query(
        `CREATE TABLE IF NOT EXISTS instance_id_${instance_id}(id INTEGER PRIMARY KEY AUTOINCREMENT, value INT)`
      )
    } else {
      throw new Error(`すでにデータテーブルが存在しています`)
    }
  }
  static checkExistDataTable(db: DB, instance_id: InstanceID) {
    const isExistInstanceDataTable = db
      .query<[InstanceID]>(
        `SELECT COUNT(*) FROM sqlite_master WHERE TYPE='table' AND name='instance_id_${instance_id}';`
      )
      .flat()[0]

    if (isExistInstanceDataTable) {
      return true
    } else {
      return false
    }
  }

  static getSensorData(
    db: DB,
    instance_id: InstanceID
  ): InstanceID[] | undefined {
    // TODO: データがない場合
    let values: InstanceID[]

    if (ValueTableController.checkExistDataTable(db, instance_id)) {
      try {
        values = db
          .query<[InstanceID]>(`select value from instance_id_${instance_id}`)
          .flat()
      } catch {
        console.log('not get data')
        return undefined
      }

      return values
    } else {
      throw new Error('not exist DataTable')
    }
  }
}
