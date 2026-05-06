export const CONFIG = {
  actionDuration: 3000,
  pulseOutDuration: 500,
  pulseInDuration: 700,
  flowFinishDelay: 500,
  emojiFadeDuration: 300,
  scheduleBuffer: 1500,
  scheduleBase: 4000,
  selfLoopMinDuration: 2500,
  initialSpeed: 2,
};

export const ENTITY_CONFIG = {
  'buyer-investor': {
    positionClass: 'top-[3%] left-[1%]',
    icon: '👤', name: '买方投资者', role: '买入股票',
    side: 'left',
  },
  'buyer-broker': {
    positionClass: 'top-[25%] left-[1%]',
    icon: '🏢', name: '买方券商', role: '买方经纪',
    side: 'left',
  },
  'buyer-bank': {
    positionClass: 'top-[47%] left-[1%]',
    icon: '🏦', name: '买方指定银行', role: '券商结算银行',
    side: 'left',
  },
  'buyer-investor-bank': {
    positionClass: 'top-[69%] left-[3%]',
    icon: '💳', name: '买方个人银行', role: '入金来源',
    side: 'left',
  },
  'exchange': {
    positionClass: 'top-[15%] left-[50%] -translate-x-1/2',
    icon: '📊', name: '联交所(SEHK)', role: '撮合成交',
    side: 'center',
  },
  'hkscc': {
    positionClass: 'top-[55%] left-[50%] -translate-x-1/2',
    icon: '🏛️', name: 'HKSCC/CCASS', role: '中央对手方/结算',
    side: 'center',
  },
  'seller-investor': {
    positionClass: 'top-[3%] right-[1%]',
    icon: '👤', name: '卖方投资者', role: '卖出股票',
    side: 'right',
  },
  'seller-broker': {
    positionClass: 'top-[25%] right-[1%]',
    icon: '🏢', name: '卖方券商', role: '卖方经纪',
    side: 'right',
  },
  'seller-bank': {
    positionClass: 'top-[47%] right-[1%]',
    icon: '🏦', name: '卖方指定银行', role: '券商结算银行',
    side: 'right',
  },
  'seller-investor-bank': {
    positionClass: 'top-[69%] right-[3%]',
    icon: '💳', name: '卖方个人银行', role: '出金目标',
    side: 'right',
  },
};
