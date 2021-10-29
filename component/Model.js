
var MaxGreenTime = 500; //绿灯最大时间
var MinGreenTime = 20;  //绿灯最小时间
var PopSpeed = 1; // 单方向平均每秒种可以开走多少辆车
// var PushSpeed = 0.5; // 单方向每秒开进多少辆车

class RoadModel {
  // lightColor = "green"; //第一、三车道的红绿灯颜色状态，为了简化，只保留两种颜色: red,green
  // remainingTimeSec = MinGreenTime; //当前红绿灯的剩余秒数
  // greenTime: MinGreenTime, // 第一、三车道的绿灯时间设置
  // redTime: MinGreenTime, // 第一、三车道的红灯时间设置
  // vehicleNum1: 0, //第一、三车道的车辆数
  // vehicleNum2: 0, //第二、四车道的车辆数
  constructor() {
    this.lightColor = "green"; 
    this.remainingTimeSec = MinGreenTime; 
    this.greenTime = MinGreenTime; 
    this.redTime = MinGreenTime; 
    this.vehicleNum1 = 0; 
    this.vehicleNum2 = 0; 
  }
  //红绿灯时间到，切换状态
  switchState(){
    if (this.lightColor === "green") {
      var needTime = this.vehicleNum2/PopSpeed;
      this.redTime = this.rangedTime(needTime);
      this.lightColor = "red";
      this.remainingTimeSec = this.redTime;
    } else {
      var needTime = this.vehicleNum1/PopSpeed;
      this.greenTime = this.rangedTime(needTime);
      this.lightColor = "green";
      this.remainingTimeSec = this.greenTime;
    }
  }
  rangedTime(needTime){
    if(needTime < MinGreenTime) return MinGreenTime;
    if(needTime > MaxGreenTime) return MaxGreenTime;
    return needTime;
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

}

const roadModel = new RoadModel();

export default roadModel;