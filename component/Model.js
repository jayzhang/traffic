
var MaxGreenTime = 100; //绿灯最大时间
var MinGreenTime = 2;  //绿灯最小时间
var PopSpeed = 2; // 单方向平均每秒种可以开走多少辆车
// var PushSpeed = 0.5; // 单方向每秒开进多少辆车
const controlPolicy = true;
const normalGreenTime = 15;

class RoadModel {
  constructor() {
    this.numE = 0; 
    this.numW = 0; 
    this.numS = 0; 
    this.numN = 0; 
    this.greenH = true; //第一、三车道是绿灯
    this.remain = MinGreenTime; //第一、三车道红绿灯剩余时间
    this.greenTime = MinGreenTime; //第一、三车道的绿灯时间设置
    this.redTime = MinGreenTime; //// 第一、三车道的红灯时间设置
    this.throughputRate = 0;  //吞吐率
    this.throughput = 0;  //吞吐量
    this.averageWaitingTime = 0;  //平均等待时间
    this.totalTime = 0;
  }
  //红绿灯时间到，切换状态
  switchState(){
    if (this.greenH) {
      var numV = Math.max(this.numS,this.numN);
      var needTime = numV / PopSpeed;
      var result = controlPolicy ? this.rangedTime(needTime) : normalGreenTime;
      this.redTime = result;
      this.remain = this.redTime;
      console.log(`垂直方向最大车辆数:${numV}, 设置垂直方向绿灯时间:${this.redTime}`);
    } else {
      var numH = Math.max(this.numE,this.numW);
      var needTime = numH / PopSpeed;
      var result = controlPolicy ? this.rangedTime(needTime) : normalGreenTime;
      this.greenTime = result;
      this.remain = this.greenTime;
      console.log(`水平方向最大车辆数:${numH}, 设置水平方向绿灯时间:${this.greenTime}`);
    }
    this.greenH = !this.greenH;
  }
  rangedTime(needTime){
    needTime = Math.round(needTime);
    if(needTime < MinGreenTime) return MinGreenTime;
    if(needTime > MaxGreenTime) return MaxGreenTime;
    return needTime
  }

  getNumH() {
    return Math.max(this.numE, this.numW);
  }
  getNumV() {
    return Math.max(this.numN, this.numS);
  }
  showInfo() {
    const showObj = {
      "系统运行时间(秒)": roadModel.totalTime,
      "1号车道信号灯": roadModel.greenH ? '<font color="green">绿灯</font>':'<font color="red">红灯</font>',
      "<b>剩余时间(秒)</b>": `<b>${roadModel.remain}</b>`,
      "<b>配置时间(秒)</b>": `<b>${roadModel.greenH ? roadModel.greenTime:roadModel.redTime}</b>`,
      "水平/垂直待行车辆数": `${roadModel.getNumH()}/${roadModel.getNumV()}`,
      "吞吐率(辆/分钟)": `${(roadModel.throughput*60).toFixed(3)}`,
      "吞吐量(辆)": `${roadModel.throughputNum}`,
      "平均停车等待时间(秒)":  `${(roadModel.averageWaitingTime/1000).toFixed(3)}`,
    };
    document.getElementById('static').innerHTML = Object.keys(showObj).map(key => {
      return `<p>${key}：${showObj[key]}</p>`
    }).join('')

    document.getElementById('traffic-light').innerHTML = `<span>剩余时间：${roadModel.remain}</span>`
    
    console.log(showObj);
    return showObj;
  }
}

const roadModel = new RoadModel();

export default roadModel;