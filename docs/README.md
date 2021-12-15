## 聊聊常见的Asset Chunk Optimization卡顿
<b>项</b>目中使用Webpack的项目，在每次编辑保存时候，总会看到热更新卡顿异常的Asset chunk optimization 9*%...,尤其是当项目大了以后，修改一个简单的css，webpack热更新都很慢。通过观察可以发现大部分的时间都耗在百分之九十(几) Asset Chunk Optimization 这一步上. 这时候对于前端工程师而言，是无比浪费时间(煎熬)的，笔者个人而言，每天编码工作，大量的Control Save(保存)操作据不完全统计至少有几百上千次.目前构建工具而言，前端业内毫无疑问Webpack 占据着绝对统治地位,尤其在现在React Vue等主流组件化框架所建立的工程而言，每天的日常工作需要更改并保存大量的文件，每一次的保存势必要触发热更新，光是一个保存按钮就已经涉及到了Webpack优化的问题了
这个问题也可以简单概括为<b>'webpack单页面，项目较大时，编译热加载缓慢'</b>....进而导致降低开发效率(毫无意义的等待)

我们大概分析下热更新卡顿的原因以及解决思路:

讲到热更新之前，有必要了解下热更新是啥？

热更新,英文全名Hot Module Reloading，缩写为HMR。引用官方文档，热更新是：使得应用在运行状态下，不重载刷新就能更新、增加、移除模块的机制.

1. <b>若</b>是多页应用,问题可能是出在html-webpack-plugin插件上，可以引入另一个插件html-webpack-plugin-for-multihtml测试下速度

 - 1.1 安装html-webpack-plugin-for-multihtml
```
 npm i html-webpack-plugin-for-multihtml--save-dev
```

 - 1.2 更改配置
```
newHtmlWebpackPlugin({ 

 title:'My App',

filename:'assets/admin.html',

multihtmlCache:true// 解决多页打包的关键

}）
```

2. <b>减少不必要</b>的文件监听,加快webpack编译

 - 2.1 优化Loader,优化Loader的文件搜索范围,利用babel-loader缓存参数
 ```
 module.exports = {
    module: {
        noParse: /node_modules\/(jquey|moment|chart\.js)/,
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                include: [resolve('src'), resolve('test')],
                exclude:/node_modules/
            },
        ]
    }
}
```
把Babel编译过的文件缓存起来,下次只需要编译更改过的代码文件即可
```
loader: 'babel-loader?cacheDirectory=ture'
```
    - 2.2 忽略掉一些大的node_modules里面的模块
```
module.exports = {
    module: {
        //这里列出一些模块，根据自己项目去除一些编译的文件
        noParse: /node_modules\/(jquey|moment|chart\.js)/,
    }
}
```
    - 2.3 开发环境中,只编译自己开发的模块和目录

开发环境中，每人负责的都是一部分模块或者组件，所以热更新可以只编译自己当前需要的页面，而没必要把所有的页面全部编译。例如，前端Jack创建一个 selfConfig.js设置需要保存的页面，然后在 webpack 配置中去配置只属于Jack自己需要的页面去编译热更新。

伪代码示例:
```
// selfConfig.js
module.exports = [
    'imScence',
    'mLogin'
];

// webpack.base.conf.js 
// 部分关键代码
const selfConfig = require("./selfConfig");

for (let moduleName of modules) {
    if (!selfConfig.length) {
        devEntries[moduleName] = path.join(resolve('src'), 'modules', moduleName, 'main.js');
    } 
    else {
        if (selfConfig.includes(moduleName)) {
            devEntries[moduleName] = path.join(resolve('src'), 'modules', moduleName, 'main.js');
        }
    }
    //Webpack Entry
    buildEntries[moduleName] = path.join(resolve('src'), 'modules', moduleName, 'main.js');
}
```