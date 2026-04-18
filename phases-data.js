// Emoji types
const emojiTypes = {
    order: '📄',
    stock: '📈',
    money: '💰',
    done: '✅',
    settle: '📋',
    notify: '🔔',
    complete: '🎉'
};

// ========================================
// 12阶段交易流程配置
// 严格按照 HKEX/SEHK/HKSCC/CCASS 实际机制
// ========================================
const phases = [
    // ---- Phase 1: 入金 (Pre-trade) ----
    {
        id: 1,
        title: '入金',
        tTag: 'T日前',
        desc: '交易前准备：买方投资者通过FPS/银行转账/支票将资金存入券商的客户信托账户（SFC要求独立隔离），卖方确认证券已托管于券商CCASS参与者账户',
        emoji: emojiTypes.money,
        actions: [
            { text: '买方投资者通过FPS/银行转账/支票发起入金', type: 'sender', group: 'buyer' },
            { text: '资金从买方个人银行转至券商客户信托账户', type: 'sender', group: 'buyer' },
            { text: '买方券商确认到账，更新投资者内部资金余额', type: 'receiver', group: 'buyer' },
            { text: '卖方确认证券已存于券商CCASS参与者账户', type: 'sender', group: 'seller' },
            { text: '券商客户信托账户独立隔离（SFC规定）', type: 'receiver', group: 'all' }
        ],
        active: ['buyer-investor', 'buyer-investor-bank', 'buyer-broker', 'seller-investor', 'seller-broker'],
        flows: [
            { from: 'buyer-investor', to: 'buyer-investor-bank', emoji: '💳', label: '发起转账' },
            { from: 'buyer-investor-bank', to: 'buyer-broker', emoji: '💰', label: 'FPS/转账' },
            { from: 'buyer-broker', to: 'buyer-investor', emoji: '✅', label: '到账确认' },
            { from: 'seller-investor', to: 'seller-broker', emoji: '📈', label: '确认持仓' }
        ]
    },
    // ---- Phase 2: 下单 (Order Placement) ----
    {
        id: 2,
        title: '下单',
        tTag: 'T日',
        desc: '买卖双方投资者通过电话/网上/手机APP向各自券商提交订单指令。持续交易时段可使用限价盘或增强限价盘；竞价时段可使用竞价盘或竞价限价盘',
        emoji: emojiTypes.order,
        actions: [
            { text: '买方投资者提交买入订单（限价盘/增强限价盘）', type: 'sender', group: 'buyer' },
            { text: '卖方投资者提交卖出订单（限价盘/增强限价盘）', type: 'sender', group: 'seller' },
            { text: '券商接收订单并分配内部交易编号', type: 'receiver', group: 'all' },
            { text: '交易时段：开市前竞价9:00-9:30 / 持续交易9:30-16:00 / 收市竞价16:00-16:10', type: 'receiver', group: 'all' }
        ],
        active: ['buyer-investor', 'buyer-broker', 'seller-investor', 'seller-broker'],
        flows: [
            { from: 'buyer-investor', to: 'buyer-broker', emoji: '📄', label: '买入订单' },
            { from: 'seller-investor', to: 'seller-broker', emoji: '📄', label: '卖出订单' }
        ]
    },
    // ---- Phase 3: 验证 (Pre-trade Check) ----
    {
        id: 3,
        title: '验证',
        tTag: 'T日',
        desc: '券商内部风控检查：买方验证客户信托账户资金余额是否充足；卖方验证券商内部持仓记录（与CCASS参与者账户同步）',
        emoji: '✓',
        actions: [
            { text: '买方券商检查投资者内部账户资金余额', type: 'sender', group: 'buyer' },
            { text: '买方券商风控审核（SFC合规要求）', type: 'sender', group: 'buyer' },
            { text: '卖方券商检查内部持仓记录', type: 'sender', group: 'seller' },
            { text: '卖方券商风控审核（SFC合规要求）', type: 'sender', group: 'seller' },
            { text: '验证通过，订单进入待提交状态', type: 'receiver', group: 'all' }
        ],
        active: ['buyer-broker', 'seller-broker'],
        flows: [
            { from: 'buyer-broker', to: 'buyer-broker', emoji: '💰', label: '资金检查' },
            { from: 'buyer-broker', to: 'buyer-broker', emoji: '✅', label: '风控通过' },
            { from: 'seller-broker', to: 'seller-broker', emoji: '📈', label: '持仓检查' },
            { from: 'seller-broker', to: 'seller-broker', emoji: '✅', label: '风控通过' }
        ]
    },
    // ---- Phase 4: 路由 (Order Routing) ----
    {
        id: 4,
        title: '路由',
        tTag: 'T日',
        desc: '券商通过OCG（Orion Central Gateway）将订单发送至联交所的OTP（Orion Trading Platform）交易平台，系统分配交易所订单编号并进入撮合队列',
        emoji: '📤',
        actions: [
            { text: '买方券商通过OCG网关发送订单至SEHK', type: 'sender', group: 'buyer' },
            { text: '卖方券商通过OCG网关发送订单至SEHK', type: 'sender', group: 'seller' },
            { text: 'SEHK/OTP接收并分配交易所订单编号', type: 'receiver', group: 'all' },
            { text: '订单进入OTP自动撮合队列', type: 'receiver', group: 'all' }
        ],
        active: ['buyer-broker', 'seller-broker', 'exchange'],
        flows: [
            { from: 'buyer-broker', to: 'exchange', emoji: '📤', label: 'OCG路由' },
            { from: 'seller-broker', to: 'exchange', emoji: '📤', label: 'OCG路由' }
        ]
    },
    // ---- Phase 5: 撮合 (Matching) ----
    {
        id: 5,
        title: '撮合',
        tTag: 'T日',
        desc: 'SEHK的OTP（Orion Trading Platform）按照价格优先、时间优先原则自动匹配买卖订单，生成成交记录',
        emoji: '⚡',
        actions: [
            { text: 'OTP按价格优先、时间优先查找匹配订单', type: 'sender' },
            { text: '确认买卖价格和数量匹配', type: 'sender' },
            { text: '生成成交记录（Trade Capture）', type: 'receiver' },
            { text: '更新订单状态为已成交', type: 'receiver' }
        ],
        active: ['exchange'],
        flows: [
            { from: 'exchange', to: 'exchange', emoji: '⚡', label: 'OTP撮合' },
            { from: 'exchange', to: 'exchange', emoji: '✅', label: '价格匹配' },
            { from: 'exchange', to: 'exchange', emoji: '📝', label: '成交记录' }
        ]
    },
    // ---- Phase 6: 成交确认 (Trade Confirmation) ----
    {
        id: 6,
        title: '成交',
        tTag: 'T日',
        desc: 'SEHK向买卖双方券商发送成交报告（Execution Report），券商通知投资者成交结果。同时成交数据自动传送至HKSCC',
        emoji: emojiTypes.done,
        actions: [
            { text: 'SEHK发送成交报告（Execution Report）至券商', type: 'sender', group: 'all' },
            { text: '买方券商接收成交确认', type: 'receiver', group: 'buyer' },
            { text: '卖方券商接收成交确认', type: 'receiver', group: 'seller' },
            { text: '买方券商通知买方投资者：买入成交', type: 'sender', group: 'buyer' },
            { text: '卖方券商通知卖方投资者：卖出成交', type: 'sender', group: 'seller' },
            { text: '成交数据自动传送至HKSCC/CCASS系统', type: 'sender', group: 'all' }
        ],
        active: ['exchange', 'buyer-broker', 'seller-broker', 'buyer-investor', 'seller-investor', 'hkscc'],
        flows: [
            { from: 'exchange', to: 'buyer-broker', emoji: '✅', label: '成交报告' },
            { from: 'exchange', to: 'seller-broker', emoji: '✅', label: '成交报告' },
            { from: 'buyer-broker', to: 'buyer-investor', emoji: '🔔', label: '买入通知' },
            { from: 'seller-broker', to: 'seller-investor', emoji: '🔔', label: '卖出通知' },
            { from: 'exchange', to: 'hkscc', emoji: '📋', label: '成交数据' }
        ]
    },
    // ---- Phase 7: 合约更替 (Novation & CNS Netting) ----
    {
        id: 7,
        title: '合约更替',
        tTag: 'T日盘后',
        desc: 'HKSCC作为中央对手方（CCP）执行合约更替（Novation）：原始"买方券商↔卖方券商"的合约拆分为"买方券商↔HKSCC"和"HKSCC↔卖方券商"两个独立合约。随后通过CNS（持续净额交收）对每个参与者当日所有交易进行净额计算',
        emoji: '🔄',
        actions: [
            { text: 'HKSCC自动从SEHK接收全部成交数据', type: 'receiver', group: 'all' },
            { text: 'Novation：原合约替换为两个CCP合约', type: 'sender', group: 'all' },
            { text: '合约A：买方券商 ↔ HKSCC（CCP）', type: 'receiver', group: 'buyer' },
            { text: '合约B：HKSCC（CCP） ↔ 卖方券商', type: 'receiver', group: 'seller' },
            { text: 'CNS净额计算：汇总每个参与者全天交易', type: 'sender', group: 'all' },
            { text: '生成各参与者的净交收义务（净额股票+净额资金）', type: 'receiver', group: 'all' }
        ],
        active: ['hkscc', 'buyer-broker', 'seller-broker'],
        flows: [
            { from: 'hkscc', to: 'hkscc', emoji: '🔄', label: 'Novation' },
            { from: 'hkscc', to: 'buyer-broker', emoji: '📋', label: 'CCP合约A' },
            { from: 'hkscc', to: 'seller-broker', emoji: '📋', label: 'CCP合约B' },
            { from: 'hkscc', to: 'hkscc', emoji: '📊', label: 'CNS净额' }
        ]
    },
    // ---- Phase 8: 清算 (Settlement Instruction) ----
    {
        id: 8,
        title: '清算',
        tTag: 'T+1',
        desc: 'HKSCC向各参与者发出最终T+2结算指令，包含净额交收的证券和资金义务。券商核实并确认结算指令',
        emoji: emojiTypes.settle,
        actions: [
            { text: 'HKSCC发出最终净额结算指令（DvP）', type: 'sender', group: 'all' },
            { text: '买方券商接收并确认资金交付义务', type: 'receiver', group: 'buyer' },
            { text: '卖方券商接收并确认证券交付义务', type: 'receiver', group: 'seller' },
            { text: '券商核实结算指令并反馈确认', type: 'sender', group: 'all' },
            { text: '费用明细：印花税0.1%、交易征费0.00278%、交易费0.00057%、结算费0.002%', type: 'receiver', group: 'all' }
        ],
        active: ['hkscc', 'buyer-broker', 'seller-broker'],
        flows: [
            { from: 'hkscc', to: 'buyer-broker', emoji: '📋', label: '资金义务' },
            { from: 'hkscc', to: 'seller-broker', emoji: '📋', label: '证券义务' },
            { from: 'buyer-broker', to: 'hkscc', emoji: '✅', label: '确认' },
            { from: 'seller-broker', to: 'hkscc', emoji: '✅', label: '确认' }
        ]
    },
    // ---- Phase 9: 资金交收 (Fund Settlement) ----
    {
        id: 9,
        title: '资金交收',
        tTag: 'T+2',
        desc: 'T+2资金清算日：买方券商指定银行通过RTGS/CHATS将净额资金划转至HKSCC在金管局的账户，再由HKSCC划转至卖方券商指定银行',
        emoji: emojiTypes.money,
        actions: [
            { text: 'HKSCC发出资金交收指令', type: 'sender', group: 'all' },
            { text: '买方券商通知指定银行执行RTGS付款', type: 'sender', group: 'buyer' },
            { text: '买方指定银行通过RTGS/CHATS划转资金至HKSCC', type: 'sender', group: 'buyer' },
            { text: 'HKSCC确认收款，通过RTGS划转至卖方指定银行', type: 'receiver', group: 'all' },
            { text: '卖方指定银行确认资金到账', type: 'receiver', group: 'seller' },
            { text: '卖方券商更新客户信托账户余额', type: 'receiver', group: 'seller' }
        ],
        active: ['hkscc', 'buyer-broker', 'buyer-bank', 'seller-bank', 'seller-broker'],
        flows: [
            { from: 'buyer-broker', to: 'buyer-bank', emoji: '📋', label: 'RTGS指令' },
            { from: 'buyer-bank', to: 'hkscc', emoji: '💰', label: 'RTGS付款' },
            { from: 'hkscc', to: 'seller-bank', emoji: '💰', label: 'RTGS划转' },
            { from: 'seller-bank', to: 'seller-broker', emoji: '✅', label: '到账确认' }
        ]
    },
    // ---- Phase 10: 证券交收 (Securities Settlement) ----
    {
        id: 10,
        title: '证券交收',
        tTag: 'T+2',
        desc: 'T+2证券交收日（与资金交收同步进行，确保DvP券款对付）：HKSCC通过CCASS系统执行证券过户，从卖方券商CCASS参与者账户划转至买方券商CCASS参与者账户',
        emoji: emojiTypes.stock,
        actions: [
            { text: 'CCASS执行证券过户（投资者无需操作）', type: 'sender', group: 'all' },
            { text: '证券从卖方券商CCASS账户 → HKSCC账户', type: 'sender', group: 'seller' },
            { text: '证券从HKSCC账户 → 买方券商CCASS账户', type: 'receiver', group: 'buyer' },
            { text: '卖方券商确认证券已转出', type: 'receiver', group: 'seller' },
            { text: '买方券商确认证券已登记', type: 'receiver', group: 'buyer' },
            { text: 'DvP：资金交收与证券交收同步完成', type: 'receiver', group: 'all' }
        ],
        active: ['hkscc', 'seller-broker', 'buyer-broker'],
        flows: [
            { from: 'seller-broker', to: 'hkscc', emoji: '📈', label: '证券转出' },
            { from: 'hkscc', to: 'buyer-broker', emoji: '📈', label: '证券登记' },
            { from: 'hkscc', to: 'seller-broker', emoji: '✅', label: '转出确认' },
            { from: 'hkscc', to: 'buyer-broker', emoji: '✅', label: '登记确认' }
        ]
    },
    // ---- Phase 11: 持仓更新 (Portfolio Update) ----
    {
        id: 11,
        title: '持仓更新',
        tTag: 'T+2',
        desc: '券商更新投资者账户信息：买方资金扣除（含印花税及各项费用）、持仓增加；卖方资金增加、持仓减少。投资者可查询最新持仓和资金明细',
        emoji: '📊',
        actions: [
            { text: '买方券商扣除买入款+费用（印花税/佣金/征费）', type: 'sender', group: 'buyer' },
            { text: '买方券商持仓增加（CCASS已登记）', type: 'sender', group: 'buyer' },
            { text: '买方投资者可查询最新持仓', type: 'receiver', group: 'buyer' },
            { text: '卖方券商增加卖出所得（扣除费用后净额）', type: 'sender', group: 'seller' },
            { text: '卖方券商持仓减少（CCASS已过户）', type: 'sender', group: 'seller' },
            { text: '卖方投资者可查询最新持仓', type: 'receiver', group: 'seller' }
        ],
        active: ['buyer-broker', 'buyer-investor', 'seller-broker', 'seller-investor'],
        flows: [
            { from: 'buyer-broker', to: 'buyer-investor', emoji: '📊', label: '持仓+' },
            { from: 'buyer-broker', to: 'buyer-investor', emoji: '💰', label: '资金-' },
            { from: 'seller-broker', to: 'seller-investor', emoji: '📊', label: '持仓-' },
            { from: 'seller-broker', to: 'seller-investor', emoji: '💰', label: '资金+' }
        ]
    },
    // ---- Phase 12: 完成/出金 (Completion & Withdrawal) ----
    {
        id: 12,
        title: '完成',
        tTag: 'T+2 后',
        desc: 'T+2交割完成：DvP（券款对付）成功确认。卖方投资者可申请出金，资金从券商客户信托账户转回个人银行。SFC要求所有交易记录保留不少于7年',
        emoji: emojiTypes.complete,
        actions: [
            { text: 'HKSCC确认DvP交割完成（资金+证券同步到位）', type: 'sender', group: 'all' },
            { text: '买方交易完成：持仓已登记至CCASS', type: 'receiver', group: 'buyer' },
            { text: '卖方交易完成：资金已到账', type: 'receiver', group: 'seller' },
            { text: '卖方投资者可申请出金至个人银行', type: 'sender', group: 'seller' },
            { text: '出金：券商客户信托账户 → 卖方个人银行', type: 'sender', group: 'seller' },
            { text: '交易记录归档（SFC要求保留不少于7年）', type: 'receiver', group: 'all' }
        ],
        active: ['hkscc', 'buyer-investor', 'buyer-broker', 'seller-investor', 'seller-broker', 'seller-investor-bank'],
        flows: [
            { from: 'hkscc', to: 'hkscc', emoji: '✅', label: 'DvP完成' },
            { from: 'buyer-broker', to: 'buyer-investor', emoji: '🎉', label: '交易完成' },
            { from: 'seller-broker', to: 'seller-investor', emoji: '🎉', label: '交易完成' },
            { from: 'seller-broker', to: 'seller-investor-bank', emoji: '💰', label: '出金' }
        ]
    }
];
