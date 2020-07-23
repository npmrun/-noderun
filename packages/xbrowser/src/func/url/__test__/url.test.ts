import { getQueryByKey } from "../index";

/**
 * 网址参数测试
 */
test("?a=1100&b=200请求a得到1100", () => {
  // https://blog.csdn.net/csu_passer/article/details/105634144
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      search: "?a=1100&b=200",
      hash: "",
    },
  });
  expect(getQueryByKey("a")).toBe("1100");
});

test("?a=100&b=200请求c得到null", () => {
  // https://blog.csdn.net/csu_passer/article/details/105634144
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      search: "?a=100&b=200",
      hash: "",
    },
  });
  expect(getQueryByKey("c")).toBe(null);
});

test("?url=http%3A%2F%2Fwww.baidu.com请求url得到http://www.baidu.com", () => {
  // https://blog.csdn.net/csu_passer/article/details/105634144
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      search: "?url=http%3A%2F%2Fwww.baidu.com",
      hash: "",
    },
  });
  expect(getQueryByKey("url")).toBe("http://www.baidu.com");
});

test("?url=http://www.baidu.com请求url得到http://www.baidu.com", () => {
  // https://blog.csdn.net/csu_passer/article/details/105634144
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      search: "?url=http://www.baidu.com",
      hash: "",
    },
  });
  expect(getQueryByKey("url")).toBe("http://www.baidu.com");
});

test("?url=http://www.baidu.com?a=10", () => {
  // https://blog.csdn.net/csu_passer/article/details/105634144
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      search: "?url=http://www.baidu.com?a=10",
      hash: "",
    },
  });
  expect(getQueryByKey("url")).toBe("http://www.baidu.com?a=10");
});
