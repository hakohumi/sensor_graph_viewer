import { Router, RouterContext } from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { powerSensorController } from './controllers/powerSensorController.ts'
const router = new Router()

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Hello World!'
})

// TODO:
router.get('/api/v1', powerSensorController.getAll)

// TODO: センサーのインスタンスを作成、インスタンスIDを返す
router.post('/api/v1/sensor', powerSensorController.create_sensor_instance)
// センサーのインスタンスを取得
router.get('/api/v1/sensor', powerSensorController.get_sensor_instance)

// TODO: あるインスタンスのデータを取得する
router.get('/api/v1/sensor/:id', powerSensorController.get_sensor_data)

// TODO: センサーデータの追加
router.put('/api/v1/sensor/:id/:value', powerSensorController.add_sensor_value)

// router.get('/api/v1/books', booksController.getAll)
// router.get('/api/v1/books/:id', booksController.get)
// router.post('/api/v1/books', booksController.create)
// router.put('/api/v1/books/:id', booksController.update)
// router.delete('/api/v1/books/:id', booksController.delete)

export { router }
