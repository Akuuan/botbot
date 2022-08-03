import { segment } from "oicq";
import fetch from "node-fetch";
import { readFile } from 'fs/promises';
import { render } from "../render.js";
import Life from '../../resources/relife/src/modules/life.js'

globalThis.localStorage = {};
localStorage.getItem = key => localStorage[key]===void 0? null: localStorage[key];
localStorage.setItem = (key, value) => (localStorage[key] = value);


globalThis.$$eventMap = new Map();
globalThis.$$event = (tag, data) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.forEach(fn=>fn(data));
}
globalThis.$$on = (tag, fn) => {
    let listener = $$eventMap.get(tag);
    if(!listener) {
        listener = new Set();
        $$eventMap.set(tag, listener);
    }
    listener.add(fn);
}
globalThis.$$off = (tag, fn) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.delete(fn);
}

//项目路径
const _path = process.cwd();

const config = {
  defaultPropertyPoints: 20, // 默认特性点数
  talentSelectLimit: 3, // 可选择的最大天赋数量
  propertyAllocateLimit: [0, 10], // scoop of properties that can be allocated,
  defaultPropertys: {}, // 默认属性
  talentConfig: { // 天赋配置
      talentPullCount: 10, // number of talents to pull from the talent pool
      talentRate: { 1:100, 2:10, 3:1, total: 1000 }, // rate of talent pull
      additions: {
          TMS: [
              [ 10, { 2: 1 }],
              [ 30, { 2: 2 }],
              [ 50, { 2: 3 }],
              [ 70, { 2: 4 }],
              [100, { 2: 5 }],
          ],
          CACHV: [
              [ 10, { 2: 1 }],
              [ 30, { 2: 2 }],
              [ 50, { 2: 3 }],
              [ 70, { 2: 4 }],
              [100, { 2: 5 }],
          ]
      },
  },
  propertyConfig: { // config for property
      judge: {
          // type: [min, grade, judge]
          RTLT: [
              [    0, 0],
              [  0.3, 1],
              [  0.6, 2],
              [  0.9, 3],
          ],
          REVT: [
              [    0, 0],
              [  0.2, 1],
              [  0.4, 2],
              [  0.6, 3],
          ],
          TMS: [
              [    0, 0, 'UI_Remake_Times_Judge_Level_0'],
              [   10, 1, 'UI_Remake_Times_Judge_Level_1'],
              [   30, 1, 'UI_Remake_Times_Judge_Level_2'],
              [   50, 2, 'UI_Remake_Times_Judge_Level_3'],
              [   70, 2, 'UI_Remake_Times_Judge_Level_4'],
              [  100, 3, 'UI_Remake_Times_Judge_Level_5'],
          ],
          CACHV: [
              [    0, 0, 'UI_Achievement_Count_Judge_Level_0'],
              [   10, 1, 'UI_Achievement_Count_Judge_Level_1'],
              [   30, 1, 'UI_Achievement_Count_Judge_Level_2'],
              [   50, 2, 'UI_Achievement_Count_Judge_Level_3'],
              [   70, 2, 'UI_Achievement_Count_Judge_Level_4'],
              [  100, 3, 'UI_Achievement_Count_Judge_Level_5'],
          ],
          HCHR: [
              [   0, 0, 'UI_Judge_Level_0'],
              [   1, 0, 'UI_Judge_Level_1'],
              [   2, 0, 'UI_Judge_Level_2'],
              [   4, 0, 'UI_Judge_Level_3'],
              [   7, 1, 'UI_Judge_Level_4'],
              [   9, 2, 'UI_Judge_Level_5'],
              [  11, 3, 'UI_Judge_Level_6'],
          ],
          HMNY: [
              [   0, 0, 'UI_Judge_Level_0'],
              [   1, 0, 'UI_Judge_Level_1'],
              [   2, 0, 'UI_Judge_Level_2'],
              [   4, 0, 'UI_Judge_Level_3'],
              [   7, 1, 'UI_Judge_Level_4'],
              [   9, 2, 'UI_Judge_Level_5'],
              [  11, 3, 'UI_Judge_Level_6'],
          ],
          HSPR: [
              [   0, 0, 'UI_Spirit_Judge_Level_0'],
              [   1, 0, 'UI_Spirit_Judge_Level_1'],
              [   2, 0, 'UI_Spirit_Judge_Level_2'],
              [   4, 0, 'UI_Spirit_Judge_Level_3'],
              [   7, 1, 'UI_Spirit_Judge_Level_4'],
              [   9, 2, 'UI_Spirit_Judge_Level_5'],
              [  11, 3, 'UI_Spirit_Judge_Level_6'],
          ],
          HINT: [
              [   0, 0, 'UI_Judge_Level_0'],
              [   1, 0, 'UI_Judge_Level_1'],
              [   2, 0, 'UI_Judge_Level_2'],
              [   4, 0, 'UI_Judge_Level_3'],
              [   7, 1, 'UI_Judge_Level_4'],
              [   9, 2, 'UI_Judge_Level_5'],
              [  11, 3, 'UI_Judge_Level_6'],
              [  21, 3, 'UI_Intelligence_Judge_Level_7'],
              [ 131, 3, 'UI_Intelligence_Judge_Level_8'],
              [ 501, 3, 'UI_Intelligence_Judge_Level_9'],
          ],
          HSTR: [
              [   0, 0, 'UI_Judge_Level_0'],
              [   1, 0, 'UI_Judge_Level_1'],
              [   2, 0, 'UI_Judge_Level_2'],
              [   4, 0, 'UI_Judge_Level_3'],
              [   7, 1, 'UI_Judge_Level_4'],
              [   9, 2, 'UI_Judge_Level_5'],
              [  11, 3, 'UI_Judge_Level_6'],
              [  21, 3, 'UI_Strength_Judge_Level_7'],
              [ 101, 3, 'UI_Strength_Judge_Level_8'],
              [ 401, 3, 'UI_Strength_Judge_Level_9'],
              [1001, 3, 'UI_Strength_Judge_Level_10'],
              [2001, 3, 'UI_Strength_Judge_Level_11'],
          ],
          HAGE: [
              [   0, 0, 'UI_AGE_Judge_Level_0'],
              [   1, 0, 'UI_AGE_Judge_Level_1'],
              [  10, 0, 'UI_AGE_Judge_Level_2'],
              [  18, 0, 'UI_AGE_Judge_Level_3'],
              [  40, 0, 'UI_AGE_Judge_Level_4'],
              [  60, 1, 'UI_AGE_Judge_Level_5'],
              [  70, 1, 'UI_AGE_Judge_Level_6'],
              [  80, 2, 'UI_AGE_Judge_Level_7'],
              [  90, 2, 'UI_AGE_Judge_Level_8'],
              [  95, 3, 'UI_AGE_Judge_Level_9'],
              [ 100, 3, 'UI_AGE_Judge_Level_10'],
              [ 500, 3, 'UI_AGE_Judge_Level_11'],
          ],
          SUM: [
              [   0, 0, 'UI_Judge_Level_0'],
              [  41, 0, 'UI_Judge_Level_1'],
              [  50, 0, 'UI_Judge_Level_2'],
              [  60, 0, 'UI_Judge_Level_3'],
              [  80, 1, 'UI_Judge_Level_4'],
              [ 100, 2, 'UI_Judge_Level_5'],
              [ 110, 3, 'UI_Judge_Level_6'],
              [ 120, 3, 'UI_Judge_Level_7'],
          ],
      },
  },
  characterConfig: { // config for character
      characterPullCount: 3,
      rateableKnife: 10,
      propertyWeight: [
          [ 0, 1],
          [ 1, 2],
          [ 2, 3],
          [ 3, 4],
          [ 4, 5],
          [ 5, 6],
          [ 6, 5],
          [ 7, 4],
          [ 8, 3],
          [ 9, 2],
          [10, 1],
      ],
      talentWeight: [
          [ 1, 1],
          [ 2, 2],
          [ 3, 3],
          [ 4, 2],
          [ 5, 1],
      ],
  },
}

