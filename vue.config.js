module.exports={
    publicPath:'./',  //配置根目录，上传访问目的的时候用到，比如www.sina.com/china/,这个/china/就是要额外配置的，写成publicPath:'/china/'
    outputDir:'dist',  //构建输出目录
    //assetsDir:"assets",  //静态资源目录（js,css,image）
    lintOnSave:false,//是否开启eslint检测,false不开启，有效值：true || false
    productionSourceMap:false,//生成环境下面开启sourceMap支持断点调试
    devServer:{
        open:true, //是否启动打开浏览器
        host:"localhost",//主机，0.0.0.0支持局域网地址，可以用真机测试
        port:8080, //端口
        https:false,//是否启动https
        // productionSourceMap:false,//配置生产环境下面的source-map
        //配置跨域代理
        proxy:{
            "/api":{
                target:"https://api.cc.163.com",
                changeOrigin:true,
                ws: true,
                pathRewrite:{
                    '^/api':""
                }
            },
            "/channel":{
                target:"https://cc.163.com/live/channel",
                changeOrigin:true,
                ws: true,
                pathRewrite:{
                    '^/channel':""
                }
            }
        }
    }

};
