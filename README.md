# Zulip GitHub Actions

[![GitHub Action badge](https://github.com/zulip/github-actions-zulip/workflows/test-local/badge.svg)](https://github.com/zulip/github-actions-zulip/actions?query=workflow%3Atest-local)

This is a collection of GitHub Actions to interact with [Zulip](https://zulip.com/).

## Actions

- [`zulip/github-actions-zulip/send-message@v1` sends a message to Zulip](./send-message/README.md)

## Contributing

These actions are implemented in TypeScript, see
[`tsconfig.json`](./tsconfig.json) for (generally strict mode defaults)
compiler settings. Use `npm run lint:fix` to autoformat all TypeScript and
Markdown to the expected style. Use `npm run package` to generate
`dist/**/*.js`, never edit those files by hand. Commits should follow [the
Zulip Commit Discipline
guide](https://zulip.readthedocs.io/en/latest/contributing/version-control.html),
which can then be contributed upstream to this repository following the [Zulip
Reviewable Pull Requests
guide](https://zulip.readthedocs.io/en/latest/contributing/reviewable-prs.html)