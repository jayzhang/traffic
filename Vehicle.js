const SAFE_DIST = 15;

export class Vehicle {
  constructor() {
    this.x = 0; //水平位置，最左边是0，最右边是屏幕宽度
    this.y = 0; //垂直位置，最上边是0，最下面是屏幕高度
    this.speed = 1; //速度
    this.length = 25; //车辆长度
    this.width = 12; //车辆宽度，当车辆中心点位置是0,0的时候，假设车辆自西向东开，车辆所在矩形的范围是(x-l/2, x+l/2) (y-w/2, y+w/2)
    this.direction = 'e'; // 车辆行驶方向: e,w,s,n
    this.dd = false; //车辆是否已经经过路口
    this.color = '#F5D600';
    this.waitingTime = 0;// 停车等待总时长
    this.waitingNum = 0; // 停车等待次数
    this.exitNum = 0; //驶出次数，用于计算通行流速（一段时间内，所有车的驶出次数）
    this.recentStopStartTime = 0; //最近一次开始等待红灯的时间戳，用于计算当前红灯等待时间
    this.state = 1; // 0-停止 1-开动
  }

  //检测车辆是否与另一辆车碰撞
  isCollision(other) {
    const c1 = this;
    const c2 = other;
    if (c1.direction === c2.direction) {
      const minDist = (c1.length + c2.length)/2 + SAFE_DIST;
      if (c1.x === c2.x) {
        const dist = Math.abs(c1.y, c2.y);
        return dist <= minDist;
      } else if(c1.y === c2.y) {
        const dist = Math.abs(c1.x, c2.x);
        return dist <= minDist;
      }
    }
    return false;
  }

  // 车与路口关系
  isIntersection(inter, axis) {
    let c = this;
    if (axis == 'x') {
      if (inter.height > 40) {
        if (inter.x - c.x > c.length + 8 && inter.x - c.x <= c.length + 25) {
          if (c.y - 80 <= inter.y && c.y + 42 >= inter.y) {
            return true;
          }
        }
      } else {
        if (inter.x - c.x > c.length + 8 && inter.x - c.x <= c.length + 25) {
          if (c.y - 40 <= inter.y && c.y + 42 >= inter.y) {
            return true;
          }
        }
      }
    } else if (axis == '-x') {
      if (inter.height > 40) {
        if (c.x - inter.x > c.length + 8 && c.x - inter.x <= c.length + inter.width + 5) {
          if (c.y - 80 <= inter.y && c.y + 42 >= inter.y) {
            return true;
          }
        }
      } else {
        if (c.x - inter.x > c.length + 8 && c.x - inter.x <= c.length + inter.width + 5) {
          if (c.y - 40 <= inter.y && c.y + 42 >= inter.y) {
            return true;
          }
        }
      }
    } else if (axis == '-y') {
      if (inter.width > 40) {
        if (
          c.y - inter.y > c.length + 8 &&
          c.y - inter.y <= c.length + inter.height + 5
        ) {
          if (c.x - 80 <= inter.x && c.x + 42 >= inter.x) {
            return true;
          }
        }
      } else {
        if (
          c.y - inter.y > c.length + 8 &&
          c.y - inter.y <= c.length + inter.height + 5
        ) {
          if (c.x - 40 <= inter.x && c.x + 42 >= inter.x) {
            return true;
          }
        }
      }
    } else if (axis == 'y') {
      if (inter.width > 40) {
        if (inter.y - c.y > c.length + 8 && inter.y - c.y <= c.length + 27) {
          if (c.x - 80 <= inter.x && c.x + 42 >= inter.x) {
            return true;
          }
        }
      } else {
        if (inter.y - c.y > c.length + 8 && inter.y - c.y <= c.length + 27) {
          if (c.x - 40 <= inter.x && c.x + 42 >= inter.x) {
            return true;
          }
        }
      }
    }
  }

