import { isBrowserOk } from './util';
import Road from './component/Road';
import Car, { addRoundedRect, defaultCar } from './Car';
import Intersections from './component/Intersections';
import color from './color';
import roadModel from './component/Model';
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

const TotalCars = 50;
const Speed = 2;
const ProbsH = [0.4,0.1,0.4,0.1];
// const ProbsV = [0.2,0.3,0.2,0.3];
const ProbsV = [0.4,0.1,0.4,0.1];
let Probs = ProbsH;

addRoundedRect(ctx);

// 检测canvas支持虚线 dash
if (!ctx.setLineDash) {
  ctx.setLineDash = function() {
    console.log('browser not supported for dashed lines');
  };
}

// 设置canvas宽高
let w = document.documentElement.clientWidth,
  h = document.documentElement.clientHeight;
// canvas.style.transformOrigin = '0 0';
// canvas.style.transform = 'scale(0.5,0.5)';
canvas.width = w;
canvas.height = h;

document.getElementById('traffic-light').style.top = `${h / 2 - 100}px`;
document.getElementById('traffic-light').style.left = `${w / 2 - 160}px`;

let roads = [],
  intersections_arr = [],
  cars = [];

const RoadConfigs = [
  {
    x: 0,
    y: h / 2 - 40,
    width: w,
    height: 80,
    direction: 'h',
    num: 2,
    carNum: 0
  },
  {
    x: w / 2 - 40,
    y: 0,
    width: 80,
    height: h,
    direction: 'v',
    num: 2,
    carNum: 0
  }
];

// 初始化
function init() {
  //Launch Cars
  cars = [];
  roads = [];
  intersections_arr = [];

  // const roadTotal = roadConfig.length;

  // 生成car
  const car_no = TotalCars;
  for (let i = 0; i < car_no; i++) {
    let car = new Car();
    car.randomizeStartPoint(RoadConfigs, Probs);
    cars.push(car);
  }

  // 生成road
  roads = RoadConfigs.map(config => new Road(config));

  // 生成路口
  intersections_arr = Intersections(RoadConfigs);
}

// 绘制场景
function drawscene() {
  // 清除画布
  ctx.clearRect(0, 0, w, h);

  // 底图
  ctx.fillStyle = '#4DBB4C';
  ctx.fillRect(0, 0, w, h);

  // 道路
  roads.forEach(road => {
    road.draw(ctx);
  });

  // 路口
  intersections_arr.forEach(intersection => {
    intersection.setTraffic(roadModel.greenH);
    intersection.draw(ctx);
  });

  // 车辆
  drive_cars();

  countCars();
}

