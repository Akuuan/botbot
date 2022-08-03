import { segment } from "oicq";
import fetch from "node-fetch";

const _path = process.cwd();

//简单应用示例

//1.定义命令规则
export const rule = {
  xingzuo: {
    reg: "^(.*)今日运势$", //匹配消息正则，命令正则
    priority: 5000, //优先级，越小优先度越高
    describe: "星座查询", //【命令】功能说明
  },
};

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function xingzuo(e) {
  let msg = e.msg;
  msg = msg.replace(/#|今日运势/g, "").trim();
  if (!msg) return;

  let url = `http://web.juhe.cn:8080/constellation/getAll?consName=${msg}&type=today&key=4a11bbcbf089edaf14c2d9bdb80c2ec4`;
  let response = await fetch(url);
  let res = await response.json();

 let msg3=[
    res.summary
 ]
  e.reply(msg3);
  
  return true; //返回true 阻挡消息不再往下
}