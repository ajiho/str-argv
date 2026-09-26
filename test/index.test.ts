import { describe, it, expect } from "vitest";

import strArgv from "../src/index.ts";

describe("strArgv", () => {
  it("应该支持string-argv包的README.md例子", () => {
    const res = strArgv(
      '-testing test -valid=true --quotes "test quotes" "nested \'quotes\'" --key="some value" --title="Peter\'s Friends"',
      "node",
      "testing.js",
    );

    expect(res).toEqual([
      "node",
      "testing.js",
      "-testing",
      "test",
      "-valid=true",
      "--quotes",
      "test quotes",
      "nested 'quotes'",
      "--key=some value",
      "--title=Peter's Friends",
    ]);
  });

  describe("基本参数", () => {
    it("应该解析单个参数", () => {
      expect(strArgv("foo")).toEqual(["foo"]);
    });

    it("应该解析多个参数", () => {
      expect(strArgv("foo bar baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("对于空字符串应该返回空数组", () => {
      expect(strArgv("")).toEqual([]);
    });

    it("对于仅包含空白字符的字符串应该返回空数组", () => {
      expect(strArgv("   \t\n  ")).toEqual([]);
    });

    it("应该去除前后空白字符", () => {
      expect(strArgv("  foo bar  ")).toEqual(["foo", "bar"]);
    });

    it("应该将连续空白字符视为分隔符", () => {
      expect(strArgv("foo    bar\t\tbaz")).toEqual(["foo", "bar", "baz"]);
    });

    it("应该支持不同的空白字符", () => {
      expect(strArgv("foo\tbar\nbaz\rqux")).toEqual(["foo", "bar", "baz", "qux"]);
    });
  });

  describe("带引号的参数", () => {
    it("应该保留双引号内的空格", () => {
      expect(strArgv('"hello world"')).toEqual(["hello world"]);
    });

    it("应该保留单引号内的空格", () => {
      expect(strArgv("'hello world'")).toEqual(["hello world"]);
    });

    it("应该解析多个带引号的参数", () => {
      expect(strArgv('"hello world" foo "bar baz"')).toEqual(["hello world", "foo", "bar baz"]);
    });

    it("应该将空双引号解析为空参数", () => {
      expect(strArgv('""')).toEqual([""]);
    });

    it("应该将空单引号解析为空参数", () => {
      expect(strArgv("''")).toEqual([""]);
    });

    it("应该保留参数之间的空引号参数", () => {
      expect(strArgv('foo "" bar')).toEqual(["foo", "", "bar"]);
    });

    it("应该拼接带引号和不带引号的部分", () => {
      expect(strArgv('foo"bar"baz')).toEqual(["foobarbaz"]);
    });

    it("应该拼接多个带引号的部分", () => {
      expect(strArgv('"foo""bar"')).toEqual(["foobar"]);
    });

    it("应该允许双引号内包含单引号", () => {
      expect(strArgv("\"foo 'bar' baz\"")).toEqual(["foo 'bar' baz"]);
    });

    it("应该允许单引号内包含双引号", () => {
      expect(strArgv("'foo \"bar\" baz'")).toEqual(['foo "bar" baz']);
    });
  });

  describe("转义", () => {
    it("应该转义空格", () => {
      expect(strArgv("hello\\ world")).toEqual(["hello world"]);
    });

    it("应该转义双引号", () => {
      expect(strArgv('\\"foo\\"')).toEqual(['"foo"']);
    });

    it("应该转义单引号", () => {
      expect(strArgv("\\'foo\\'")).toEqual(["'foo'"]);
    });

    it("应该转义反斜杠", () => {
      expect(strArgv("foo\\\\bar")).toEqual(["foo\\bar"]);
    });

    it("应该转义参数之间的空白字符", () => {
      expect(strArgv("foo\\ bar baz")).toEqual(["foo bar", "baz"]);
    });

    it("应该处理双引号内的转义字符", () => {
      expect(strArgv('"foo\\ bar"')).toEqual(["foo bar"]);
    });

    it("应该处理单引号内的转义字符", () => {
      expect(strArgv("'foo\\ bar'")).toEqual(["foo bar"]);
    });

    it("应该保留末尾的反斜杠", () => {
      expect(strArgv("foo\\")).toEqual(["foo\\"]);
    });

    it("应该保留独立的末尾反斜杠", () => {
      expect(strArgv("\\")).toEqual(["\\"]);
    });
  });

  describe("混合引号和转义", () => {
    it("应该一起解析带引号和转义的内容", () => {
      expect(strArgv('foo "bar baz" qux\\ quux')).toEqual(["foo", "bar baz", "qux quux"]);
    });

    it("应该将转义字符与带引号的内容拼接", () => {
      expect(strArgv('foo"bar\\ baz"qux')).toEqual(["foobar bazqux"]);
    });

    it("应该处理双引号内的转义引号", () => {
      expect(strArgv('"hello \\"world\\""')).toEqual(['hello "world"']);
    });

    it("应该处理单引号内的转义引号", () => {
      expect(strArgv("'hello \\'world\\''")).toEqual(["hello 'world'"]);
    });

    it("应该处理混合引号类型", () => {
      expect(strArgv("\"foo\"'bar'")).toEqual(["foobar"]);
    });
  });

  describe("特殊字符", () => {
    it("应该保留标点符号", () => {
      expect(strArgv("foo=bar --name=value --flag")).toEqual(["foo=bar", "--name=value", "--flag"]);
    });

    it("应该保留符号", () => {
      expect(strArgv("@foo #bar $baz %qux &quux")).toEqual([
        "@foo",
        "#bar",
        "$baz",
        "%qux",
        "&quux",
      ]);
    });

    it("应该保留 Unicode 字符", () => {
      expect(strArgv("你好 世界 🚀")).toEqual(["你好", "世界", "🚀"]);
    });

    it("应该保留路径", () => {
      expect(strArgv("src/index.js dist/index.js")).toEqual(["src/index.js", "dist/index.js"]);
    });

    it("应该保留 Windows 路径", () => {
      expect(strArgv(String.raw`C:\Users\foo\project\src`)).toEqual(["C:Usersfooprojectsrc"]);
    });
  });

  describe("空参数", () => {
    it("应该区分空引号参数和没有参数", () => {
      expect(strArgv('foo "" bar')).toEqual(["foo", "", "bar"]);
    });

    it("应该保留由带空白的引号创建的空参数", () => {
      expect(strArgv('" "')).toEqual([" "]);
    });

    it("不应该仅从空白字符创建参数", () => {
      expect(strArgv(" \t \n ")).toEqual([]);
    });

    it("应该处理多个空引号参数", () => {
      expect(strArgv('"" "" ""')).toEqual(["", "", ""]);
    });
  });

  describe("未闭合的引号", () => {
    it("应该在双引号未闭合时抛出异常", () => {
      expect(() => strArgv('"foo')).toThrow('Unclosed quote: "');
    });

    it("应该在单引号未闭合时抛出异常", () => {
      expect(() => strArgv("'foo")).toThrow("Unclosed quote: '");
    });

    it("当引号在参数中间开始时应该抛出异常", () => {
      expect(() => strArgv('foo"bar')).toThrow('Unclosed quote: "');
    });

    it("当带引号的参数包含未闭合引号时应该抛出异常", () => {
      expect(() => strArgv('foo "bar baz')).toThrow('Unclosed quote: "');
    });

    it("即使后面有空白字符，未闭合引号也应该抛出异常", () => {
      expect(() => strArgv('"foo bar baz ')).toThrow('Unclosed quote: "');
    });
  });

  describe("边界情况", () => {
    it("应该处理单个空格", () => {
      expect(strArgv(" ")).toEqual([]);
    });

    it("应该处理单个制表符", () => {
      expect(strArgv("\t")).toEqual([]);
    });

    it("应该处理单个换行符", () => {
      expect(strArgv("\n")).toEqual([]);
    });

    it("应该处理单个带引号的字符", () => {
      expect(strArgv('"a"')).toEqual(["a"]);
    });

    it("应该处理单个转义字符", () => {
      expect(strArgv("\\a")).toEqual(["a"]);
    });

    it("应该处理重复转义", () => {
      expect(strArgv("\\a\\b\\c")).toEqual(["abc"]);
    });

    it("应该处理作为转义参数一部分的引号字符", () => {
      expect(strArgv('foo\\"bar')).toEqual(['foo"bar']);
    });
  });

  describe("类似命令行界面的输入", () => {
    it("应该解析典型命令", () => {
      expect(strArgv('release --tag v1.2.3 --message "release version 1.2.3"')).toEqual([
        "release",
        "--tag",
        "v1.2.3",
        "--message",
        "release version 1.2.3",
      ]);
    });

    it("应该解析包含空格的路径", () => {
      expect(strArgv('build --input "C:\\Program Files\\project" --output dist')).toEqual([
        "build",
        "--input",
        "C:Program Filesproject",
        "--output",
        "dist",
      ]);
    });

    it("应该解析包含单引号值的命令", () => {
      expect(strArgv("git commit -m 'initial release'")).toEqual([
        "git",
        "commit",
        "-m",
        "initial release",
      ]);
    });

    it("应该解析带引号值的标志", () => {
      expect(strArgv('--name="John Doe" --message="hello world"')).toEqual([
        "--name=John Doe",
        "--message=hello world",
      ]);
    });

    it("应该解析包含 URL 的参数", () => {
      expect(strArgv("curl https://example.com/api?foo=bar&baz=qux")).toEqual([
        "curl",
        "https://example.com/api?foo=bar&baz=qux",
      ]);
    });
  });

  describe("返回值", () => {
    it("应该始终返回一个数组", () => {
      expect(Array.isArray(strArgv(""))).toBe(true);
      expect(Array.isArray(strArgv("foo"))).toBe(true);
      expect(Array.isArray(strArgv("foo bar"))).toBe(true);
    });

    it("应该按原始顺序返回参数", () => {
      expect(strArgv("first second third fourth")).toEqual(["first", "second", "third", "fourth"]);
    });
  });

  describe("env 和 file 参数", () => {
    it("应该将 env 作为第一个参数返回", () => {
      expect(strArgv("foo bar", "node")).toEqual(["node", "foo", "bar"]);
    });

    it("应该将 file 作为第二个参数返回", () => {
      expect(strArgv("foo bar", undefined, "app.js")).toEqual(["app.js", "foo", "bar"]);
    });

    it("应该按照 env、file、input 参数的顺序返回", () => {
      expect(strArgv("foo bar", "node", "app.js")).toEqual(["node", "app.js", "foo", "bar"]);
    });

    it("env 和 file 都没有提供时应该只返回解析后的参数", () => {
      expect(strArgv("foo bar")).toEqual(["foo", "bar"]);
    });

    it("env 为空字符串时应该保留空字符串", () => {
      expect(strArgv("foo bar", "")).toEqual(["", "foo", "bar"]);
    });

    it("file 为空字符串时应该保留空字符串", () => {
      expect(strArgv("foo bar", undefined, "")).toEqual(["", "foo", "bar"]);
    });

    it("env 和 file 都为空字符串时应该保留两个空字符串", () => {
      expect(strArgv("foo bar", "", "")).toEqual(["", "", "foo", "bar"]);
    });

    it("input 为空字符串时仍然应该返回 env 和 file", () => {
      expect(strArgv("", "node", "app.js")).toEqual(["node", "app.js"]);
    });

    it("input 只有空白字符时仍然应该返回 env 和 file", () => {
      expect(strArgv("   \t\n  ", "node", "app.js")).toEqual(["node", "app.js"]);
    });
  });

  describe("复杂参数", () => {
    it("应该拼接普通字符和多个带引号的片段", () => {
      expect(strArgv('run:silent["echo 1"]["echo 2"]')).toEqual(["run:silent[echo 1][echo 2]"]);
    });
  });
});
