import { Rectification } from '@/types';

export const rectifications: Rectification[] = [
  {
    id: 'R001',
    rectNo: 'ZG20260610-001',
    projectId: 'P001',
    sourceType: 'inspection',
    sourceBatchNo: 'GJH20260609-007',
    source: '检测报告BG20260612-0166',
    title: '钢筋屈服强度不合格',
    description: 'Φ20mm HRB400钢筋检测报告显示屈服强度实测值415MPa，低于HRB400E要求的≥400MPa标准且屈强比超限，同时抗震要求不满足。已按规范要求清退出场处理，严禁在工程中使用该批次材料。',
    priority: 'high',
    status: 'confirming',
    responsible: '王磊（材料员）',
    location: '3号楼12层钢筋堆放场',
    deadline: '2026-06-12 18:00',
    createdBy: '王建国（监理）',
    createDate: '2026-06-10 10:30',
    timeline: [
      {
        action: '发起整改',
        operator: '王建国（监理总监）',
        time: '2026-06-10 10:30',
        remark: '检测报告不合格，立即启动整改'
      },
      {
        action: '指派整改',
        operator: '项目经理-张总',
        time: '2026-06-10 11:00',
        remark: '指派材料员王磊负责清退处理，同步联系供应商换货'
      },
      {
        action: '开始整改',
        operator: '王磊（材料员）',
        time: '2026-06-10 14:20',
        remark: '已联系供应商江阴长达钢铁，约定6月11日运走不合格批次并补发HRB400E合格钢筋'
      },
      {
        action: '提交整改',
        operator: '王磊（材料员）',
        time: '2026-06-11 16:40',
        remark: '28.5吨不合格钢筋已清退出场（离场照片已附），同规格HRB400E合格钢筋已补发到位（新批号HC20260611-015）'
      }
    ]
  },
  {
    id: 'R002',
    rectNo: 'ZG20260609-002',
    projectId: 'P001',
    sourceType: 'arrival',
    sourceBatchNo: 'HC20260610-001',
    source: '到货验收-A20260610001',
    title: '钢筋外观局部锈蚀',
    description: 'Φ25mm×9m HRB400E钢筋在第3、4捆发现局部轻微浮锈（面积约3-5%），集中于捆扎接触处。需进行除锈处理后方可使用，监理现场确认除锈质量。',
    priority: 'medium',
    status: 'approved',
    responsible: '上海建工钢筋班组',
    location: '2号楼堆场东侧',
    deadline: '2026-06-11 12:00',
    createdBy: '李明远（监理）',
    createDate: '2026-06-10 09:00',
    timeline: [
      {
        action: '发起整改',
        operator: '李明远（土建监理）',
        time: '2026-06-10 09:00',
        remark: '到货验收时发现外观浮锈'
      },
      {
        action: '指派整改',
        operator: '施工主管-李工',
        time: '2026-06-10 09:30',
        remark: '钢筋班组负责人工钢丝刷除锈'
      },
      {
        action: '开始整改',
        operator: '钢筋班组王组长',
        time: '2026-06-10 14:00',
        remark: '安排3名工人除锈，预计4小时完成'
      },
      {
        action: '提交整改',
        operator: '钢筋班组王组长',
        time: '2026-06-10 18:20',
        remark: '除锈完成，共清理4捆钢筋，除锈后外光光洁，已附除锈前后对比照片'
      },
      {
        action: '监理确认通过',
        operator: '李明远（土建监理）',
        time: '2026-06-11 09:15',
        remark: '现场复核除锈质量，锈蚀已完全清除，允许正常使用'
      }
    ]
  },
  {
    id: 'R003',
    rectNo: 'ZG20260608-003',
    projectId: 'P001',
    sourceType: 'install',
    sourceBatchNo: 'HT20260609-015',
    source: '3号楼4层-安装验收',
    title: '加气块砌筑灰缝厚度不均',
    description: '3号楼4层东侧墙体抽查10个灰缝点，发现3处厚度超过规范要求的15mm（实测18-22mm），2处低于8mm。需按交底要求重新调整灰缝厚度，确保满足GB 50203规范要求。',
    priority: 'medium',
    status: 'confirming',
    responsible: '安徽中天砌筑班组',
    location: '3号楼4F 401-403室填充墙',
    deadline: '2026-06-12 12:00',
    createdBy: '李明远（监理）',
    createDate: '2026-06-11 15:20',
    timeline: [
      {
        action: '发起整改',
        operator: '李明远（土建监理）',
        time: '2026-06-11 15:20',
        remark: '砌体工程隐蔽验收时发现灰缝偏差'
      },
      {
        action: '指派整改',
        operator: '砌筑主管-王工',
        time: '2026-06-11 16:00',
        remark: '对不符合要求部位进行返工，重新挂线砌筑'
      },
      {
        action: '开始整改',
        operator: '安徽中天李队长',
        time: '2026-06-12 08:30',
        remark: '安排4名工人对问题部位返工，拆除问题砌体重新组砌'
      },
      {
        action: '提交整改',
        operator: '安徽中天李队长',
        time: '2026-06-12 11:50',
        remark: '返工完成，灰缝厚度重新抽查8个点均在10-12mm范围内，已附整改后尺量照片'
      }
    ]
  },
  {
    id: 'R004',
    rectNo: 'ZG20260607-004',
    projectId: 'P001',
    sourceType: 'patrol',
    sourceBatchNo: 'KP20260604-012',
    source: '日常巡检-2号楼5层',
    title: '页岩砖未提前浇水湿润',
    description: '2号楼5层页岩砖砌筑当日气温32℃，检查发现砌筑前未按要求提前浇水湿润（含水率要求10-15%），砖表面干燥。已要求立即停工整改，浇水湿润后方可继续施工。',
    priority: 'low',
    status: 'processing',
    responsible: '安徽中天砌筑班组',
    location: '2号楼5层作业面',
    deadline: '2026-06-13 17:00',
    createdBy: '王建国（监理）',
    createDate: '2026-06-12 09:30',
    timeline: [
      {
        action: '发起整改',
        operator: '王建国（监理总监）',
        time: '2026-06-12 09:30',
        remark: '高温天气施工，砖未湿润易产生砂浆失水影响强度'
      },
      {
        action: '指派整改',
        operator: '砌筑主管-王工',
        time: '2026-06-12 10:00',
        remark: '立即暂停作业，下午14:00后重新浇水湿润（提前2小时）'
      },
      {
        action: '开始整改',
        operator: '安徽中天李队长',
        time: '2026-06-12 12:00',
        remark: '已洒水车全面浇水，砖块已覆盖养护膜待下午使用'
      }
    ]
  },
  {
    id: 'R005',
    rectNo: 'ZG20260606-005',
    projectId: 'P001',
    sourceType: 'inspection',
    sourceBatchNo: 'KP20260604-012',
    source: '检测报告BG20260608-0062',
    title: '页岩砖单块最小抗压强度接近临界值',
    description: '多孔页岩砖MU15检测结果显示，10块试样中2块强度实测值15.1MPa，仅略高于标准要求15.0MPa，离散性较大。需对后续砌筑部位重点监控砂浆饱满度，建议进行加倍取样复验。',
    priority: 'low',
    status: 'approved',
    responsible: '试验员-小周',
    location: '工地试验室',
    deadline: '2026-06-10 18:00',
    createdBy: '李明远（监理）',
    createDate: '2026-06-08 14:00',
    timeline: [
      {
        action: '发起整改',
        operator: '李明远（土建监理）',
        time: '2026-06-08 14:00',
        remark: '建议复验确认'
      },
      {
        action: '指派整改',
        operator: '技术部-赵工',
        time: '2026-06-08 15:00',
        remark: '安排试验员加倍取样20块进行复验'
      },
      {
        action: '开始整改',
        operator: '试验员-小周',
        time: '2026-06-09 09:00',
        remark: '已现场加倍取样，已送检同济检测站'
      },
      {
        action: '提交整改',
        operator: '试验员-小周',
        time: '2026-06-10 16:30',
        remark: '复验报告（BG20260610-0122）显示20块平均强度16.8MPa，最小值15.7MPa，均满足MU15要求'
      },
      {
        action: '监理确认通过',
        operator: '李明远（土建监理）',
        time: '2026-06-10 17:45',
        remark: '复验合格，同意继续使用'
      }
    ]
  }
];

export const getRectificationsByProject = (pid: string): Rectification[] =>
  rectifications.filter(r => r.projectId === pid);

export const getRectificationsByBatch = (batch: string): Rectification[] =>
  rectifications.filter(r => r.sourceBatchNo && r.sourceBatchNo.includes(batch));

export const rectPriorityMap = {
  high: { text: '高', color: '#F53F3F' },
  medium: { text: '中', color: '#FF7D00' },
  low: { text: '低', color: '#00B42A' }
};

export const rectStatusMap: Record<string, { label: string; type: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'trace' }> = {
  pending: { label: '待处理', type: 'warning' },
  processing: { label: '整改中', type: 'info' },
  confirming: { label: '待确认', type: 'pending' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已驳回', type: 'error' }
};
