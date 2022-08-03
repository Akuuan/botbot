import { segment } from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();

//简单应用示例

//1.定义命令规则
export const rule = {
  examples: {
    reg: "^#周易求签$", //匹配消息正则，命令正则
    priority: 5000, //优先级，越小优先度越高
    describe: "抽签", //【命令】功能说明
  },
};

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function examples(e) {
  //e.msg 用户的命令消息
  console.log("用户命令：", e.msg);

  //执行的逻辑功能
  let url = "http://ovooa.com/API/chouq/api.php"; //一言接口地址
  let response = await fetch(url); //调用接口获取数据
  let res = await response.json(); //结果json字符串转对象
  

  

  //最后回复消息
  
  url = res.data.image
  let msg = [
    res.data.draw,
    
  ];
  let msg1 = [
    res.data.annotate
  ]
  let msg2 = [
    res.data.explain
  ]
  let msg3 = [
    res.data.details
  ]
  let msg4 = [
    res.data.souce
  ]
  let msg5 =[
    segment.image(url)
  ]

  //发送消息
 
  e.reply(msg),
  e.reply(msg1),
  e.reply(msg2),
  e.reply(msg3),
  e.reply(msg4),
  e.reply(msg5);
  return true; //返回true 阻挡消息不再往下
}
