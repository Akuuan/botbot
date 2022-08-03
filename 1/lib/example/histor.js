import { segment } from "oicq";
import fetch from "node-fetch";

//项目路径
const _path = process.cwd();

//简单应用示例

//1.定义命令规则
export const rule = {
  examples: {
    reg: "^#历史上的今天$", //匹配消息正则，命令正则
    priority: 5000, //优先级，越小优先度越高
    describe: "历史", //【命令】功能说明
  },
};

//2.编写功能方法
//方法名字与rule中的examples保持一致
//测试命令 npm test 例子
export async function examples(e) {
  //e.msg 用户的命令消息
  console.log("用户命令：", e.msg);

  //执行的逻辑功能
  let url = "https://query.asilu.com/today/list/"; //一言接口地址
  let response = await fetch(url); //调用接口获取数据
  let res = await response.json(); //结果json字符串转对象
  

  

  //最后回复消息
  
for(var i=0;i<res.data.length;i++){
  let msg = [
    res.data[i]

  ];

  //发送消息
  e.reply(msg);
}
  return true; //返回true 阻挡消息不再往下
}
