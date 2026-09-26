# str-argv

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/str-argv/tests.yml?label=Test&logo=github&style=flat-square&branch=main)](https://github.com/ajiho/str-argv/actions/workflows/tests.yml)
[![codecov](https://codecov.io/github/ajiho/str-argv/graph/badge.svg?token=YR846BMB6Y)](https://codecov.io/github/ajiho/str-argv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ajiho/str-argv/blob/main/LICENSE)

---

[简体中文](./README.md) | English

`str-argv` is a lightweight, zero-dependency command string → `argv` array parser.

It supports quotes, escaping, empty arguments, and combinations of quoted and plain content.

## Installation

```bash
npm i str-argv
```

## Usage

```js
import strArgv from "str-argv";

strArgv('--name "John Doe" --age 18');

// ["--name", "John Doe", "--age", "18"]
```

Complex arguments are also supported:

```js
strArgv('run:silent["echo 1"]["echo 2"]');

// ["run:silent[echo 1][echo 2]"]
```

The parsed result can be used directly as CLI arguments:

```js
strArgv('--tag v1.2.3 --message "Release version 1.2.3"', "node", "release.js");

// [
//   "node",
//   "release.js",
//   "--tag",
//   "v1.2.3",
//   "--message",
//   "Release version 1.2.3",
// ]
```

`str-argv` only parses arguments; it does not execute commands or invoke a shell.

## Acknowledgements

`str-argv`'s design was inspired by [string-argv](https://github.com/mccormicka/string-argv).

Thanks to `string-argv` for the idea of converting a command string into a `process.argv`-like argument array.

`str-argv` is implemented using a state machine to provide clearer, more maintainable parsing logic.
