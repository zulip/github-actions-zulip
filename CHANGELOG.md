# Zulip GitHub Action Changelog

## Unreleased

**Breaking changes**

⚠️ Please use `zulip/github-actions-zulip/send-message@v1` instead of `yuzutech/zulip-send-message-action@v0.1.2`.  
If you were using `password` as authentification method, please get an API key through Zulip's web interface and use `api-key` instead.
Finally, `username` field was renamed to `email` to be consistent with Zulip API naming.

_Before_

```yml
- name: Send a stream message
  uses: yuzutech/zulip-send-message-action@v0.1.0
  with:
    username: 'username@example.com'
    api-key: 'abcd1234'
    organization-url: 'https://org.zulipchat.com'
    to: 'social'
    type: 'stream'
    topic: 'Castle'
    content: 'I come not, friends, to steal away your hearts.'
```

_After_

```yml
- name: Send a stream message
  uses: zulip/github-actions-zulip/send-message@v1
  with:
    email: 'username@example.com'
    api-key: 'abcd1234'
    organization-url: 'https://org.zulipchat.com'
    to: 'social'
    type: 'stream'
    topic: 'Castle'
    content: 'I come not, friends, to steal away your hearts.'
```

- Align naming with Zulip API
   * Remove `password` as this authentification method is not recommended (the preferred auth method is via `api-key`)
   * Rename `username` to `email` for consistency
- Transfer the repository to the `@zulip` organization
- Move the "send message action" to a subdirectory

**Improvements**

- Catch unexpected errors to provide better error messages

**Infrastructure**

- Bump `@actions/core` from 1.2.6 to 1.4.0
- Bump `@actions/github` from 4.0.0 to 5.0.0
- Bump `eslint` from 7.21.0 to 7.32.0
- Use a bot account for integration tests

**Documentation**

- Mention that you can format messages using [Zulip Markdown](https://zulip.com/help/format-your-message-using-markdown)
