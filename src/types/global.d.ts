// 全局API类型声明
interface Window {
  testAPI: {
    testAPI: (msg: string) => void;
  };
}

// 声明全局变量
declare global {
  interface Window {
    testAPI: {
      testAPI: (msg: string) => void;
    };
  }
}

export {};
