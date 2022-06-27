import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'

type InstanceID = number

export class SqlController {
  instance_id_list: number[] = [0]

  constructor(readonly db: DB) {
    this.db = db
    this.instance_id_list = this.initInstanceTable()
  }

  existInstance(instance_id: InstanceID): boolean {
    const instance_id_list = this.db
      .query<[number]>(`select instance_id from instances`)
      .flat()

    if (instance_id in instance_id_list) {
      try {
        // TODO: instance_id_〇テーブルが存在しているかの確認(すべての値を取得しているため、遅いかも)
        const _ = this.db.query(`select value from instance_id_${instance_id}`)
      } catch {
        console.log(`instance_id_${instance_id} is not exist`)
        return false
      }

      return true
    }

    console.log(`not exist in instance_id_list`)

    return false
  }

  // TODO: データベースチェック
  // TODO: データベース内のInstanceIDに重複がないかの確認
  checkDatabase() {
    const instance_id_list = this.db
      .query<[number]>(`select instance_id from instances`)
      .flat()

    if (instance_id_list.length != new Set(instance_id_list).size) {
      console.log(`重複あり`)
      throw new Error(
        'There is an abnormality in the database. Duplicate instance ID.'
      )
    }
  }

  initInstanceTable(): InstanceID[] {
    // センサーインスタンスIDテーブル
    this.db.query(
      'CREATE TABLE IF NOT EXISTS instances(id INTEGER PRIMARY KEY AUTOINCREMENT, instance_id INTEGER)'
    )

    this.checkDatabase()

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

  // TODO: センサーインスタンスの作成
  addInstance() {
    let new_instance_id: InstanceID
    if (this.instance_id_list.length < 1) {
      new_instance_id = 1
    } else {
      new_instance_id = this.instance_id_list.slice(-1)[0] + 1
    }
    console.log(`add Instance ${new_instance_id}`)

    // TODO: もし追加する時に同じInstanceIDがあるかどうかの確認
    if (new_instance_id in this.instance_id_list) {
      console.log('jfjdsiojfaiojs')
    }
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
      `CREATE TABLE IF NOT EXISTS instance_id_${instance_id}(id INTEGER PRIMARY KEY AUTOINCREMENT, value INT)`
      // ,[value_table_name]
    )
    console.log(`create value_table_name: ${value_table_name} `)

    this.db.query('INSERT INTO instance_id_1 (value) VALUES(:value)', {
      // value_table_name,
      value,
    })
  }

  getData(instance_id: InstanceID) {
    // TODO: データがない場合
    if (!this.existInstance(instance_id)) {
      console.log('not instance')
      return
    }
    return this.db
      .query<[number]>(`select value from instance_id_${instance_id}`)
      .flat()
  }

  close() {
    this.db.close()
  }

  getAllData() {
    console.log(`getAllData `)
    return this.instance_id_list.map((id) => {
      if (!this.existInstance(id)) {
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
