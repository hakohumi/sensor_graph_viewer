import { Router, RouterContext } from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { booksController } from './controllers/booksController.ts'
const router = new Router()

router.get('/', (ctx: RouterContext) => {
  ctx.response.body = 'Hello World!'
})

router.get('/api/v1/books', booksController.getAll)
router.get('/api/v1/books/:id', booksController.get)
router.post('/api/v1/books', booksController.create)
router.put('/api/v1/books/:id', booksController.update)
router.delete('/api/v1/books/:id', booksController.delete)

export { router }
