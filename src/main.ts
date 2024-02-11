import 'fc64js';
import { imgLogo, imgU0, imgU1, imgU2, imgD0, imgD1, imgD2, imgL0, imgL1, imgL2, imgR0, imgR1, imgR2 } from './images';

fc64Init(romInit, romLoop);

//const romPalette = [0x000000, 0x55415f, 0x646964, 0xd77355, 0x508cd7, 0x64b964, 0xe6c86e, 0xdcf5ff]; // db8
//fc64Init(romInit, romLoop, romPalette);

class Logo {
  x: number;
  y: number;
  width: number;
  height: number;
  red: number[];
  grn: number[];
  blu: number[];
  cyn: number[];
  mag: number[];
  yel: number[];
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.red = swapImageColors(imgLogo, [COL_BLK], [COL_RED]);
    this.grn = swapImageColors(imgLogo, [COL_BLK], [COL_GRN]);
    this.blu = swapImageColors(imgLogo, [COL_BLK], [COL_BLU]);
    this.cyn = swapImageColors(imgLogo, [COL_BLK], [COL_CYN]);
    this.mag = swapImageColors(imgLogo, [COL_BLK], [COL_MAG]);
    this.yel = swapImageColors(imgLogo, [COL_BLK], [COL_YEL]);
  }
  draw() {
    drawImage(this.x, this.y, this.width, this.height, ticks % 18 < 3 ? this.red : ticks % 18 < 6 ? this.grn : ticks % 18 < 9 ? this.blu : ticks % 18 < 12 ? this.cyn : ticks % 18 < 15 ? this.mag : this.yel);
  }
}

class Indicator {
  x: number;
  y: number;
  color: number;
  duration: number;
  constructor(x: number, y: number, color: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.duration = 0;
  }
  trigger(duration: number) {
    this.duration = duration;
  }
  updateAndDraw() {
    drawCircle(this.x, this.y, 2, this.color, this.duration > 0 ? this.color : -1);
    this.duration--;
  }
}

class Character {
  x: number;
  y: number;
  width: number;
  height: number;
  facing: string;
  moving: boolean;
  movingTicks: number;
  animU: Anim;
  animD: Anim;
  animL: Anim;
  animR: Anim;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.facing = 'D';
    this.moving = false;
    this.movingTicks = 0;
    this.animU = new Anim([imgU0, imgU1, imgU0, imgU2], 9, true);
    this.animD = new Anim([imgD0, imgD1, imgD0, imgD2], 9, true);
    this.animL = new Anim([imgL0, imgL1, imgL0, imgL2], 9, true);
    this.animR = new Anim([imgR0, imgR1, imgR0, imgR2], 9, true);
  }
  updateAndDraw() {
    this.moving ? this.movingTicks++ : (this.movingTicks = 0);
    const anim = this.facing == 'U' ? this.animU : this.facing == 'D' ? this.animD : this.facing == 'L' ? this.animL : this.animR;
    drawImage(this.x, this.y, this.width, this.height, anim.getKeyFrame(this.movingTicks));
  }
}

let ticks: number;
let logo: Logo;
let indicators: Map<string, Indicator>;
let character: Character;

function romInit() {
  ticks = 0;
  logo = new Logo(0, 2, 64, 23);
  indicators = new Map([
    ['U-P', new Indicator(8, 30, COL_BLU)],
    ['U-JP', new Indicator(14, 30, COL_BLU)],
    ['U-JR', new Indicator(20, 30, COL_BLU)],
    ['D-P', new Indicator(8, 36, COL_RED)],
    ['D-JP', new Indicator(14, 36, COL_RED)],
    ['D-JR', new Indicator(20, 36, COL_RED)],
    ['L-P', new Indicator(8, 42, COL_MAG)],
    ['L-JP', new Indicator(14, 42, COL_MAG)],
    ['L-JR', new Indicator(20, 42, COL_MAG)],
    ['R-P', new Indicator(8, 48, COL_GRN)],
    ['R-JP', new Indicator(14, 48, COL_GRN)],
    ['R-JR', new Indicator(20, 48, COL_GRN)],
    ['A-P', new Indicator(8, 54, COL_CYN)],
    ['A-JP', new Indicator(14, 54, COL_CYN)],
    ['A-JR', new Indicator(20, 54, COL_CYN)],
    ['B-P', new Indicator(8, 60, COL_YEL)],
    ['B-JP', new Indicator(14, 60, COL_YEL)],
    ['B-JR', new Indicator(20, 60, COL_YEL)],
  ]);
  character = new Character(39, 36, 14, 18);
}

function romLoop() {
  ticks++;
  handleInput();
  clearGfx();
  logo.draw();
  drawText(1, 28, `U     ${peek(4096)}`, COL_BLU);
  drawText(1, 34, `D     ${peek(4097)}`, COL_RED);
  drawText(1, 40, `L     ${peek(4098)}`, COL_MAG);
  drawText(1, 46, `R     ${peek(4099)}`, COL_GRN);
  drawText(1, 52, `A     ${peek(4100)}`, COL_CYN);
  drawText(1, 58, `B     ${peek(4101)}`, COL_YEL);
  indicators.forEach((v) => v.updateAndDraw());
  for (let x = 29; x < 63; x++) {
    for (let y = 28; y < 63; y++) {
      drawPixel(x, y, randomInt(0, 1) == 0 ? COL_BLK : COL_WHT);
    }
  }
  character.updateAndDraw();
}

function handleInput() {
  if (isPressed(BTN_U)) {
    indicators.get('U-P')?.trigger(1);
    character.facing = 'U';
  }
  if (isJustPressed(BTN_U)) {
    indicators.get('U-JP')?.trigger(12);
  }
  if (isJustReleased(BTN_U)) {
    indicators.get('U-JR')?.trigger(12);
  }
  if (isPressed(BTN_D)) {
    indicators.get('D-P')?.trigger(1);
    character.facing = 'D';
  }
  if (isJustPressed(BTN_D)) {
    indicators.get('D-JP')?.trigger(12);
  }
  if (isJustReleased(BTN_D)) {
    indicators.get('D-JR')?.trigger(12);
  }
  if (isPressed(BTN_L)) {
    indicators.get('L-P')?.trigger(1);
    character.facing = 'L';
  }
  if (isJustPressed(BTN_L)) {
    indicators.get('L-JP')?.trigger(12);
  }
  if (isJustReleased(BTN_L)) {
    indicators.get('L-JR')?.trigger(12);
  }
  if (isPressed(BTN_R)) {
    indicators.get('R-P')?.trigger(1);
    character.facing = 'R';
  }
  if (isJustPressed(BTN_R)) {
    indicators.get('R-JP')?.trigger(12);
  }
  if (isJustReleased(BTN_R)) {
    indicators.get('R-JR')?.trigger(12);
  }
  if (isPressed(BTN_A)) {
    indicators.get('A-P')?.trigger(1);
  }
  if (isJustPressed(BTN_A)) {
    indicators.get('A-JP')?.trigger(12);
  }
  if (isJustReleased(BTN_A)) {
    indicators.get('A-JR')?.trigger(12);
  }
  if (isPressed(BTN_B)) {
    indicators.get('B-P')?.trigger(1);
  }
  if (isJustPressed(BTN_B)) {
    indicators.get('B-JP')?.trigger(12);
  }
  if (isJustReleased(BTN_B)) {
    indicators.get('B-JR')?.trigger(12);
  }
  character.moving = isPressed(BTN_U) || isPressed(BTN_D) || isPressed(BTN_L) || isPressed(BTN_R);
}
