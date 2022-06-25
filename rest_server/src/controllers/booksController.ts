import { RouterContext, helpers } from "https://deno.land/x/oak@v6.5.0/mod.ts";

export const booksController = {
  getAll(ctx: RouterContext) {
    ctx.response.body = 'Get All Books'
  },

  get(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `Get Book By ID: ${id}`
  },

  create(ctx: RouterContext) {
    ctx.response.body = 'Create Book'
  },

  update(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `Update Book By ID: ${id}`
  },

  delete(ctx: RouterContext) {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `Delete Book By ID: ${id}`
  }
}