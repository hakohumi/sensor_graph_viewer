import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'
import { InstanceIdTableController } from './InstanceTableController.ts'

type InstanceID = number

export class SqlController {
  constructor(readonly db: DB) {
    const instance_id_list = InstanceIdTableController.checkInstanceTable(db)

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
      console.log(
        `"instance_id_${isExistInstanceDataTable}" table is not exist. create table.`
      )

      this.db.query(
        `CREATE TABLE IF NOT EXISTS instance_id_${instance_id}(id INTEGER PRIMARY KEY AUTOINCREMENT, value INT)`
      )
    }
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

}
