# 香港股票交易全流程可视化

一个交互式演示应用，将香港股票市场从下单到交割的完整 12 个阶段以动画形式呈现，严格还原 HKEX / SEHK / HKSCC / CCASS 的真实运作机制。

## 项目背景

港股交易流程涉及联交所、中央结算、多家券商和银行，环节繁多且专业术语密集，普通投资者难以建立整体认知。本项目用可视化动画打通每个环节，帮助新手理解"下单之后钱和股票到底经过了哪些机构、在什么时间到账"。

## 功能

- **12 阶段完整流程**：从 T 日前入金，到 T+2 交割完成及出金
- **Emoji 流动动画**：实时展示资金、证券、指令在各实体之间的流转
- **买卖双方双视角**：同步呈现买方和卖方在每个阶段的操作
- **结算指令教育面板**：Phase 8 内置 CNS / IT / SI / ISI 指令类型对比，以及 DVP / FOP / RDP 付款模式说明
- **键盘 + 时间线控制**：空格播放/暂停，方向键切换阶段，点击时间线跳转

## 12 个交易阶段

| # | 阶段 | 时间 | 说明 |
|---|------|------|------|
| 1 | 入金 | T 日前 | 资金存入券商客户信托账户，证券托管于 CCASS |
| 2 | 下单 | T 日 | 投资者通过券商提交限价盘 / 竞价盘 |
| 3 | 验证 | T 日 | 券商风控检查资金余额与持仓 |
| 4 | 路由 | T 日 | 订单经 OCG 网关发送至联交所 OTP 平台 |
| 5 | 撮合 | T 日 | OTP 按价格优先、时间优先自动匹配 |
| 6 | 成交 | T 日 | 联交所推送成交报告，数据同步至 HKSCC |
| 7 | 合约更替 | T 日盘后 | HKSCC 执行 Novation，CNS 净额轧差 |
| 8 | 清算 | T+1 | HKSCC 发出 T+2 结算指令（CNS + DVP） |
| 9 | 资金交收 | T+2 | 买方银行经 RTGS/CHATS 划款至 HKSCC |
| 10 | 证券交收 | T+2 | CCASS 执行证券过户，与资金同步（DVP） |
| 11 | 持仓更新 | T+2 | 券商更新投资者账户持仓与资金明细 |
| 12 | 完成/出金 | T+2 后 | DVP 确认，卖方可申请出金至个人银行 |

## 参与实体

| 实体 | 角色 |
|------|------|
| 买方 / 卖方投资者 | 交易发起方 |
| 买方 / 卖方券商 | 交易通道，持有 CCASS 参与者资格 |
| 买方 / 卖方银行 | 资金托管，通过 RTGS/CHATS 划款 |
| SEHK（联交所） | 订单撮合，OTP 平台 |
| HKSCC | 中央对手方（CCP），执行 Novation 和净额结算 |
| CCASS | HKSCC 运营的中央结算系统，管理证券过户 |

## 结算指令说明（Phase 8）

| 类型 | 用途 | 可用付款模式 |
|------|------|------|
| CNS | 标准交易所成交，HKSCC 净额汇总（**本流程**） | DVP（强制） |
| IT  | 从 CNS 剥离的单笔成交，点对点结算 | DVP / FOP / RDP |
| SI  | 参与者间场外证券划转 | DVP / FOP / RDP |
| ISI | 涉及投资者参与者的划转 | DVP / RDP |

付款模式：**DVP**（券款在 CCASS 内同步）/ **FOP**（资金在 CCASS 外结算）/ **RDP**（银行确认付款后即时交券）

## 技术栈

- **React 19** + **Vite 8**
- **Tailwind CSS 3**
- **Framer Motion 12**

## 本地运行

```bash
npm install
npm run dev
```

## 参考资料

- [HKEX 结算与托管服务](https://www.hkex.com.hk/Services/Settlement-and-Depository/Settlement?sc_lang=en)
- [CCASS 操作程序](https://www.hkex.com.hk/Services/Settlement-and-Depository/Settlement/Overview?sc_lang=en)
- [SFC 客户资产规则](https://www.sfc.hk/en/Rules-and-standards/Codes-and-guidelines/Client-assets)

## License

MIT
