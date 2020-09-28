# app-fe


## 使用说明

克隆到本地后，执行命令行终端，定位到当前项目目录，执行以下步骤：

### 1.  安装依赖包  
```bash
npm  i
```

### 2.  开启开发环境

```bash
npm run dev
```

### 3. 生产编译导出

```bash
npm run prod
```
运行后浏览器访问 `http://localhost` ，浏览需要导出的页面，会在项目根目录中生成html文件夹,浏览过的文件会压缩编译后放置在其中。对应的静态资源会在项目根目录下的static中。复制statice到html文件夹，打包html文件夹提供给后端开发


## 自定义配置

如果需要自定义本地配置，可在当前项目目录下创建一个名为`config.dev.js`的文件，
文件内容参考`config.js`，此配置会优先于`config.js`



