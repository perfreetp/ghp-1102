import { InstallRecord } from '@/types';

export const installRecords: InstallRecord[] = [
  {
    id: 'INST001',
    projectId: 'P001',
    building: '3号楼',
    floor: 'B2层',
    area: '基础底板B区',
    unit: '1单元',
    componentName: '基础底板主筋',
    componentCode: 'KZ-JC-B12',
    teamName: '上海建工钢筋班组一组',
    teamLeader: '王组长',
    teamPhone: '13811112222',
    installDate: '2026-06-11',
    quantity: 18.5,
    unit: '吨',
    materials: [
      {
        batchNo: 'HC20260610-001',
        materialName: '热轧带肋钢筋 HRB400E',
        spec: 'Φ25mm×9m HRB400E',
        quantity: 18.5,
        unit: '吨'
      }
    ],
    installPhotos: ['https://picsum.photos/id/1082/750/500'],
    status: 'accepted',
    remarks: '基础底板底层主筋绑扎，间距200mm'
  },
  {
    id: 'INST002',
    projectId: 'P001',
    building: '3号楼',
    floor: 'B2层',
    area: '框架柱C区',
    unit: '1单元',
    componentName: '框架柱主筋(基础顶~-0.050)',
    componentCode: 'KZ-01~12',
    teamName: '上海建工钢筋班组一组',
    teamLeader: '王组长',
    teamPhone: '13811112222',
    installDate: '2026-06-12',
    quantity: 22.3,
    unit: '吨',
    materials: [
      {
        batchNo: 'HC20260610-001',
        materialName: '热轧带肋钢筋 HRB400E',
        spec: 'Φ25mm×9m HRB400E',
        quantity: 22.3,
        unit: '吨'
      }
    ],
    installPhotos: ['https://picsum.photos/id/1036/750/500'],
    status: 'inspected',
    remarks: 'KZ1、KZ2柱主筋，共12根/柱'
  },
  {
    id: 'INST003',
    projectId: 'P001',
    building: '2号楼',
    floor: '3F',
    area: '砌体施工A区',
    unit: '1单元',
    componentName: '3层内墙砌筑',
    componentCode: 'QT-2-3-01',
    teamName: '安徽中天砌筑班组',
    teamLeader: '李队长',
    teamPhone: '13877778888',
    installDate: '2026-06-10',
    quantity: 2800,
    unit: '块',
    materials: [
      {
        batchNo: 'HT20260609-015',
        materialName: '蒸压加气混凝土砌块',
        spec: '600×200×200mm A5.0 B06',
        quantity: 2800,
        unit: '块'
      },
      {
        batchNo: 'KP20260604-012',
        materialName: '烧结多孔页岩砖 MU15',
        spec: '240×115×90mm MU15',
        quantity: 480,
        unit: '块'
      }
    ],
    installPhotos: ['https://picsum.photos/id/201/750/500'],
    status: 'accepted',
    remarks: '加气块底部砌200高页岩砖导墙，马牙槎留设规范'
  },
  {
    id: 'INST004',
    projectId: 'P001',
    building: '3号楼',
    floor: '4F',
    area: '电梯井周边',
    unit: '1单元',
    componentName: '4层外围填充墙',
    componentCode: 'QT-3-4-02',
    teamName: '安徽中天砌筑班组',
    teamLeader: '李队长',
    teamPhone: '13877778888',
    installDate: '2026-06-11',
    quantity: 3200,
    unit: '块',
    materials: [
      {
        batchNo: 'HT20260609-015',
        materialName: '蒸压加气混凝土砌块',
        spec: '600×200×200mm A5.0 B06',
        quantity: 3200,
        unit: '块'
      }
    ],
    installPhotos: ['https://picsum.photos/id/225/750/500'],
    status: 'installed',
    remarks: '外墙砌筑，待保温施工'
  },
  {
    id: 'INST005',
    projectId: 'P001',
    building: '5号楼',
    floor: '1-3层',
    area: '立管井',
    unit: '1-2单元',
    componentName: '污水立管安装',
    componentCode: 'PS-5-01',
    teamName: '南通华新建工水电班组',
    teamLeader: '陈班长',
    teamPhone: '13933334444',
    installDate: '2026-06-09',
    quantity: 450,
    unit: '米',
    materials: [
      {
        batchNo: 'PJ20260607-025',
        materialName: 'PVC-U排水管 DN110',
        spec: 'DN110 国标 4米/根',
        quantity: 450,
        unit: '米'
      }
    ],
    installPhotos: ['https://picsum.photos/id/1039/750/500'],
    status: 'accepted',
    remarks: '排水立管每层设伸缩节、检查口'
  },
  {
    id: 'INST006',
    projectId: 'P001',
    building: '地下车库',
    floor: 'B1层',
    area: '配电室→2号配电间',
    componentName: '主供电干线',
    componentCode: 'DL-GK-001',
    teamName: '上海输变电工程公司电气班组',
    teamLeader: '杨班长',
    teamPhone: '13655556666',
    installDate: '2026-06-08',
    quantity: 320,
    unit: '米',
    materials: [
      {
        batchNo: 'DT20260606-017',
        materialName: '交联聚乙烯绝缘电缆 YJV',
        spec: 'YJV-4×95+1×50',
        quantity: 320,
        unit: '米'
      }
    ],
    installPhotos: ['https://picsum.photos/id/119/750/500'],
    status: 'inspected',
    remarks: '电缆桥架敷设，已做绝缘测试'
  },
  {
    id: 'INST007',
    projectId: 'P001',
    building: '1号楼',
    floor: '1-10层',
    area: '配电竖井',
    componentName: '楼层供电干线',
    componentCode: 'DL-1-001',
    teamName: '上海输变电工程公司电气班组',
    teamLeader: '杨班长',
    teamPhone: '13655556666',
    installDate: '2026-06-10',
    quantity: 480,
    unit: '米',
    materials: [
      {
        batchNo: 'DT20260606-017',
        materialName: '交联聚乙烯绝缘电缆 YJV',
        spec: 'YJV-4×95+1×50',
        quantity: 480,
        unit: '米'
      }
    ],
    installPhotos: ['https://picsum.photos/id/160/750/500'],
    status: 'installed',
    remarks: '竖井内梯架敷设，待通电验收'
  },
  {
    id: 'INST008',
    projectId: 'P001',
    building: '2号楼',
    floor: '3-6层',
    area: 'A/B户型',
    unit: '1单元',
    componentName: '室内填充墙砌筑',
    componentCode: 'QT-2-3-02',
    teamName: '安徽中天砌筑班组',
    teamLeader: '李队长',
    teamPhone: '13877778888',
    installDate: '2026-06-06',
    quantity: 18000,
    unit: '块',
    materials: [
      {
        batchNo: 'KP20260604-012',
        materialName: '烧结多孔页岩砖 MU15',
        spec: '240×115×90mm MU15',
        quantity: 18000,
        unit: '块'
      }
    ],
    installPhotos: ['https://picsum.photos/id/201/750/500'],
    status: 'accepted',
    remarks: '灰缝饱满，拉结筋设置规范'
  },
  {
    id: 'INST009',
    projectId: 'P001',
    building: '2号楼',
    floor: '7-9层',
    area: 'C户型厨卫周边',
    unit: '1单元',
    componentName: '厨卫周边墙体',
    componentCode: 'QT-2-7-01',
    teamName: '安徽中天砌筑班组',
    teamLeader: '李队长',
    teamPhone: '13877778888',
    installDate: '2026-06-08',
    quantity: 12000,
    unit: '块',
    materials: [
      {
        batchNo: 'KP20260604-012',
        materialName: '烧结多孔页岩砖 MU15',
        spec: '240×115×90mm MU15',
        quantity: 12000,
        unit: '块'
      }
    ],
    installPhotos: ['https://picsum.photos/id/225/750/500'],
    status: 'inspected',
    remarks: '厨卫反坎以上砌筑，灰缝饱满'
  },
  {
    id: 'INST010',
    projectId: 'P001',
    building: '地下车库',
    floor: 'B1层',
    area: '顶板后浇带',
    componentName: '后浇带加强筋',
    componentCode: 'GJ-HJD-001',
    teamName: '上海建工钢筋班组二组',
    teamLeader: '赵组长',
    teamPhone: '13822334455',
    installDate: '2026-06-10',
    quantity: 4.8,
    unit: '吨',
    materials: [
      {
        batchNo: 'HC20260610-001',
        materialName: '热轧带肋钢筋 HRB400E',
        spec: 'Φ25mm×9m HRB400E',
        quantity: 4.8,
        unit: '吨'
      }
    ],
    installPhotos: ['https://picsum.photos/id/456/750/500'],
    status: 'installed',
    remarks: '后浇带800宽加强筋加密'
  },
  {
    id: 'INST011',
    projectId: 'P001',
    building: '6号楼',
    floor: '2F',
    area: '楼梯间',
    unit: '1单元',
    componentName: '踏步板浇筑钢筋',
    componentCode: 'LT-6-2-01',
    teamName: '上海建工钢筋班组二组',
    teamLeader: '赵组长',
    teamPhone: '13822334455',
    installDate: '2026-06-10',
    quantity: 1.2,
    unit: '吨',
    materials: [
      {
        batchNo: 'HC20260610-001',
        materialName: '热轧带肋钢筋 HRB400E',
        spec: 'Φ25mm×9m HRB400E',
        quantity: 1.2,
        unit: '吨'
      }
    ],
    installPhotos: ['https://picsum.photos/id/500/750/500'],
    status: 'accepted',
    remarks: '楼梯踏步双层双向'
  }
];

export const getInstallRecordsByProject = (pid: string): InstallRecord[] =>
  installRecords.filter(r => r.projectId === pid);

export const buildings = [
  { label: '全部楼栋', value: '' },
  { label: '1号楼', value: '1号楼' },
  { label: '2号楼', value: '2号楼' },
  { label: '3号楼', value: '3号楼' },
  { label: '5号楼', value: '5号楼' },
  { label: '6号楼', value: '6号楼' },
  { label: '地下车库', value: '地下车库' }
];

export const floors = ['全部', 'B2层', 'B1层', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '1-3层', '1-10层', '3-6层', '7-9层'];
