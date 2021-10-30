# 介绍

本项目通过web方式进行模拟十字路口道路拥挤状况，实现红绿灯时长智能调控算法，优化通行吞吐率，提升通行效率。

本项目基于[codepen](https://codepen.io/motorlatitude/pen/grdtj)进行二次开发，定制部分包括：
- 车辆按照指定概率随机从4个车道驶入
- 红绿灯时间按照智能算法动态调整
- 提供单个十字路口的通行效率统计信息

演示效果如下：
![image](https://user-images.githubusercontent.com/1658418/139542773-0f1b6f3a-330a-4347-bc8d-5ce897c8a93c.png)

## 预览

`node`环境，全局安装`parcel`

* `parcel traffic2.0.html` 预览改造完成页面
* `parcel traffic.html` 预览原作者页面


原作者代码在单一JS内，可读性较低，`if`、`for`嵌套深，代码的模块化重构本人正在进行中。
