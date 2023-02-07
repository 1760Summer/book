
### 插件名称：`vk-unicloud-api-time`
### 插件类型：`JSAPI`
### 作者：`VK`
##### 此插件为`vk-unicloud-router`插件的一部分独立出来而形成的。（无依赖）
##### uniCloud云函数路由开发框架研究Q群:`22466457` 如有问题或建议可以在群内讨论。

### 【开箱即用】云函数时间函数（解决时区问题）

##### 解决云函数时区问题导致定时任务在错误时间点执行的问题
```js
/**
 * 获取时间范围
 * @params {Date} date 日期对象 可以指定时间计算节点，默认使用当前时间进行计算
 * @params {Number} targetTimezone 时区 默认东8区 正数代表东 负数代表西
 * 返回的是时间戳(防止时区问题)
 * 返回数据如下：
 {
   todayStart 今日开始时间
   todayEnd   今日结束时间
   today12End 今日上午结束时间
   monthStart 本月开始时间
   monthEnd   本月结束时间
   yearStart  本年开始时间
   yearEnd    本年结束时间
   weekStart  本周开始时间
   weekEnd    本周结束时间
   now        现在的时间点(含月年日时分秒)
   months     本年度每月的开始和结束时间 months[1] 代表1月
 }
 */
getCommonTime(new Date(),targetTimezone);

/**
 * 日期格式化
 * @params {Date || Number} date 需要格式化的时间 （支时间戳）
 */
timeFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
```

### 插件示例版运行步骤

##### 1、上传部署云函数cloudfunctions目录下的`api-time`
##### 2、运行项目即可



### 如有疑问，请加群：22466457 关于插件的问题包教包会！
## 你也可以在评论区发布留言交流心得。