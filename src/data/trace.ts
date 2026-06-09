import { TraceNode, InstallRecord } from '@/types';

export const installRecords: InstallRecord[] = [
  {
    id: 'INST001',
    arrivalId: 'A20260610001',
    projectId: 'P001',
    batchNo: 'HC20260610-001',
    materialName: '热轧带肋钢筋 HRB400E',
    spec: 'Φ25mm×9m',
    building: '3号楼',
    floor: '地下2层',
    unit: '1单元',
    location: 'B区',
    component: '基础底板主筋',
    constructionTeam: '上海建工钢筋班组一组',
    teamLeader: '王组长',
    teamLeaderPhone: '13811112222',
    installDate: '2026-06-11',
    quantity: 18.5,
    operator: '李师傅',
    supervisor: '技术员·赵明',
    installPhotos: ['https://picsum.photos/id/1082/750/500', 'https://picsum.photos/id/1015/750/500'],
    status: 'accepted',
    remarks: '基础底板底层主筋绑扎，间距200mm'
  },
  {
    id: 'INST002',
    arrivalId: 'A20260610001',
    projectId: 'P001',
    batchNo: 'HC20260610-001',
    materialName: '热轧带肋钢筋 HRB400E',
    spec: 'Φ25mm×9m',
    building: '3号楼',
    floor: '地下2层',
    unit: '1单元',
    location: 'C区',
    component: '框架柱主筋(基础顶~-0.050)',
    constructionTeam: '上海建工钢筋班组一组',
    teamLeader: '王组长',
    teamLeaderPhone: '13811112222',
    installDate: '2026-06-12',
    quantity: 22.3,
    operator: '张师傅',
    supervisor: '技术员·赵明',
    installPhotos: ['https://picsum.photos/id/1036/750/500'],
    status: 'inspected',
    remarks: 'KZ1、KZ2柱主筋，共12根/柱'
  },
  {
    id: 'INST003',
    arrivalId: 'A20260607004',
    projectId: 'P001',
    batchNo: 'PJ20260607-025',
    materialName: 'PVC-U排水管',
    spec: 'DN110 国标',
    building: '5号楼',
    floor: '1-3层',
    unit: '1-2单元',
    location: '立管井',
    component: '污水立管',
    constructionTeam: '南通华新建工水电班组',
    teamLeader: '陈班长',
    teamLeaderPhone: '13933334444',
    installDate: '2026-06-09',
    quantity: 450,
    operator: '刘师傅等3人',
    supervisor: '水电监理·吴工',
    installPhotos: ['https://picsum.photos/id/1039/750/500'],
    status: 'accepted',
    remarks: '排水立管每层设伸缩节、检查口'
  },
  {
    id: 'INST004',
    arrivalId: 'A20260606009',
    projectId: 'P001',
    batchNo: 'DT20260606-017',
    materialName: '电缆 YJV',
    spec: 'YJV-4×95+1×50',
    building: '地下车库',
    floor: '地下1层',
    unit: '-',
    location: '配电室→2号配电间',
    component: '主供电干线',
    constructionTeam: '上海输变电工程公司电气班组',
    teamLeader: '杨班长',
    teamLeaderPhone: '13655556666',
    installDate: '2026-06-08',
    quantity: 320,
    operator: '黄师傅',
    supervisor: '电气监理·孙工',
    installPhotos: ['https://picsum.photos/id/119/750/500'],
    status: 'inspected',
    remarks: '电缆桥架敷设，已做绝缘测试'
  },
  {
    id: 'INST005',
    arrivalId: 'A20260606009',
    projectId: 'P001',
    batchNo: 'DT20260606-017',
    materialName: '电缆 YJV',
    spec: 'YJV-4×95+1×50',
    building: '1号楼',
    floor: '1-10层',
    unit: '配电竖井',
    location: '-',
    component: '楼层供电干线',
    constructionTeam: '上海输变电工程公司电气班组',
    teamLeader: '杨班长',
    teamLeaderPhone: '13655556666',
    installDate: '2026-06-10',
    quantity: 480,
    operator: '黄师傅、林师傅',
    supervisor: '电气监理·孙工',
    installPhotos: ['https://picsum.photos/id/160/750/500'],
    status: 'installed',
    remarks: '竖井内梯架敷设，待通电验收'
  },
  {
    id: 'INST006',
    arrivalId: 'A20260604006',
    projectId: 'P001',
    batchNo: 'KP20260604-012',
    materialName: '多孔页岩砖',
    spec: '240×115×90mm MU15',
    building: '2号楼',
    floor: '3-6层',
    unit: '1单元',
    location: 'A/B户型',
    component: '室内填充墙',
    constructionTeam: '安徽中天砌筑班组',
    teamLeader: '李队长',
    teamLeaderPhone: '13877778888',
    installDate: '2026-06-06',
    quantity: 18000,
    operator: '8人作业组',
    supervisor: '土建监理·周工',
    installPhotos: ['https://picsum.photos/id/201/750/500'],
    status: 'accepted',
    remarks: '加气块底部砌200高页岩砖导墙，马牙槎留设规范'
  },
  {
    id: 'INST007',
    arrivalId: 'A20260604006',
    projectId: 'P001',
    batchNo: 'KP20260604-012',
    materialName: '多孔页岩砖',
    spec: '240×115×90mm MU15',
    building: '2号楼',
    floor: '7-9层',
    unit: '1单元',
    location: 'C户型',
    component: '厨卫周边墙体',
    constructionTeam: '安徽中天砌筑班组',
    teamLeader: '李队长',
    teamLeaderPhone: '13877778888',
    installDate: '2026-06-08',
    quantity: 12000,
    operator: '6人作业组',
    supervisor: '土建监理·李工',
    installPhotos: ['https://picsum.photos/id/225/750/500'],
    status: 'inspected',
    remarks: '厨卫反坎以上砌筑，灰缝饱满'
  }
];

export const getInstallsByArrival = (arrivalId: string): InstallRecord[] => {
  return installRecords.filter(r => r.arrivalId === arrivalId);
};

export const getInstallsByProject = (projectId: string): InstallRecord[] => {
  return installRecords.filter(r => r.projectId === projectId);
};

export const getInstallsByComponent = (projectId: string, building: string, component: string): InstallRecord[] => {
  return installRecords.filter(
    r => r.projectId === projectId && r.building === building && r.component.includes(component)
  );
};

export const getInstallsByBatch = (batchNo: string): InstallRecord[] => {
  return installRecords.filter(r => r.batchNo.includes(batchNo));
};

export const installStatusMap: Record<InstallRecord['status'], { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'pending' }> = {
  installed: { label: '已安装', type: 'info' },
  inspected: { label: '已验收', type: 'warning' },
  accepted: { label: '已确认', type: 'success' }
};

export const generateTraceChain = (arrivalId: string): TraceNode[] => {
  const nodes: TraceNode[] = [];
  return nodes;
};

export const buildings = [
  { label: '全部楼栋', value: '' },
  { label: '1号楼', value: '1号楼' },
  { label: '2号楼', value: '2号楼' },
  { label: '3号楼', value: '3号楼' },
  { label: '5号楼', value: '5号楼' },
  { label: '地下车库', value: '地下车库' }
];

export const teams = [
  '上海建工钢筋班组一组',
  '上海建工钢筋班组二组',
  '南通华新建工水电班组',
  '上海输变电工程公司电气班组',
  '安徽中天砌筑班组',
  '江苏南通混凝土班组',
  '浙江宝业防水班组',
  '上海美达幕墙班组'
];