//简单应用示例

//1.定义命令规则
export const rule = {
  examples: {
    reg: "^#人生重[来开]$", //匹配消息正则，命令正则
    priority: 5000, //优先级，越小优先度越高
    describe: "人生重来模拟器", //【命令】功能说明
  },
};

//2.编写功能方法
//方法名字与rule中的examples保持一致
export async function examples(e) {
    const relife = await run(config)
    const hd_bg = (plants = ['八重神子','久岐忍','雷电将军','神里绫人','夜兰']) => {return plants[Math.floor(Math.random() * (plants.length + 1))]}
    if (relife.life.length > 80) {
      for (let i = 0; i < Math.trunc(relife.life.length/60) + 1; i++) {
          let base64 = await render(
            "relife",
            "relife",
            {
              lifeData: relife.life.slice(i*60,(i+1)*60),
              lifeTalent: relife.talent,
              hd_bg: hd_bg,
              nickname: e.sender.nickname,
            }
          );
          setTimeout(() => {
            if (base64) {
                e.reply(segment.image(`base64://${base64}`));
            }
          }, 3000*i)
      }
    } else {
      let base64 = await render(
        "relife",
        "relife",
        {
          lifeData: relife.life,
          lifeTalent: relife.talent,
          hd_bg: hd_bg,
          nickname: e.sender.nickname,
        }
      );
      if (base64) {
        e.reply(segment.image(`base64://${base64}`));
      }
    }
    
    return true //返回true 阻挡消息不再往下
}


