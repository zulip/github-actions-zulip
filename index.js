import { error, getInput, info, setFailed } from '@actions/core'
import zulipInit from 'zulip-js'

const allNumericRegex = /^[0-9]+$/

async function run () {
  const username = getInput('username', { required: true })
  const apiKey = getInput('api-key', { required: false })
  const password = getInput('password', { required: false })
  const realm = getInput('organization-url', { required: true })
  let to = getInput('to', { required: true })
  const type = getInput('type', { required: true })
  const topic = getInput('topic', { required: false })
  const content = getInput('content', { required: true })
  const initialConfig = {
    username,
    realm
  }
  const config = {}
  if (apiKey) {
    Object.assign(config, initialConfig, { apiKey })
  } else if (password) {
    Object.assign(config, initialConfig, { password })
  } else {
    setFailed('api-key or password is mandatory in order to interact with the Zulip API.')
    return
  }
  if (type === 'private') {
    if (to) {
      to = to.split(',')
      const containsUserIds = to.every((item) => item.match(allNumericRegex))
      if (containsUserIds) {
        to = to.map((item) => parseInt(item))
      }
    }
  } else if (type === 'stream') {
    if (!topic) {
      setFailed('topic is mandatory when type is "stream".')
      return
    }
    if (to.match(allNumericRegex)) {
      to = parseInt(to)
    }
  } else {
    setFailed('type must be one of: private, stream.')
    return
  }
  try {
    const client = await zulipInit(config)
    // Send a message
    const params = {
      to,
      type,
      topic,
      content
    }
    const response = await client.messages.send(params)
    if (response.result === 'success') {
      // OK!
      info(`Message successfully send with id: ${response.id}`)
    } else {
      error(new Error(`${response.code}: ${response.msg}`))
    }
  } catch (error) {
    setFailed(error)
  }
}

;(async () => {
  await run()
})()