// 移动车辆
function drive_cars() {
  const carCount = cars.length;
  for (var i = 0; i < carCount; i++) {
    var c = cars[i];
    // 控制速度
    c.s = Speed;
    // c.start(Speed);
    if (c.d == 'e') {
      for (var l = 0; l < carCount; l++) {
        var c2 = cars[l];
        var dc = c.check_distance(c2, 'x');
        if (dc == true) {
          // 车辆停止
          c.s = 0;
          // c.stop();
          // 两车道，车辆放置到较少车辆车道
          if (inter.height === 80) {
            for (var k = 0; k < intersections_arr.length; k++) {
              var inter = intersections_arr[k];
              if (inter.y + inter.height > c.y && inter.y < c.y) {
                var lc = 0;
                var ld = 0;
                for (var v = 0; v < carCount; v++) {
                  if (
                    cars[v].y == inter.y + 44 &&
                    cars[v].x < inter.x &&
                    cars[v].s == 0
                  ) {
                    lc++;
                  }
                  if (
                    cars[v].y == c.y &&
                    cars[v].x < inter.x &&
                    cars[v].s == 0
                  ) {
                    ld++;
                  }
                }
                if (ld - 2 > lc) {
                  c.y = inter.y + 44;
                }
              }
            }
          }
        } else {
          // 车辆继续前进
          var counter = 0;
          for (var k = 0; k < intersections_arr.length; k++) {
            var inter = intersections_arr[k];
            if (c.check_inter(inter, 'x')) {
              counter++;
              if (inter.left == color.traffic.red) {
                //red
                // c.s = 0;
                c.stop();
              } else {
                //green
                // c.s = defaultCar.s;
                c.start(Speed);
                //改变方向
                c.gen_dir(inter);
              }
            }
          }
          if (counter == 0) {
            //car past intersection reset random generator
            c.dd = false;
          }
        }
      }
      // 车辆已驶出屏幕，重置位置
      if (c.x + 26 >= canvas.width) {
        //reposition car
        // c.x = -1 * defaultCar.l;
        c.randomizeStartPoint(RoadConfigs, Probs);
        c.exitNum ++;
      }
      c.x += c.s;
    } else if (c.d == 'n') {
      for (var l = 0; l < cars.length; l++) {
        var c2 = cars[l];
        var dc = c.check_distance(c2, '-y');
        if (dc == true) {
          // c.s = 0;
          c.stop();
          if (inter.width == 80) {
            for (var k = 0; k < intersections_arr.length; k++) {
              var inter = intersections_arr[k];
              if (inter.x + inter.width > c.x && inter.x < c.x) {
                //this is road
                var lc = 0;
                var ld = 0;
                for (var v = 0; v < cars.length; v++) {
                  if (
                    cars[v].x == inter.x + 55 &&
                    cars[v].y < inter.y &&
                    cars[v].s == 0
                  ) {
                    lc++;
                  }
                  if (
                    cars[v].x == c.x &&
                    cars[v].y < inter.y &&
                    cars[v].s == 0
                  ) {
                    ld++;
                  }
                }
                if (ld - 2 > lc) {
                  c.x = inter.x + 55;
                }
              }
            }
          }
        } else {
          var counter = 0;
          for (var k = 0; k < intersections_arr.length; k++) {
            var inter = intersections_arr[k];
            if (c.check_inter(inter, '-y')) {
              counter++;
              if (inter.bottom == color.traffic.red) {
                //red
                // c.s = 0;
                c.stop();
              } else {
                //green
                // c.s = defaultCar.s;
                c.start(Speed);
                //figure dir
                c.gen_dir(inter);
              }
            }
          }
          if (counter == 0) {
            //car past intersection reset random generator
            c.dd = false;
          }
        }
      }
      if (c.y + 26 <= 0) {
        //reposition car
        // c.y = h + defaultCar.l;
        c.randomizeStartPoint(RoadConfigs, Probs);
        c.exitNum ++;
      }
      c.y -= c.s;
    } else if (c.d == 's') {
      for (var l = 0; l < cars.length; l++) {
        var c2 = cars[l];
        var dc = c.check_distance(c2, 'y');
        if (dc == true) {
          // c.s = 0;
          c.stop();
          if (inter.width == 80) {
            for (var k = 0; k < intersections_arr.length; k++) {
              var inter = intersections_arr[k];
              if (inter.x + inter.width > c.x && inter.x < c.x) {
                //this is road
                var lc = 0;
                var ld = 0;
                for (var v = 0; v < cars.length; v++) {
                  if (
                    cars[v].x == inter.x + 36 &&
                    cars[v].y < inter.y &&
                    cars[v].s == 0
                  ) {
                    lc++;
                  }
                  if (
                    cars[v].x == c.x &&
                    cars[v].y < inter.y &&
                    cars[v].s == 0
                  ) {
                    ld++;
                  }
                }
                if (ld - 1 > lc) {
                  c.x = inter.x + 36;
                }
              }
            }
          }
        } else {
          var counter = 0;
          for (var k = 0; k < intersections_arr.length; k++) {
            var inter = intersections_arr[k];
            if (c.check_inter(inter, 'y')) {
              counter++;
              if (inter.top == color.traffic.red) {
                //red
                // c.s = 0;
                c.stop();
              } else {
                //green
                // c.s = defaultCar.s;
                c.start(Speed);
                //figure dir
                c.gen_dir(inter);
              }
            }
          }
          if (counter == 0) {
            //car past intersection reset random generator
            c.dd = false;
          }
        }
      }
      if (c.y - 26 >= h) {
        //reposition car
        // c.y = -1 * defaultCar.l;
        c.randomizeStartPoint(RoadConfigs, Probs);
        c.exitNum ++;
      }
      c.y += c.s;
    } else if (c.d == 'w') {
      for (var l = 0; l < cars.length; l++) {
        var c2 = cars[l];
        var dc = c.check_distance(c2, '-x');
        if (dc == true) {
          // c.s = 0;
          c.stop();
          if (inter.height == 80) {
            for (var k = 0; k < intersections_arr.length; k++) {
              var inter = intersections_arr[k];
              if (inter.y + inter.height > c.y && inter.y < c.y) {
                //this is road
                var lc = 0;
                var ld = 0;
                for (var v = 0; v < cars.length; v++) {
                  if (
                    cars[v].y == inter.y + 22 &&
                    cars[v].x > inter.x &&
                    cars[v].s == 0
                  ) {
                    lc++;
                  }
                  if (
                    cars[v].y == c.y &&
                    cars[v].x > inter.x &&
                    cars[v].s == 0
                  ) {
                    ld++;
                  }
                }
                if (ld - 2 > lc) {
                  c.y = inter.y + 22;
                }
              }
            }
          }
        } else {
          var counter = 0;
          for (var k = 0; k < intersections_arr.length; k++) {
            var inter = intersections_arr[k];
            if (c.check_inter(inter, '-x')) {
              counter++;
              if (inter.right == color.traffic.red) {
                //red
                // c.s = 0;
                c.stop();
              } else {
                //green
                // c.s = defaultCar.s;
                c.start(Speed);
                //figure dir
                c.gen_dir(inter);
              }
            }
          }
          if (counter == 0) {
            //car past intersection reset random generator
            c.dd = false;
          }
        }
      }
      // 车辆离开视图
      if (c.x + 26 <= 0) {
        //reposition car
        // c.x = w + defaultCar.l;
        c.randomizeStartPoint(RoadConfigs, Probs);
        c.exitNum ++;
      }
      c.x -= c.s;
    }
    
    // console.log(roadConfig)
    cars[i] = c
    genRoadCarNum()
    // console.log(cars, roadConfig)
    c.draw(ctx);
  }
}