async function run(config) {

  const core = new Life();
  let ret = {
    talent: [],
    life: []
  };

  core.config(config);
  await core.initial(
      async fileName => JSON.parse(await readFile(`resources/relife/data/zh-cn/${fileName}.json`)),
      async fileName => JSON.parse(await readFile(`resources/relife/data/${fileName}.json`)),
  );

  const talentRandom = core.talentRandom().splice(0,3).map(({id})=>id);
  ret.talent = talentRandom.map(
        (id) => {
            const { grade, name, description } = core.information(id)
            return {
                name: name,
                description: description
            }
        }
    );
  core.remake(talentRandom);

  let pts = core.getPropertyPoints();
  const limit = core.propertyAllocateLimit;
  const arr = new Array(4).fill(limit[1]);

  while (pts > 0) {
      const sub = Math.round(Math.random() * (Math.min(pts, limit[1]) - 1)) + 1;
      while(true) {
          const select = Math.floor(Math.random() * 4) % 4;
          if(arr[select] - sub <0) continue;
          arr[select] -= sub;
          pts -= sub;
          break;
      }
  }

  const property = {
    CHR: limit[1] - arr[0],                     // 颜值 charm CHR
    INT: limit[1] - arr[1],                     // 智力 intelligence INT
    STR: limit[1] - arr[2],                     // 体质 strength STR
    MNY: limit[1] - arr[3],                     // 家境 money MNY
  };
  core.start(property);

  const lifeTrajectory = [];
  let trajectory;
  
  do{
      try{
          trajectory = core.next();
      } catch(e) {
          console.error(e);
          // debugger
          throw e;
      }
      lifeTrajectory.push(trajectory);
      const { age, content } = trajectory;
      ret.life.push(
        {
          age: age + '岁',
          propertys: `颜值【${core.propertys.CHR}】 智力【${core.propertys.INT}】 体质【${core.propertys.STR}】 家境【${core.propertys.MNY}】 快乐【${core.propertys.SPR}】`,
          text: content.map(
              ({type, description, rate, name, postEvent}) => {
                  switch(type) {
                      case 'TLT':
                          return `天赋【${name}】发动：${description}`;
                      case 'EVT':
                          return description + (postEvent?`\n    ${postEvent}`:'');
                  }
              }
          ).join('\n    ')
        }
      )
      // if(age == 60) debugger
  } while(!trajectory.isEnd)
  //console.log(ret) 
  return ret
}