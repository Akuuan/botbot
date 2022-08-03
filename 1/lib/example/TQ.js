import { segment } from "oicq";
import fetch from "node-fetch";

// 使用方法：
// XX天气

//项目路径
const _path = process.cwd();

//1.定义命令规则
export const rule = {
  tianqi: {
    reg: "^(.*)天气$", //匹配消息正则，命令正则
    priority: 6950, //优先级，越小优先度越高
    describe: "【xx天气】搜天气预报", //【命令】功能说明
  },
};

export async function tianqi(e) {
  let msg = e.msg;
  msg = msg.replace(/#|＃|天气/g, "").trim();
  if (!msg) return;

  let url = `http://api.lingfeng.press/api/tianqi.php?msg=${msg}&b=1`;
  let response = await fetch(url);
  let res = await response.text();
  res = res.replace(/棱枫API墨迹天气\n/g,"");
  res = res.replace(/Tips:棱枫API技术支持/g,"");
  let worry =`温度：～℃`;
  msg = [
    // "【",segment.text(res.data.Msg),"】",
	segment.text(res),
  ];
  if(res.includes(worry) == true) e.reply('没有搜索到该城市的天气');
  else e.reply(msg);
  return true; //返回true 阻挡消息不再往下
}