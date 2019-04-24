# ucpaas-app

> ucpaas.com

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

新装插件
es语法转意
babel-runtime:"^6.0.0"

300毫秒的处理
fastclick:^1.0.6

es6语法转义
babel-polyfill "^6.2.0"

nginx一些配置文件


upstream mobile {
	    server 172.16.4.241:8080;
}

server {
      listen       8002;
      server_name       localhost;

      location / {
          root   E:\dist;
          index  index.html index.htm;
      }
  location ~ ^/mobile/ {
    proxy_pass http://mobile;
    proxy_redirect off;
      }
}
