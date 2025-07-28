import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:3000`);

serve({
  fetch: app.fetch,
  port: 3000
});