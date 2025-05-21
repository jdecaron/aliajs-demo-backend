import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Redis from 'ioredis'

// @ts-ignore
const client = new Redis(process.env.REDIS_URL)

const app = new Hono()

app.use('/*', cors())

app.get('/demo-95d8e9f5', async (c) => {
    await client.set('foo', 'bar')
    return c.json({})
})

serve({
  fetch: app.fetch,
  // @ts-ignore
  port: process.env.PORT || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