  // 车辆在路口转弯
  gen_dir(inter) {
    let c = this;
    // 车辆已通过路口
    if (c.dd) return;

    var rand_dir = Math.random() * 10;
    var dir = c.direction;
    c.dd = true;
    var rand_no1 = 0,
      rand_no2 = 0;
    if (c.direction == 'e') {
      if (inter.width < 80) {
        rand_no1 = 2;
        rand_no2 = 5;
      } else {
        rand_no1 = 3;
        rand_no2 = 6;
      }
      if (rand_dir < rand_no1) {
        if (inter.roadbottom == true) {  //右转 30% 概率
          var dir = 's';
          c.direction = 's';
          c.x = inter.x + 10;
          c.y = inter.y + inter.height - 27;
        } else {  //直行
          if (inter.roadright == true) {
            var dir = c.direction;
          } else {
            //turn
          }
        }
      } else if (rand_dir > 3 && rand_dir < rand_no2) {
        if (inter.roadtop == true) { //左转 30% 概率
          var dir = 'n';
          c.direction = 'n';
          c.x = inter.x + inter.width - 9;
          c.y = inter.y + c.length + 2;
        } else {  //直行
          if (inter.roadright == true) {
            var dir = c.direction;
          } else {
            //turn
          }
        }
      } else {
        if (inter.roadright == true) { //直行 40% 概率
          var dir = c.direction;
        } else {   //右转
          //turn
          var dir = 's';
          c.direction = 's';
          c.x = inter.x + 10;
          c.y = inter.y + 2;
        }
      }
    } else if (c.direction == 'w') {
      if (inter.width < 80) {
        rand_no1 = 2;
        rand_no2 = 5;
      } else {
        rand_no1 = 3;
        rand_no2 = 6;
      }
      if (rand_dir < rand_no1) {
        if (inter.roadbottom == true) {
          var dir = 's';
          c.direction = 's';
          c.x = inter.x + 20;
          c.y = inter.y + inter.height + c.length + 2;
        } else {
          if (inter.roadleft == true) {
            var dir = c.direction;
          } else {
            //turn
          }
        }
      } else if (rand_dir > 3 && rand_dir < rand_no2) {
        if (inter.roadtop == true) {
          var dir = 'n';
          c.direction = 'n';
          c.x = inter.x + inter.width + 1;
          c.y = inter.y + c.length - 30;
        } else {
          if (inter.roadleft == true) {
            var dir = c.direction;
          } else {
            //turn
          }
        }
      } else {
        if (inter.roadleft == true) {
          var dir = c.direction;
        } else {
          //turn
          var dir = 'n';
          c.direction = 'n';
          c.x = inter.x + inter.width + 1;
          c.y = inter.y + c.length + 2;
        }
      }
    } else if (c.direction == 'n') {
      if (rand_dir < 3) {
        if (inter.roadright == true) {
          var dir = 'e';
          c.direction = 'e';
          c.y = inter.y + inter.height - 10;
          c.x = inter.x + inter.width + 1;
        } else {
        }
      } else if (rand_dir > 3 && rand_dir < 6) {
        if (inter.roadleft == true) {
          var dir = 'w';
          c.direction = 'w';
          c.y = inter.y + 8;
          c.x = inter.x + 5;
        } else {
        }
      } else {
        if (inter.roadtop == true) {
          var dir = c.direction;
        } else {
          //turn
          var dir = 'w';
          c.direction = 'w';
          c.y = inter.y + 8;
          c.x = inter.x + 5;
        }
      }
    } else if (c.direction == 's') {
      if (rand_dir < 3) {
        if (inter.roadright == true) {
          var dir = 'e';
          c.direction = 'e';
          c.y = inter.y + inter.height - 21;
          c.x = inter.x + inter.width + 1;
        } else {
          if (inter.roadbottom == true) {
            var dir = c.direction;
          } else {
            //turn
            c.speed = 0;
          }
        }
      } else if (rand_dir > 3 && rand_dir < 6) {
        if (inter.roadleft == true) {
          var dir = 'w';
          c.direction = 'w';
          c.y = inter.y - 2;
          c.x = inter.x - 28;
        } else {
          if (inter.roadbottom == true) {
            var dir = c.direction;
          } else {
            //turn
            c.speed = 0;
          }
        }
      } else {
        if (inter.roadleft == true) {
          var dir = 'w';
          c.direction = 'w';
          c.y = inter.y - 2;
          c.x = inter.x - 28;
        } else {
          //turn
          c.speed = 0;
        }
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    if (this.direction == 'w') {
      this.width = 25;
      // 车身
      ctx.rounded_rect(this.x, this.y, this.length, 12);
      // 车窗
      ctx.fillStyle = '#99B3CE';
      ctx.fillRect(this.x + 5, this.y, 5, 12);
      ctx.fillRect(this.x + 18, this.y, 2, 12);
      // 后视镜
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + 6, this.y - 2, 2, 2);
      ctx.fillRect(this.x + 6, this.y + 12, 2, 2);
    } else if (this.direction == 'e') {
      this.width = 25;
      ctx.rounded_rect(this.x, this.y, this.length, 12);
      ctx.fillStyle = '#99B3CE';
      ctx.fillRect(this.x + 15, this.y, 5, 12);
      ctx.fillRect(this.x + 4, this.y, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + 14, this.y - 2, 2, 2);
      ctx.fillRect(this.x + 14, this.y + 12, 2, 2);
    } else if (this.direction == 's') {
      this.width = 12;
      ctx.rotate(Math.PI / 2);
      ctx.rounded_rect(this.y, -this.x, this.length, 12);
      ctx.fillStyle = '#99B3CE';
      ctx.fillRect(this.y + 15, -this.x, 5, 12);
      ctx.fillRect(this.y + 4, -this.x, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.y + 14, -this.x - 2, 2, 2);
      ctx.fillRect(this.y + 14, -this.x + 12, 2, 2);
      ctx.rotate(-Math.PI / 2);
    } else {
      this.width = 12;
      ctx.rotate(Math.PI / 2);
      ctx.rounded_rect(this.y, -this.x, this.length, 12);
      ctx.fillStyle = '#99B3CE';
      ctx.fillRect(this.y + 5, -this.x, 5, 12);
      ctx.fillRect(this.y + 18, -this.x, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.y + 6, -this.x - 2, 2, 2);
      ctx.fillRect(this.y + 6, -this.x + 12, 2, 2);
      ctx.rotate(-Math.PI / 2);
    }
  }

  stop(){
    if(this.state === 1) { //行->停
      this.recentStopStartTime = new Date().getTime();
      this.waitingNum ++;
    }
    this.speed = 0;
    this.state = 0;
  }

  start(speed) {
    if(speed > 0) {
      if(this.state === 0) { //停->行
        if(this.recentStopStartTime > 0) {
          const now = new Date().getTime();
          const waitingTime = now - this.recentStopStartTime;
          this.waitingTime += waitingTime;
        }
      }
    }
    this.speed = speed;
    this.state = 1;
  }

  showInfo(){
    const showObj = {
      "位置": `(${this.x},${this.y})`,
      "速度": this.speed,
      "停车状态": this.state===0 ? "停止":"运行",
      "方向": this.direction,
      "驶出次数": this.exitNum,
      "停车次数": this.waitingNum,
      "停车总时长(秒)": (this.waitingTime/1000).toFixed(3),
      "平均停车等待时间(秒)": (this.waitingTime/this.waitingNum/1000).toFixed(3),
    }
    console.log(JSON.stringify(showObj));
    return showObj;
  }

  randomizeStartPoint(roadConfigs, probabilities){
    const randomNumber = Math.random();
    if(randomNumber < probabilities[0]){
      //lane1
      const roadConfig = roadConfigs[0];
      roadConfig.carNum += 1;
      this.x = roadConfig.x - defaultCar.l;
      this.y = roadConfig.y + roadConfig.height / 2 + 17;
      this.direction = 'e';
    }
    else if(randomNumber < probabilities[0] + probabilities[1]) {
      //lane2
      const roadConfig = roadConfigs[1];
      roadConfig.carNum += 1;
      this.x = roadConfig.x + roadConfig.width / 2 + 17;
      this.y = roadConfig.y + roadConfig.height + defaultCar.l;
      this.direction = 'n';
    }
    else if(randomNumber < probabilities[0] + probabilities[1] + probabilities[2]) {
      //lane3
      const roadConfig = roadConfigs[0];
      roadConfig.carNum += 1;
      this.x = roadConfig.x + roadConfig.width + defaultCar.l;
      this.y = roadConfig.y + roadConfig.height / 2 - 17;
      this.direction = 'w';
    }
    else {
      //lane4
      const roadConfig = roadConfigs[1];
      roadConfig.carNum += 1;
      this.x = roadConfig.x + roadConfig.width / 2 - 17;
      this.y = roadConfig.y - defaultCar.l;
      this.direction = 's';
    }
    let color_rand = Math.random();
    let color = '';
    if (color_rand < 0.2) {
      color = '#fff';
    } else if (color_rand > 0.2 && color_rand < 0.4) {
      color = '#E22322';
    } else if (color_rand > 0.4 && color_rand < 0.6) {
      color = '#F9D111';
    } else if (color_rand > 0.6 && color_rand < 0.8) {
      color = '#367C94';
    } else if (color_rand > 0.8 && color_rand < 1) {
      color = '#222';
    }
    this.color = color;
  }
}

// export default Vehicle;
