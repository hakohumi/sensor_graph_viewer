import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'

type InstanceID = number

export class SqlController {
  instance_id_list: number[] = [0]
  constructor(readonly db: DB) {
    this.db = db
    this.instance_id_list = this.initInstanceTable()
  }

  initInstanceTable(): InstanceID[] {
    // センサーインスタンスIDテーブル
    this.db.query(
      'CREATE TABLE IF NOT EXISTS instances(id INTEGER PRIMARY KEY AUTOINCREMENT, instance_id INTEGER)'
    )

    // TODO: すでにテーブルがある場合、各インスタンスごとのテープルもあるか確認する

    const instance_id_list: InstanceID[] = []

    // instance_id_listの初期化
    for (const [instance_id] of this.db.query(
      'SELECT instance_id FROM instances'
    )) {
      console.log(`instance_id: ${instance_id}`)
      // nullチェック
      if (instance_id == null) {
        console.log('instance table is null')
        return []
      }
      if (typeof instance_id == 'number') {
        instance_id_list.push(instance_id)
      } else {
        throw new Error('instance_id is not number.')
      }
    }

    return instance_id_list
  }

  initValueTable() {}

  // センサーインスタンスの作成
  addInstance() {
    const new_instance_id = this.instance_id_list.slice(-1)[0] + 1
    this.instance_id_list.push(new_instance_id)
    this.db.query('INSERT INTO instances(instance_id) VALUES(?)', [
      new_instance_id,
    ])
    return new_instance_id
  }
  getAllInstanceTable(): InstanceID[] {
    const query = this.db.query('select instance_id from instances')
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

  addData(instance_id: InstanceID, value: number) {
    // センサーデータテーブル
    const value_table_name = `instance_id_${instance_id}`
    this.db.query(
      'CREATE TABLE IF NOT EXISTS instance_id_1(id INTEGER PRIMARY KEY AUTOINCREMENT, value INT);'
      // ,[value_table_name]
    )
    console.log(`create value_table_name: ${value_table_name} `)

    this.db.query('INSERT INTO instance_id_1 (value) VALUES(:value)', {
      // value_table_name,
      value,
    })
  }

  getData(instance_id: InstanceID) {
    const value = this.db.query(`select value from instance_id_${instance_id}`)
    for (const a of value) {
      console.log(a)
    }
  }
  close() {
    this.db.close()
  }

  getAllData() {
    console.log(`getAllData `)
    return this.instance_id_list.map((e) => {
      console.log(`e = ${e}`)
      const result = this.db.query<[number]>(
        `select value from instance_id_${e}`
      )
      return
    })
  }
}