function genRoadCarNum() {
  
  let vCarNum = 0;
  let hCarNum = 0;
  cars.forEach(car => {
    if (['n', 's'].includes(car.d)) {
      vCarNum += 1;
    } else {
      hCarNum += 1;
      
    }
  })

  RoadConfigs[1].carNum = vCarNum;
  RoadConfigs[0].carNum = hCarNum;
}

// 控制车辆开始运动
let isPlay = false,
  btnEl = document.getElementById('play');
let startTime = 0;
btnEl.onclick = () => {
  if(!isPlay) {
    startTime = new Date().getTime();
  }
  isPlay = !isPlay;
  btnEl.innerHTML = isPlay ? 'pause' : 'play';
  isPlay && animloop();
};

// rAF方案保证渲染能力
function animloop() {
  drawscene();
  if (isPlay) {
    requestAnimFrame(animloop);
  }
}

init();
// drawscene();
animloop();

setInterval(()=>{
  -- roadModel.remain;
  if (roadModel.remain === 0) { //剩余时间到，改变红灯状态
    roadModel.switchState();
  }
  roadModel.showInfo();
}, 1000);

setInterval(()=>{
   if(Probs === ProbsH) {
    Probs = ProbsV;
   }
   else {
    Probs = ProbsH;
   }
}, 60000);

function countCars(){
  roadModel.numE = 0;
  roadModel.numW = 0;
  roadModel.numS = 0;
  roadModel.numN = 0;
  var totalExistNum = 0;
  var totalWaitingTime = 0;
  var totalWaitingNum = 0;
  for(const car of cars) {
    if (car.d === 'e' && car.x < w/2) { //西向东
      roadModel.numE ++;
    }
    else if (car.d === 'w' && car.x > w/2) { //东向西
      roadModel.numW ++;
    }
    else if (car.d === 's' && car.y < h/2) { //北向南
      roadModel.numS ++;
    }
    else if (car.d === 'n' && car.y > h/2) { //南向北
      roadModel.numN ++;
    }
    totalExistNum += car.exitNum;
    totalWaitingTime += car.waitingTime;
    totalWaitingNum += car.waitingNum;
  }
  const totalTimeMs = new Date().getTime() - startTime;
  roadModel.averageWaitingTime = totalWaitingTime/totalWaitingNum;
  roadModel.throughputNum = totalExistNum;
  roadModel.throughput = totalExistNum * 1000/totalTimeMs;
  roadModel.totalTime = Math.round(totalTimeMs/1000);
  if(roadModel.totalTime >= 240) {
    isPlay = false;
  }
}
