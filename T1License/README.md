todo 账号管理：账号禁用
todo API限制

系统实现了自动的token失效处理机制：

1. 当用户token失效时，系统会：
   - 自动清除已失效的token
   - 跳转到登录页面
   - 登录成功后返回之前的页面

2. 需要登录才能访问的页面都应在路由配置中设置 `meta.requiresAuth: true`

客户管理
  使用卡片列表页
  ID: number;  // 客户ID
  name: string; // 客户名称
  isSetup: boolean; // 是否已启用
  type: number; // 客户类型
  description: string; // 描述
  businessLicenseNumber: string; // 营业执照注册号
  businessPersonName: string; // 营业者
  businessPersonIdNumber: string; // 营业者身份证号
  businessPersonPhoneNumber: string; // 营业者手机号
  contactAddress: string; // 联系地址

  const typeMap = [A'重要客户',B'普通客户', C'间接客户', D'合作伙伴', '代理商'];


  mock数据
  [
{"ID":100027,"企业名称":"东莞市百生电子技术有限公司","营业执照注册号":123,"营业者":"qq","营业者身份证号":2133,"营业者手机号":1233,"联系地址":"ewe"},
]

许可管理
  使用筛选列表页

  mock数据
  [
{"版本":"标准版","开通应用开发":"否","离线授权":"是","人数上限（人）":30,"使用期限(天)":365,"机器码":"ASQASED","应用包授权":123,"App编译权限":"否","备注":121},
]
