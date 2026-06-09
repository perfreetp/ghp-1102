import { ArrivalStatus, SamplingStep, InspectionConclusion, RectificationStatus } from '@/types';

export const ARRIVAL_STATUS: Record<string, { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'primary' }> = {
  pending: { label: '待验收', type: 'warning' },
  accepted: { label: '已验收', type: 'success' },
  sampling: { label: '取样中', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
  inspected: { label: '已检测', type: 'info' },
  installed: { label: '已安装', type: 'success' },
  rejected: { label: '已拒收', type: 'error' },
  mismatch: { label: '规格不符', type: 'error' },
  rectifying: { label: '整改中', type: 'error' },
};

export const SAMPLING_STEP_LABELS: string[] = [
  '待取样',
  '已完成制样',
  '已送检',
  '实验室接收',
  '检测中',
  '报告已出具',
];

export const SAMPLING_STEP_COLORS: string[] = [
  '#86909C', // 灰
  '#1E6FFF', // 蓝
  '#1E6FFF',
  '#722ED1', // 紫
  '#722ED1',
  '#00B42A', // 绿
];

export const INSPECTION_CONCLUSION_MAP: Record<InspectionConclusion, { label: string; type: 'success' | 'warning' | 'error' | 'info' }> = {
  pending: { label: '待检测', type: 'warning' },
  qualified: { label: '合格', type: 'success' },
  unqualified: { label: '不合格', type: 'error' },
  recheck: { label: '需复检', type: 'warning' },
  partial: { label: '部分合格', type: 'info' },
};

export const RECTIFICATION_STATUS_MAP: Record<RectificationStatus, { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'primary' }> = {
  pending: { label: '待处理', type: 'error' },
  processing: { label: '整改中', type: 'warning' },
  confirming: { label: '待确认', type: 'primary' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已驳回', type: 'error' },
};

export const RECTIFICATION_PRIORITY_MAP = {
  high: { label: '紧急', color: '#F53F3F', bg: '#FFECE8' },
  medium: { label: '一般', color: '#FF7D00', bg: '#FFF7E8' },
  low: { label: '轻微', color: '#1E6FFF', bg: '#E8F3FF' },
};

export const BUILDINGS: string[] = [
  '全部', '1号楼', '2号楼', '3号楼', '5号楼', '6号楼', '地下车库'
];

export const FLOORS: string[] = [
  '全部', 'B2层', 'B1层',
  '1层', '2层', '3层', '4层', '5层',
  '1-3层', '2-4层', '3-5层',
  '1-2层', '4-6层', '7-10层',
  '6层', '7层', '10层',
];

export const UNITS: string[] = [
  '全部', '1单元', '2单元', '3单元', '东单元', '西单元'
];

export const STEP_ORDER: ('arrival' | 'sampling' | 'inspection' | 'install' | 'rectification')[] = [
  'arrival', 'sampling', 'inspection', 'install', 'rectification'
];

export const STEP_LABELS = {
  arrival: '📦 到货验收',
  sampling: '🧪 取样送检',
  inspection: '📊 检测结论',
  install: '📍 安装使用',
  rectification: '🛠️ 整改记录',
};
