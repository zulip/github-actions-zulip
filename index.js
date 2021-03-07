import { error, getInput, info, setFailed } from '@actions/core'
import zulipInit from 'zulip-js'

async function run () {
  const username = getInput('username', { required: true })
  const apiKey = getInput('api-key', { required: false })
  const password = getInput('password', { required: false })
  const realm = getInput('organization-url', { required: true })
  const to = getInput('to', { required: true })
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
      info(`Message successfully send wiht id: ${response.id}`)
    } else {
      error(new Error(`${response.code}: ${response.msg}`))
    }
  } catch (error) {
    setFailed(error)
  }
}

run()
