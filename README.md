# str-argv

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/str-argv/tests.yml?label=Test&logo=github&style=flat-square&branch=main)](https://github.com/ajiho/str-argv/actions/workflows/tests.yml)
[![codecov](https://codecov.io/github/ajiho/str-argv/graph/badge.svg?token=YR846BMB6Y)](https://codecov.io/github/ajiho/str-argv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ajiho/str-argv/blob/main/LICENSE)

---

简体中文 | [English](./README.en.md)

`str-argv` 是一个轻量、零依赖的命令字符串 → `argv` 数组解析器。

支持引号、转义、空参数以及引号与普通内容的组合。

## 安装

```bash
npm i str-argv
```

## 使用

```js
import strArgv from "str-argv";

strArgv('--name "John Doe" --age 18');

// ["--name", "John Doe", "--age", "18"]
```

复杂参数同样支持：

```js
strArgv('run:silent["echo 1"]["echo 2"]');

// ["run:silent[echo 1][echo 2]"]
```

解析结果可以直接作为 CLI 参数使用：

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

`str-argv` 只负责解析参数，不执行命令或调用 Shell。

## 鸣谢

`str-argv` 的设计灵感来自 [string-argv](https://github.com/mccormicka/string-argv)。

感谢 `string-argv` 提供了将命令字符串转换为类似 `process.argv` 参数数组的思路。

`str-argv` 使用状态机实现，以提供更清晰、易维护的解析逻辑。
