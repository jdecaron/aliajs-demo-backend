import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Redis from 'ioredis'

const clients = {} as any
function redis() {
  return clients.client2 || clients.client1
}

try {
  // @ts-ignore
  clients.client1 = new Redis(process.env.REDIS_URL)
} catch (error) {}

const app = new Hono()

app.use('/*', cors())

app.get('/counter', async (c) => {
    await redis().rpush(c.req.query().hash, c.req.query().counter)
    return c.json({})
})

app.get('/quit-client-1', async (c) => {
    await clients.client1.quit()
    return c.json({})
})

app.get('/update-client-2', async (c) => {
    // @ts-ignore
    clients.client2 = new Redis(`redis://${c.req.query().host}:6379`)
    return c.json({})
})

serve({
  fetch: app.fetch,
  // @ts-ignore
  port: process.env.PORT || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
