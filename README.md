# Zulip Send Message Action

[![GitHub Action badge](https://github.com/yuzutech/zulip-send-message-action/workflows/test-local/badge.svg)](https://github.com/yuzutech/zulip-send-message-action/actions?query=workflow%3Atest-local)

This action sends a message to Zulip.

## Inputs

### `username`

**Required** Username used to interact with the Zulip API.

### `api-key`

**Optional** API key used to interact with the Zulip API. Only required if password is not defined.

### `password`

**Optional** Password used to interact with the Zulip API. Only required if api-key is not defined, ignored otherwise.

### `organization-url`

**Required** Zulip organization canonical URL.

### `to`

**Required** For stream messages, either the name or integer ID of the stream. For private messages, either a list containing integer user IDs or a list containing string email addresses.

### `type`

**Required** The type of message to be sent. private for a private message and stream for a stream message. Must be one of: private, stream.

### `topic`

**Optional** The topic of the message. Only required for stream messages (type="stream"), ignored otherwise. Maximum length of 60 characters.

### `content`

**Required** The content of the message. Maximum message size of 10000 bytes.

## Example usage

**Send a stream message**
```yml
- name: Send a stream message
  uses: yuzutech/zulip-send-message-action@v0.10
  with:
    username: 'username@example.com'
    api-key: 'abcd1234'
    organization-url: 'https://org.zulipchat.com'
    to: 'social'
    type: 'stream'
    topic: 'Castle'
    content: 'I come not, friends, to steal away your hearts.'
```

**Send a private message**
```yml
- name: Send a private message
  uses: yuzutech/zulip-send-message-action@v0.10
  with:
    username: 'username@example.com'
    api-key: 'abcd1234'
    organization-url: 'https://org.zulipchat.com'
    to: '9' # user_id
    type: 'private'
    content: 'With mirth and laughter let old wrinkles come.'
```
