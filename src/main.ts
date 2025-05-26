import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
// Using Webdis instead, Cloudflare JavaScript runtime needed the "nodejs_compat" compatibility flag
// import Redis from 'ioredis'

// const clients = {} as any
// function redis() {
//   return clients.client2 || clients.client1
// }

// try {
//   // @ts-ignore
//   clients.client1 = new Redis(process.env.REDIS_URL)
// } catch (error) {}

const app = new Hono()

app.use('/*', cors())

app.get('/counter', async (c) => {
    // await redis().rpush(c.req.query().hash, c.req.query().counter)
    await fetch(`${process.env.REDIS_URL}/rpush/${c.req.query().hash}/${c.req.query().counter}`{
      headers: {
        'Authorization': `Bearer ${process.env.REDIS_REST_TOKEN}`,
      },
    })
    return c.json({})
})

// app.get('/quit-client-1', async (c) => {
//     await clients.client1.quit()
//     return c.json({})
// })

app.get('/update-client-2', async (c) => {
    // @ts-ignore
    // clients.client2 = new Redis(`redis://${c.req.query().host}:6379`)
    process.env.REDIS_URL = `http://${c.req.query().host}:7379`
    return c.json({})
})

serve({
  fetch: app.fetch,
  // @ts-ignore
  port: process.env.PORT || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
