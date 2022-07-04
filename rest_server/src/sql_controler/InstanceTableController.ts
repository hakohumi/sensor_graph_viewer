// データベースの中のインスタンスIDを管理するクラス
import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'

type InstanceID = number

export class InstanceIdTableController {
  // TODO: テーブルごとに、SQLの操作を抽象化したInterfaceを実装したテーブルコントローラークラスを作成する

  // TODO: データベースチェック
  // TODO: データベース内のInstanceIDに重複がないかの確認
  static checkInstanceTable(db: DB): InstanceID[] {
    const isExistInstanceTable = db
      .query<[InstanceID]>(
        `SELECT COUNT(*) FROM sqlite_master WHERE TYPE='table' AND name='instances';`
      )
      .flat()[0]

    if (isExistInstanceTable == 0) {
      console.log(`"instances" table is not exist. create table.`)

      db.query(
        `CREATE TABLE IF NOT EXISTS instances(id INTEGER PRIMARY KEY AUTOINCREMENT, instance_id INT)`
      )
    }

    const instance_id_list = db
      .query<[InstanceID]>(`select * from instances`)
      .flat()

    return instance_id_list
  }

  static checkInstanceTableForDuplicates(instance_id_list: InstanceID[]) {
    if (instance_id_list.length != new Set(instance_id_list).size) {
      console.log(`重複あり`)
      throw new Error(
        'There is an abnormality in the database. Duplicate instance ID.'
      )
    }
    return instance_id_list
  }

  static existInstanceId(db: DB, instance_id: InstanceID): boolean {
    const instance_id_list = db
      .query<[InstanceID]>(`select * from instances`)
      .flat()

    return instance_id_list.includes(instance_id)
  }

  static getInstanceList(db: DB): InstanceID[] | undefined {
    try {
      const instance_id_list = db
        .query<[InstanceID]>(`select instance_id from instances`)
        .flat()
      return instance_id_list
    } catch {
      console.log('cant get instance_id from instances table')
      return undefined
    }
  }

  // TODO: センサーインスタンスの作成
  static addInstance(db: DB) {
    const instance_id_list = this.getInstanceList(db)
    if (instance_id_list == undefined) {
      throw new Error('cant error')
    }

    console.log(`instance_id_list = ${instance_id_list}`)

    let new_instance_id: InstanceID
    if (instance_id_list.length < 1) {
      new_instance_id = 1
      console.log(`instance_id_list is 0`)
    } else {
      new_instance_id = instance_id_list[instance_id_list.length - 1] + 1
    }
    console.log(`add Instance ${new_instance_id}`)

    if (typeof new_instance_id != 'number') {
      throw new Error(`new_instance_id is not number: ${new_instance_id}`)
    }

    // もし追加する時に同じInstanceIDがあるかどうかの確認
    if (new_instance_id in instance_id_list) {
      throw new Error(`すでに同じInstanceIDが存在します。 = ${new_instance_id}`)
    }

    db.query(`INSERT INTO instances(instance_id) VALUES(${new_instance_id})`)

    if (!InstanceIdTableController.existInstanceId(db, new_instance_id)) {
      throw new Error(`add Error: new_instance_id: ${new_instance_id}`)
    }
    console.log(`added instance_id: ${new_instance_id}`)
    return new_instance_id
  }
  static getAllInstanceTable(db: DB): InstanceID[] {
    const instance_list = db.query<[InstanceID]>(
      'select instance_id from instances'
    )
    const result = instance_list.flat().filter((e) => typeof e === 'number')

    console.log(`result =${result}`)

    return result
  }
}
