import color from '../color';
export class Crossroad {
  constructor() {
    this.x = 0; //交叉路口中心点x坐标
    this.y = 0; //交叉路口中心点y坐标
    this.lightNumH = 0; //水平方向交通灯数量
    this.lightNumV = 0; //垂直方向交通灯数量
    this.width = 0; //交叉路口宽度(水平方向宽度)
    this.height = 0; //交叉路口高度(垂直方向高度)
    this.roadtop = true; // r1，r2存在尽头相交??
    this.roadleft = true;
    this.roadright = true;
    this.roadbottom = true;
    if (left_green) {
      this.right = color.traffic.green;
      this.left = color.traffic.green;
      this.top = color.traffic.red;
      this.bottom = color.traffic.red;
    } else {
      this.right = color.traffic.red;
      this.left = color.traffic.red;
      this.top = color.traffic.green;
      this.bottom = color.traffic.green;
    }
  }

  xRange (){
    return {min: this.x - this.width/2, max: this.x + this.width/2};
  }

  yRange() {
    return {min: this.y - this.height/2, max: this.y + this.height/2};
  }

  // 重绘路口
  drawRoad(ctx, x, y, w, h) {
    ctx.fillStyle = color.road;
    ctx.fillRect(x, y, w, h);
  }

  // 斑马线
  drawZebraCross(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.setLineDash([1, 5]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.strokeStyle = '#A09383';
    ctx.lineWidth = 10;
    ctx.fill();
    ctx.stroke();
  }

  // 停止线
  drawStopLine(road, ctx, x, y, w, h) {
    ctx.fillStyle = color.solidLine;
    ctx.fillRect(x, y, w, h);

    const { dir, num } = road;
    if (num === 1) return;

    let space = Math.max(w, h) / num;

    // 虚线上叠加实线分割线
    for (let i = 1; i < num; i++) {
      if (dir === 'left') {
        ctx.fillRect(x - 30, y + space * i - 2, 30, 2);
      }
      if (dir === 'right') {
        ctx.fillRect(x, y + space * i - 2, 30, 2);
      }
      if (dir === 'top') {
        ctx.fillRect(x + space * i - 2, y - 30, 2, 30);
      }
      if (dir === 'bottom') {
        ctx.fillRect(x + space * i - 2, y, 2, 30);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // 信号灯
  drawTrafficLight(light, ctx, x, y, w, h) {
    let shadow_color = light.color;
    ctx.save();
    
    let diff = Math.max(w, h) / light.num / 2;
    for (let i = 0; i < light.num; i++) {
      ctx.fillStyle = shadow_color;
      ctx.shadowColor = shadow_color;
      if (light.dir === 'left') {
        ctx.fillRect(x - 3, y + diff * (2 * i + 1), 10, 10);
      }
      if (light.dir === 'right') {
        ctx.fillRect(x + 1, y + h - diff * (2 * i + 1), 10, 10);
      }
      if (light.dir === 'top') {
        ctx.fillRect(x + diff * (2 * i + 1), y - 3, 10, 10);
      }
      if (light.dir === 'bottom') {
        ctx.fillRect(x + w - diff * (2 * i + 1), y + 1, 10, 10);
      }
      ctx.fill();
      ctx.restore();
    }

    // 信号灯杆
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x, y, w, h);
  }

  draw(ctx) {
    // 覆盖路口
    ctx.fillStyle = color.road;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.roadleft == true) {
      this.drawRoad(ctx, this.x - 20, this.y, 20, this.height);
      this.drawZebraCross(
        ctx,
        this.x - 12,
        this.y,
        this.x - 12,
        this.y + this.height
      );
      this.drawStopLine(
        { dir: 'left', num: this.lightNumH },
        ctx,
        this.x - 22,
        this.height / 2 + this.y - 1,
        2,
        this.height / 2 + 1
      );
      this.drawTrafficLight(
        { dir: 'left', num: this.lightNumH, color: this.left },
        ctx,
        this.x - 3,
        this.y + this.height - this.height / 2 + 3,
        1,
        this.height / 2
      );
    }
    if (this.roadright == true) {
      this.drawRoad(ctx, this.x + this.width, this.y, 22, this.height);
      this.drawZebraCross(
        ctx,
        this.x + this.width + 12,
        this.y,
        this.x + this.width + 12,
        this.y + this.height
      );
      this.drawStopLine(
        { dir: 'right', num: this.lightNumH },
        ctx,
        this.x + this.width + 22,
        this.y,
        2,
        this.height / 2 + 1
      );
      this.drawTrafficLight(
        { dir: 'right', num: this.lightNumH, color: this.right },
        ctx,
        this.x + this.width + 2,
        this.y - 3,
        1,
        this.height / 2
      );
    }
    if (this.roadtop == true) {
      this.drawRoad(ctx, this.x, this.y - 20, this.width, 20);
      this.drawZebraCross(
        ctx,
        this.x,
        this.y - 12,
        this.x + this.width,
        this.y - 12
      );
      this.drawStopLine(
        { dir: 'top', num: this.lightNumV },
        ctx,
        this.x,
        this.y - 21,
        this.width / 2 + 1,
        2
      );
      this.drawTrafficLight(
        { dir: 'top', num: this.lightNumV, color: this.top },
        ctx,
        this.x - 3,
        this.y - 2,
        this.width / 2,
        1
      );
    }
    if (this.roadbottom == true) {
      this.drawRoad(ctx, this.x, this.y + this.height, this.width, 20);
      this.drawZebraCross(
        ctx,
        this.x,
        this.y + this.height + 12,
        this.x + this.width,
        this.y + this.height + 12
      );
      this.drawStopLine(
        { dir: 'bottom', num: this.lightNumV },
        ctx,
        this.x + this.width - this.width / 2 - 1,
        this.y + this.height + 20,
        this.width / 2 + 1,
        2
      );
      this.drawTrafficLight(
        { dir: 'bottom', num: this.lightNumV, color: this.bottom },
        ctx,
        this.x + this.width / 2 + 3,
        this.y + this.height + 2,
        this.width / 2,
        1
      );
    }
  }
}