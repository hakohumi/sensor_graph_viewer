import { DB } from 'https://deno.land/x/sqlite@v3.4.0/mod.ts'
import { InstanceIdTableController } from '../rest_server/controllers/PowerSensorController/InstanceTableController.ts'
import { ValueTableController } from '../rest_server/controllers/PowerSensorController/ValueTableController.ts'

type InstanceID = number

export class SqlController {
  constructor(readonly db: DB) {
    const instance_id_list = InstanceIdTableController.checkInstanceTable(db)

    for (const instance_id of instance_id_list) {
      if (ValueTableController.checkExistDataTable(db, instance_id) == false) {
        throw Error(`not exist data table: instanca_id_${instance_id}`)
      }
    }
  }

  close() {
    this.db.close()
  }
}
