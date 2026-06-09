import { Inspection } from '@/types';

export const inspections: Inspection[] = [
  {
    id: 'I001',
    samplingId: 'S001',
    arrivalId: 'A20260610001',
    projectId: 'P001',
    batchNo: 'HC20260610-001',
    materialName: '热轧带肋钢筋 HRB400E',
    spec: 'Φ25mm×9m',
    reportNo: '2026-JG-0610-001',
    labName: '上海市建设工程质量检测中心第一检测站',
    inspector: '王检测师',
    inspectDate: '2026-06-11',
    conclusion: 'qualified',
    items: [
      { name: '下屈服强度Rel (MPa)', standard: '≥400', result: '435', isQualified: true },
      { name: '抗拉强度Rm (MPa)', standard: '≥540', result: '598', isQualified: true },
      { name: '断后伸长率A (%)', standard: '≥16', result: '22.5', isQualified: true },
      { name: '最大力总伸长率Agt (%)', standard: '≥7.5', result: '11.2', isQualified: true },
      { name: '强屈比 Rm/Rel', standard: '≥1.25', result: '1.37', isQualified: true },
      { name: '超屈比 Rel/R°eL', standard: '≤1.30', result: '1.09', isQualified: true },
      { name: '冷弯试验 d=3a 180°', standard: '无裂纹', result: '合格', isQualified: true },
      { name: '重量偏差 (%)', standard: '-5～+5', result: '2.8', isQualified: true }
    ],
    reInspection: false,
    blockUsage: false,
    rectificationRequired: false,
    remarks: '各项指标均符合GB 1499.2-2018标准要求',
    reportPhotos: ['https://picsum.photos/id/201/750/500']
  },
  {
    id: 'I002',
    samplingId: 'S007',
    arrivalId: 'A20260607004',
    projectId: 'P001',
    batchNo: 'PJ20260607-025',
    materialName: 'PVC-U排水管',
    spec: 'DN110 国标',
    reportNo: '2026-SL-0607-008',
    labName: '上海市塑料制品质量监督检验站',
    inspector: '李检测师',
    inspectDate: '2026-06-09',
    conclusion: 'qualified',
    items: [
      { name: '壁厚 (mm)', standard: '4.0±0.4', result: '4.1', isQualified: true },
      { name: '外径偏差 (mm)', standard: '±0.3', result: '+0.15', isQualified: true },
      { name: '纵向回缩率 (%)', standard: '≤5', result: '2.1', isQualified: true },
      { name: '落锤冲击试验', standard: 'TIR ≤10%', result: '0/20', isQualified: true },
      { name: '维卡软化温度 (℃)', standard: '≥79', result: '85', isQualified: true },
      { name: '二氯甲烷浸渍试验', standard: '表面无变化', result: '合格', isQualified: true }
    ],
    reInspection: false,
    blockUsage: false,
    rectificationRequired: false,
    remarks: '符合GB/T 5836.1-2018标准要求',
    reportPhotos: ['https://picsum.photos/id/1080/750/500']
  },
  {
    id: 'I003',
    samplingId: 'S008',
    arrivalId: 'A20260606009',
    projectId: 'P001',
    batchNo: 'DT20260606-017',
    materialName: '电缆 YJV',
    spec: 'YJV-4×95+1×50',
    reportNo: '2026-DQ-0606-015',
    labName: '上海市电气设备质量检验中心',
    inspector: '赵检测师',
    inspectDate: '2026-06-08',
    conclusion: 'unqualified',
    items: [
      { name: '导体直流电阻 (Ω/km, 20℃)', standard: '≤0.193', result: '0.198', isQualified: false },
      { name: '绝缘厚度 (mm)', standard: '1.1±0.1', result: '1.05', isQualified: true },
      { name: '护套厚度 (mm)', standard: '2.0±0.2', result: '1.95', isQualified: true },
      { name: '绝缘电阻 (MΩ·km, 70℃)', standard: '≥0.0085', result: '0.012', isQualified: true },
      { name: '耐压试验 3.5kV/5min', standard: '不击穿', result: '合格', isQualified: true },
      { name: '曲挠试验', standard: '不断线、不击穿', result: '合格', isQualified: true }
    ],
    reInspection: false,
    blockUsage: true,
    rectificationRequired: true,
    rectificationId: 'R001',
    remarks: '导体直流电阻超标0.5%，不符合GB/T 12706.1-2020标准。已责令退货或加倍取样复验',
    reportPhotos: ['https://picsum.photos/id/1025/750/500']
  },
  {
    id: 'I004',
    samplingId: 'S011',
    arrivalId: 'A20260604006',
    projectId: 'P001',
    batchNo: 'KP20260604-012',
    materialName: '多孔页岩砖',
    spec: '240×115×90mm MU15',
    reportNo: '2026-QT-0604-022',
    labName: '上海市建材质量监督检验站',
    inspector: '孙检测师',
    inspectDate: '2026-06-06',
    conclusion: 'qualified',
    items: [
      { name: '抗压强度平均值 (MPa)', standard: '≥15.0', result: '16.8', isQualified: true },
      { name: '抗压强度标准值 (MPa)', standard: '≥10.0', result: '12.3', isQualified: true },
      { name: '密度等级 (kg/m³)', standard: 'B06 ≤800', result: '765', isQualified: true },
      { name: '孔洞率 (%)', standard: '≥25', result: '29.5', isQualified: true },
      { name: '吸水率 (%)', standard: '≤16', result: '12.8', isQualified: true },
      { name: '泛霜试验', standard: '无泛霜', result: '合格', isQualified: true },
      { name: '石灰爆裂试验', standard: '最大破坏尺寸≤2mm', result: '合格', isQualified: true }
    ],
    reInspection: false,
    blockUsage: false,
    rectificationRequired: false,
    remarks: '各项指标符合GB/T 13544-2011标准要求',
    reportPhotos: ['https://picsum.photos/id/1044/750/500']
  }
];

export const getInspectionsByProject = (projectId: string): Inspection[] => {
  return inspections.filter(i => i.projectId === projectId);
};

export const getInspectionsByArrival = (arrivalId: string): Inspection[] => {
  return inspections.filter(i => i.arrivalId === arrivalId);
};

export const getInspectionsBySampling = (samplingId: string): Inspection | undefined => {
  return inspections.find(i => i.samplingId === samplingId);
};

export const getInspectionById = (id: string): Inspection | undefined => {
  return inspections.find(i => i.id === id);
};

export const getUnqualifiedInspections = (): Inspection[] => {
  return inspections.filter(i => i.conclusion === 'unqualified');
};

export const inspectionConclusionMap: Record<Inspection['conclusion'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'pending' }> = {
  qualified: { label: '合格', type: 'success' },
  unqualified: { label: '不合格', type: 'error' },
  partial: { label: '部分合格', type: 'warning' }
};
