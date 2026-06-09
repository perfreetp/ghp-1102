import { Rectification } from '@/types';

export const rectifications: Rectification[] = [
  {
    id: 'R001',
    projectId: 'P001',
    sourceType: 'inspection',
    sourceId: 'I003',
    sourceNo: '2026-DQ-0606-015',
    title: '电缆导体直流电阻不合格整改',
    description: '2026年6月8日检测报告显示，批次DT20260606-017的YJV-4×95+1×50电缆导体直流电阻实测0.198Ω/km，超过标准值0.193Ω/km，不符合GB/T 12706.1-2020要求。该批次电缆已敷设320米至地下车库主供电干线，需立即处理。',
    rectPhotos: ['https://picsum.photos/id/1025/750/500'],
    initiator: '质量总监·陈总监',
    initiateTime: '2026-06-09 09:00',
    deadline: '2026-06-12 18:00',
    handler: '电气分包·杨经理',
    handlerPhone: '13655556666',
    handlerTeam: '上海输变电工程公司电气班组',
    status: 'reviewing',
    measures: '1. 立即停止该批次电缆的继续使用；\n2. 对已敷设的320米电缆进行加倍取样送第三方检测；\n3. 如复验仍不合格，全部拆除更换；\n4. 供应商承担所有返工费用；\n5. 同步加强后续电缆进场验收的电阻抽测。',
    resultDescription: '已从同批次电缆中加倍抽取2组40米试样，于6月10日送上海市电气设备质量检验中心复验。同时对已敷设段全部标识隔离，暂停通电。待复验结果出来后决定后续处理。',
    resultPhotos: ['https://picsum.photos/id/119/750/500', 'https://picsum.photos/id/160/750/500'],
    finishTime: '2026-06-11 16:30',
    reviewer: '监理·孙工',
    reviewTime: '',
    reviewComment: ''
  },
  {
    id: 'R002',
    projectId: 'P001',
    sourceType: 'arrival',
    sourceId: 'A20260608011',
    sourceNo: 'A20260608011',
    title: '铝合金型材壁厚不合格退货处理',
    description: '2026年6月8日到货验收时，批次GJ20260608-003的6063-T5铝合金型材实测壁厚1.2mm，不符合合同要求的1.4mm。供应商已签字确认。',
    rectPhotos: ['https://picsum.photos/id/6/750/500'],
    initiator: '材料员·王磊',
    initiateTime: '2026-06-08 16:00',
    deadline: '2026-06-10 12:00',
    handler: '供应部·黄经理',
    handlerPhone: '13855443322',
    handlerTeam: '广东凤铝铝业有限公司',
    status: 'approved',
    measures: '1. 立即办理退货手续，整车退回供应商；\n2. 供应商重新生产符合规格的产品后再送货；\n3. 纳入供应商月度考核；\n4. 后续型材进场100%壁厚检测。',
    resultDescription: '6月9日下午，不合格铝合金型材整车已运离现场，退货手续办理完毕。供应部已与供应商沟通，6月12日前重新交付符合壁厚要求的产品。已将本次事件纳入供应商考核。',
    resultPhotos: ['https://picsum.photos/id/11/750/500'],
    finishTime: '2026-06-09 18:00',
    reviewer: '总监·周总',
    reviewTime: '2026-06-10 09:30',
    reviewComment: '处理及时，符合合同要求。后续加强进厂材料的关键指标复核，避免类似事件影响工期。'
  },
  {
    id: 'R003',
    projectId: 'P003',
    sourceType: 'install',
    sourceId: 'INST005',
    sourceNo: 'INST005',
    title: '电缆竖井敷设不规范整改',
    description: '监理巡检发现，1号楼配电竖井内楼层供电干线敷设存在：1. 电缆固定间距超过规范要求1.5m；2. 部分转弯处弯曲半径不足；3. 标识牌缺失。',
    rectPhotos: ['https://picsum.photos/id/160/750/500'],
    initiator: '监理·孙工',
    initiateTime: '2026-06-11 10:30',
    deadline: '2026-06-13 17:00',
    handler: '电气班长·杨班长',
    handlerPhone: '13655556666',
    handlerTeam: '上海输变电工程公司电气班组',
    status: 'processing',
    measures: '1. 按每1.2m间距增加电缆固定卡；\n2. 转弯处重新敷设保证15D弯曲半径；\n3. 补充每段回路标识牌。',
    resultDescription: '',
    resultPhotos: [],
    finishTime: '',
    reviewer: '',
    reviewTime: '',
    reviewComment: ''
  },
  {
    id: 'R004',
    projectId: 'P001',
    sourceType: 'inspection',
    sourceId: 'I003',
    sourceNo: '2026-DQ-0606-015',
    title: '不合格电缆退场复验',
    description: 'R001整改继续推进：如加倍复验仍不合格，已敷设地下车库段必须全部拆除退场，重新采购合格产品。',
    rectPhotos: ['https://picsum.photos/id/201/750/500'],
    initiator: '质量总监·陈总监',
    initiateTime: '2026-06-11 14:00',
    deadline: '2026-06-15 18:00',
    handler: '项目总工·李工',
    handlerPhone: '13912345678',
    handlerTeam: '项目部技术组',
    status: 'pending',
    measures: '1. 6月13日前拿到复验报告；\n2. 如不合格启动拆除方案审批；\n3. 新供应商样品提前送检。',
    resultDescription: '',
    resultPhotos: [],
    finishTime: '',
    reviewer: '',
    reviewTime: '',
    reviewComment: ''
  }
];

export const getRectificationsByProject = (projectId: string): Rectification[] => {
  return rectifications.filter(r => r.projectId === projectId);
};

export const getRectificationById = (id: string): Rectification | undefined => {
  return rectifications.find(r => r.id === id);
};

export const getRectificationsBySource = (sourceType: Rectification['sourceType'], sourceId: string): Rectification[] => {
  return rectifications.filter(r => r.sourceType === sourceType && r.sourceId === sourceId);
};

export const getPendingRectifications = (): Rectification[] => {
  return rectifications.filter(r => ['pending', 'processing', 'reviewing'].includes(r.status));
};

export const rectificationStatusMap: Record<Rectification['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'pending' }> = {
  pending: { label: '待处理', type: 'warning' },
  processing: { label: '整改中', type: 'info' },
  reviewing: { label: '待确认', type: 'warning' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已驳回', type: 'error' }
};

export const sourceTypeMap: Record<Rectification['sourceType'], { label: string }> = {
  inspection: { label: '检测不合格' },
  arrival: { label: '到货问题' },
  install: { label: '安装问题' }
};