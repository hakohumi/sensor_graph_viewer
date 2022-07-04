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
}
