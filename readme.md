### 新建一个包
```
npm run bootstrap
```
### 打测试包
```
npm run dev
```
### 打正式包
```
npm run build
```
### 运行测试用例
```
npm run test
```

### 发布
```
lerna publish
```

### 给某个库安装依赖
`lerna add @noderun/common-util --scope=@noderun/browser-util`
表示只给`@noderun/browser-util`库安装依赖`@noderun/common-util`

> 附录  
[Vue3](http://git.poorman.top/topuser/vue-next)  
[好用的可借鉴的库--手势库](https://segmentfault.com/a/1190000010511484#articleHeader0)  
[好用的可借鉴的库--手势库](https://github.com/any86/any-touch/blob/master/docs/API.md) 
[使用Rollup打包样式文件并添加LiveReload](https://www.w3cplus.com/javascript/learn-rollup-css.html)   