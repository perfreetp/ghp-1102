import { create } from 'zustand';
import { Arrival, Sampling, Inspection, InstallRecord, Rectification } from '@/types';
import { arrivals as initialArrivals } from '@/data/arrivals';
import { samplingList as initialSamplings } from '@/data/sampling';
import { inspections as initialInspections } from '@/data/inspection';
import { installRecords as initialInstalls } from '@/data/trace';
import { rectifications as initialRects } from '@/data/rectification';

interface TraceState {
  arrivals: Arrival[];
  samplings: Sampling[];
  inspections: Inspection[];
  installs: InstallRecord[];
  rectifications: Rectification[];

  addArrival: (a: Arrival) => void;
  getArrivalById: (id: string) => Arrival | undefined;
  getArrivalsByProject: (pid: string) => Arrival[];
  getArrivalsByBatch: (batchNo: string) => Arrival[];
  addSamplingToArrival: (arrivalId: string, samplingId: string) => void;

  addSampling: (s: Sampling) => void;
  getSamplingsByBatch: (batchNo: string) => Sampling[];

  getInspectionsByBatch: (batchNo: string) => Inspection[];

  getInstallsByProject: (pid: string) => InstallRecord[];
  getInstallsByBatch: (batchNo: string) => InstallRecord[];

  addRectification: (r: Rectification) => void;
  updateRectificationStatus: (id: string, status: Rectification['status']) => void;
  approveRectification: (id: string, operator: string, remark?: string) => void;
  rejectRectification: (id: string, operator: string, remark?: string) => void;
  getRectificationsByProject: (pid: string) => Rectification[];
  getRectificationsByBatch: (batchNo: string) => Rectification[];
  getPendingRectifications: () => Rectification[];

  exportBatchLedger: (batchNo: string) => string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const useTraceStore = create<TraceState>((set, get) => ({
  arrivals: [...initialArrivals],
  samplings: [...initialSamplings],
  inspections: [...initialInspections],
  installs: [...initialInstalls],
  rectifications: [...initialRects],

  addArrival: (a) => set(s => ({ arrivals: [a, ...s.arrivals] })),

  getArrivalById: (id) => get().arrivals.find(a => a.id === id),

  getArrivalsByProject: (pid) => get().arrivals.filter(a => a.projectId === pid),

  getArrivalsByBatch: (batchNo) => get().arrivals.filter(a => a.batchNo === batchNo),

  addSamplingToArrival: (arrivalId, samplingId) => set(s => ({
    arrivals: s.arrivals.map(a => a.id === arrivalId
      ? { ...a, samplingIds: [...a.samplingIds, samplingId], status: 'sampling' }
      : a
    )
  })),

  addSampling: (s) => set(st => ({ samplings: [s, ...st.samplings] })),

  getSamplingsByBatch: (batchNo) => get().samplings.filter(s => s.batchNo === batchNo),

  getInspectionsByBatch: (batchNo) => get().inspections.filter(i => i.batchNo === batchNo),

  getInstallsByProject: (pid) => get().installs.filter(i => i.projectId === pid),

  getInstallsByBatch: (batchNo) => get().installs.filter(r => r.materials.some(m => m.batchNo === batchNo)),

  addRectification: (r) => set(s => ({ rectifications: [r, ...s.rectifications] })),

  updateRectificationStatus: (id, status) => set(s => ({
    rectifications: s.rectifications.map(r => r.id === id ? { ...r, status } : r)
  })),

  approveRectification: (id, operator, remark) => set(s => ({
    rectifications: s.rectifications.map(r => {
      if (r.id !== id) return r;
      const stepName = '监理确认通过';
      return {
        ...r,
        status: 'approved',
        timeline: [...r.timeline, {
          action: stepName,
          operator,
          time: todayStr(),
          remark: remark || '监理现场复核通过，整改闭环完成'
        }]
      };
    })
  })),

  rejectRectification: (id, operator, remark) => set(s => ({
    rectifications: s.rectifications.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        status: 'rejected',
        timeline: [...r.timeline, {
          action: '监理驳回，需重新整改',
          operator,
          time: todayStr(),
          remark: remark || '整改不符合要求，请重新处理后再次提交'
        }]
      };
    })
  })),

  getRectificationsByProject: (pid) => get().rectifications.filter(r => r.projectId === pid),

  getRectificationsByBatch: (batchNo) => get().rectifications.filter(r => r.sourceBatchNo === batchNo),

  getPendingRectifications: () => get().rectifications.filter(r =>
    r.status === 'pending' || r.status === 'confirming' || r.status === 'processing'
  ),

