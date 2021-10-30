
var MaxGreenTime = 100; //绿灯最大时间
var MinGreenTime = 10;  //绿灯最小时间
var PopSpeed = 2; // 单方向平均每秒种可以开走多少辆车
// var PushSpeed = 0.5; // 单方向每秒开进多少辆车

class RoadModel {
  // lightColor = "green"; ，为了简化，只保留两种颜色: red,green
  // remainingTimeSec = MinGreenTime; //当前红绿灯的剩余秒数
  // greenTime: MinGreenTime, // 第一、三车道的绿灯时间设置
  // redTime: MinGreenTime, // 第一、三车道的红灯时间设置
  // vehicleNum1: 0, //第一、三车道的车辆数
  // vehicleNum2: 0, //第二、四车道的车辆数
  constructor() {
    this.numE = 0; 
    this.numW = 0; 
    this.numS = 0; 
    this.numN = 0; 
    this.greenH = true; //第一、三车道是绿灯
    this.remain = MinGreenTime; 
    this.greenTime = MinGreenTime; 
    this.redTime = MinGreenTime; 
  }
  //红绿灯时间到，切换状态
  switchState(){
    if (this.greenH) {
      var numV = Math.max(this.numS,this.numN);
      var needTime = numV /PopSpeed;
      this.redTime = this.rangedTime(needTime);
      this.remain = this.redTime;
      console.log(`垂直方向最大车辆数:${numV}, 设置垂直方向绿灯时间:${this.redTime}`);
    } else {
      var numH = Math.max(this.numE,this.numW);
      var needTime = numH / PopSpeed;
      this.greenTime = this.rangedTime(needTime);
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
  //模拟车辆以一定速度从车道上开走
  // popVehicles() {
  //   if (this.lightColor === "green") {
  //     this.vehicleNum1 -= PopSpeed;
  //     if(this.vehicleNum1 < 0) this.vehicleNum1 = 0;
  //     console.log(`1 --->${PopSpeed}辆车，剩余:${this.vehicleNum1}辆车`);
  //   }
  //   else {
  //     this.vehicleNum2 -= PopSpeed;
  //     if(this.vehicleNum2 < 0) this.vehicleNum2 = 0;
  //     console.log(`2 --->${PopSpeed}辆车，剩余:${this.vehicleNum1}辆车`);
  //   }
  // }
  
  // pushVehicles(){
  //   var pushNum = Math.random() * 2 * PushSpeed * 0.9;
  //   this.vehicleNum1 += pushNum;
  //   console.log(`1 <---${pushNum}辆车，剩余:${this.vehicleNum1}辆车`);
  //   pushNum = Math.random() * 2 * PushSpeed * 0.1;
  //   this.vehicleNum2 += pushNum;
  //   console.log(`2 <---${pushNum}辆车，剩余:${this.vehicleNum2}辆车`);
  // }
  showInfo() {
    const showObj = {
      "1号车道信号灯": roadModel.greenH ? "绿灯":"红灯",
      "剩余/配置时间(秒)": `${roadModel.remain}/${roadModel.greenH ? roadModel.greenTime:roadModel.redTime}`,
      "水平/垂直待行车辆数": `${roadModel.getNumH()}/${roadModel.getNumV()}`,
    };
    document.getElementById('static').innerHTML = Object.keys(showObj).map(key => {
      return `<p>${key}：${showObj[key]}</p>`
    }).join('')
    console.log(showObj);
  }
}

const roadModel = new RoadModel();

export default roadModel;