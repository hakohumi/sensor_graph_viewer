// データベースの中のインスタンスIDを管理するクラス
import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'

type InstanceID = number

export class InstanceIdTableController {
  static existInstance(db: DB, instance_id: InstanceID): boolean {
    const instance_id_list = db
      .query<[InstanceID]>(`select instance_id from instances`)
      .flat()

    if (instance_id in instance_id_list) {
      try {
        // TODO: instance_id_〇テーブルが存在しているかの確認(すべての値を取得しているため、遅いかも)
        const _ = db.query(`select value from instance_id_${instance_id}`)
      } catch {
        console.log(`instance_id_${instance_id} table is not exist`)
        return false
      }

      return true
    }

    console.log(`not exist in instance_id_list`)

    return false
  }

  // initInstanceTable(): InstanceID[] {
  //   // センサーインスタンスIDテーブル
  //   this.db.query(
  //     'CREATE TABLE IF NOT EXISTS instances(id INTEGER PRIMARY KEY AUTOINCREMENT, instance_id INTEGER)'
  //   )

  //   this.checkDatabase()

  //   // TODO: すでにテーブルがある場合、各インスタンスごとのテープルもあるか確認する

  //   const instance_id_list: InstanceID[] = []

  //   // instance_id_listの初期化
  //   for (const [instance_id] of this.db.query(
  //     'SELECT instance_id FROM instances'
  //   )) {
  //     console.log(`instance_id: ${instance_id}`)
  //     // nullチェック
  //     if (instance_id == null) {
  //       console.log('instance table is null')
  //       return []
  //     }
  //     if (typeof instance_id == 'number') {
  //       instance_id_list.push(instance_id)
  //     } else {
  //       throw new Error('instance_id is not number.')
  //     }
  //   }

  //   return instance_id_list
  // }

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

    let new_instance_id: InstanceID
    if (instance_id_list.length < 1) {
      new_instance_id = 1
    } else {
      new_instance_id = instance_id_list.slice(-1)[0] + 1
    }
    console.log(`add Instance ${new_instance_id}`)

    // TODO: もし追加する時に同じInstanceIDがあるかどうかの確認
    if (new_instance_id in instance_id_list) {
      throw new Error('cant error')
    }

    db.query('INSERT INTO instances(instance_id) VALUES(?)', [new_instance_id])

    return new_instance_id
  }
  static getAllInstanceTable(db: DB): InstanceID[] {
    const query = db.query('select instance_id from instances')
    const result = query
      .map((e) => {
        if (typeof Number(e) == 'number') {
          return Number(e)
        } else {
          return
        }
      })
      .filter((e) => e != undefined)

    return result as InstanceID[]
  }
}
