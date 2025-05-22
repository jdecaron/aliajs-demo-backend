import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Redis from 'ioredis'

const clients = {}
function redis() {
  return clients.client2 || clients.client1
}

try {
  // @ts-ignore
  clients.client1 = new Redis(process.env.REDIS_URL)
} catch (error) {}

const app = new Hono()

app.use('/*', cors())

app.get('/demo-95d8e9f5', async (c) => {
    await redis().rpush(c.req.query().hash, c.req.query().counter)
    return c.json({})
})

app.get('/demo-update-client2', async (c) => {
  clients.client2 = new Redis(`redis://${c.req.query().host}:6379`)
})

serve({
  fetch: app.fetch,
  // @ts-ignore
  port: process.env.PORT || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