  exportBatchLedger: (batchNo) => {
    const st = get();
    const arr = st.arrivals.find(a => a.batchNo === batchNo);
    if (!arr) return '未找到该批次';

    const samps = st.getSamplingsByBatch(batchNo);
    const insps = st.getInspectionsByBatch(batchNo);
    const insts = st.getInstallsByBatch(batchNo);
    const rects = st.getRectificationsByBatch(batchNo);

    const lines: string[] = [];
    lines.push('═══════════════════════════════════════════');
    lines.push('        建材进场质量追溯台账（批次版）');
    lines.push('═══════════════════════════════════════════');
    lines.push(`生成时间：${todayStr()}`);
    lines.push('');
    lines.push('【一、到货验收信息】');
    lines.push(`  到货单号：${arr.id}`);
    lines.push(`  材料批号：${arr.batchNo}`);
    lines.push(`  材料名称：${arr.materialName}（${arr.materialType}）`);
    lines.push(`  规格型号：${arr.spec}`);
    lines.push(`  合同规格：${arr.contractSpec}`);
    lines.push(`  到货数量：${arr.quantity} ${arr.unit}`);
    lines.push(`  规格核对：${arr.specMatched ? '✅ 一致' : '❌ 不一致'}`);
    lines.push(`  供应商：${arr.supplier}`);
    lines.push(`  运输车辆：${arr.vehicleNo} / ${arr.driverName}`);
    lines.push(`  到货时间：${arr.arrivalTime}`);
    lines.push(`  验收人：${arr.receiver} / 见证人 ${arr.witness}`);
    lines.push(`  验收备注：${arr.remarks || '无'}`);
    lines.push('');

    lines.push('【二、见证取样信息】');
    if (samps.length === 0) {
      lines.push('  ⚠ 尚未生成取样任务');
    } else {
      samps.forEach((s, i) => {
        lines.push(`  ${i + 1}. 取样编号：${s.samplingNo}`);
        lines.push(`     取样规格：${s.spec} / 数量 ${s.quantity}${s.unit}`);
        lines.push(`     取样日期：${s.samplingDate}`);
        lines.push(`     见证人：${s.witnessName}（${s.witnessUnit}）`);
        lines.push(`     送检状态：第${s.currentStep}/5步 · ${s.currentStep >= 5 ? '✅ 已完成' : '进行中'}`);
      });
    }
    lines.push('');

    lines.push('【三、检测报告信息】');
    if (insps.length === 0) {
      lines.push('  ⚠ 暂无检测报告');
    } else {
      insps.forEach((x, i) => {
        lines.push(`  ${i + 1}. 报告编号：${x.reportNo}`);
        lines.push(`     检测机构：${x.labName}`);
        lines.push(`     检测日期：${x.inspectDate} / 检测师 ${x.inspector}`);
        const ok = x.conclusion === 'qualified';
        lines.push(`     结  论：${ok ? '✅ 合格' : '❌ 不合格'}`);
        lines.push(`     不合格项：${x.items.filter(it => !it.isQualified).length}/${x.items.length}项`);
        if (!ok && x.blockUsage) lines.push(`     🔴 已拦截，禁止使用`);
        if (x.reInspection) lines.push(`     ♻ 已进行加倍复验`);
      });
    }
    lines.push('');

    lines.push('【四、安装使用信息】');
    if (insts.length === 0) {
      lines.push('  ⚠ 尚未分配安装位置');
    } else {
      let total = 0;
      insts.forEach((r, i) => {
        const m = r.materials.find(x => x.batchNo === batchNo);
        const qty = m ? m.quantity : 0;
        total += qty;
        lines.push(`  ${i + 1}. ${r.building} ${r.floor} - ${r.componentName}（${r.componentCode}）`);
        lines.push(`     使用数量：${qty}${m?.unit || ''} / 施工班组 ${r.teamName}`);
        lines.push(`     班组长：${r.teamLeader} / 安装日期 ${r.installDate}`);
      });
      lines.push('');
      lines.push(`  📊 使用合计：${total} 单位，已覆盖 ${insts.length} 处安装位置`);
    }
    lines.push('');

    lines.push('【五、整改记录】');
    if (rects.length === 0) {
      lines.push('  ✅ 该批次无整改记录');
    } else {
      rects.forEach((r, i) => {
        const map: Record<string, string> = {
          pending: '待处理', processing: '整改中', confirming: '待确认',
          approved: '已通过', rejected: '已驳回'
        };
        lines.push(`  ${i + 1}. ${r.rectNo} - ${r.title}`);
        lines.push(`     当前状态：${map[r.status]} / 优先级 ${r.priority === 'high' ? '🔴高' : r.priority === 'medium' ? '🟡中' : '🟢低'}`);
        lines.push(`     负责人：${r.responsible} / 截止 ${r.deadline}`);
        lines.push(`     问题描述：${r.description}`);
      });
    }
    lines.push('');
    lines.push('═══════════════════════════════════════════');
    lines.push('  本台账由建材质量追溯系统自动生成');
    lines.push('  数据加密存档，任何修改均可审计追溯');
    lines.push('═══════════════════════════════════════════');
    return lines.join('\n');
  }
}));
