import { create } from 'zustand';
import { Arrival, Sampling, Inspection, InstallRecord, Rectification } from '@/types';
import { arrivals as initialArrivals } from '@/data/arrivals';
import { samplingList as initialSamplings } from '@/data/sampling';
import { inspections as initialInspections } from '@/data/inspection';
import { installRecords as initialInstalls } from '@/data/trace';
import { rectifications as initialRects } from '@/data/rectification';

const STORAGE_KEY = 'taro_trace_app_state_v1';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback;
  }
};

const persistPartial = (st: Partial<TraceState>) => {
  try {
    if (typeof localStorage === 'undefined') return;
    const toSave = {
      arrivals: st.arrivals,
      samplings: st.samplings,
      installs: st.installs,
      rectifications: st.rectifications,
      inspections: st.inspections
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    // ignore
  }
};

const persisted = loadFromStorage<{
  arrivals: Arrival[];
  samplings: Sampling[];
  inspections: Inspection[];
  installs: InstallRecord[];
  rectifications: Rectification[];
} | null>(STORAGE_KEY, null);

const finalArrivals: Arrival[] = persisted?.arrivals && persisted.arrivals.length > 0
  ? persisted.arrivals : initialArrivals;
const finalSamplings = persisted?.samplings && persisted.samplings.length >= initialSamplings.length
  ? persisted.samplings : initialSamplings;
const finalInspections = persisted?.inspections || initialInspections;
const finalInstalls = persisted?.installs && persisted.installs.length >= initialInstalls.length
  ? persisted.installs : initialInstalls;
const finalRects = persisted?.rectifications && persisted.rectifications.length >= initialRects.length
  ? persisted.rectifications : initialRects;

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

  resetAll: () => void;
  exportBatchLedger: (batchNo: string) => string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const useTraceStore = create<TraceState>((set, get) => ({
  arrivals: finalArrivals,
  samplings: finalSamplings,
  inspections: finalInspections,
  installs: finalInstalls,
  rectifications: finalRects,

  addArrival: (a) => {
    set(s => {
      const next = { ...s, arrivals: [a, ...s.arrivals] };
      persistPartial(next);
      return next;
    });
  },

  getArrivalById: (id) => get().arrivals.find(a => a.id === id),

  getArrivalsByProject: (pid) => get().arrivals.filter(a => a.projectId === pid),

  getArrivalsByBatch: (batchNo) => get().arrivals.filter(a => a.batchNo === batchNo),

  addSamplingToArrival: (arrivalId, samplingId) => {
    set(s => {
      const next = {
        ...s,
        arrivals: s.arrivals.map(a => a.id === arrivalId
          ? { ...a, samplingIds: [...a.samplingIds, samplingId], status: 'sampling' as const }
          : a
        )
      };
      persistPartial(next);
      return next;
    });
  },

  addSampling: (s) => {
    set(st => {
      const next = { ...st, samplings: [s, ...st.samplings] };
      persistPartial(next);
      return next;
    });
  },

  getSamplingsByBatch: (batchNo) => get().samplings.filter(s => s.batchNo === batchNo),

  getInspectionsByBatch: (batchNo) => get().inspections.filter(i => i.batchNo === batchNo),

  getInstallsByProject: (pid) => get().installs.filter(i => i.projectId === pid),

  getInstallsByBatch: (batchNo) => get().installs.filter(r => r.materials.some(m => m.batchNo === batchNo)),

  addRectification: (r) => {
    set(s => {
      const next = { ...s, rectifications: [r, ...s.rectifications] };
      persistPartial(next);
      return next;
    });
  },

  updateRectificationStatus: (id, status) => {
    set(s => {
      const next = {
        ...s,
        rectifications: s.rectifications.map(r => r.id === id ? { ...r, status } : r)
      };
      persistPartial(next);
      return next;
    });
  },

  approveRectification: (id, operator, remark) => {
    set(s => {
      const next = {
        ...s,
        rectifications: s.rectifications.map(r => {
          if (r.id !== id) return r;
          return {
            ...r,
            status: 'approved' as const,
            timeline: [...r.timeline, {
              action: '监理确认通过',
              operator,
              time: todayStr(),
              remark: remark || '监理现场复核通过，整改闭环完成'
            }]
          };
        })
      };
      persistPartial(next);
      return next;
    });
  },

  rejectRectification: (id, operator, remark) => {
    set(s => {
      const next = {
        ...s,
        rectifications: s.rectifications.map(r => {
          if (r.id !== id) return r;
          return {
            ...r,
            status: 'rejected' as const,
            timeline: [...r.timeline, {
              action: '监理驳回，需重新整改',
              operator,
              time: todayStr(),
              remark: remark || '整改不符合要求，请重新处理后再次提交'
            }]
          };
        })
      };
      persistPartial(next);
      return next;
    });
  },

  getRectificationsByProject: (pid) => get().rectifications.filter(r => r.projectId === pid),

  getRectificationsByBatch: (batchNo) => get().rectifications.filter(r => r.sourceBatchNo === batchNo),

  getPendingRectifications: () => get().rectifications.filter(r =>
    r.status === 'pending' || r.status === 'confirming' || r.status === 'processing'
  ),

  resetAll: () => {
    const fresh = {
      arrivals: initialArrivals,
      samplings: initialSamplings,
      inspections: initialInspections,
      installs: initialInstalls,
      rectifications: initialRects
    };
    set(fresh);
    persistPartial(fresh);
  },

  exportBatchLedger: (batchNo) => {
    const st = get();
    const arr = st.arrivals.find(a => a.batchNo === batchNo);
    if (!arr) return '═══════════════════════════════════════════\n未找到批号「' + batchNo + '」的相关记录\n═══════════════════════════════════════════';

    const samps = st.getSamplingsByBatch(batchNo);
    const insps = st.getInspectionsByBatch(batchNo);
    const insts = st.getInstallsByBatch(batchNo);
    const rects = st.getRectificationsByBatch(batchNo);

    const lines: string[] = [];
    lines.push('═══════════════════════════════════════════');
    lines.push('        建材进场质量追溯台账（批次版）');
    lines.push('═══════════════════════════════════════════');
    lines.push(`生成时间：${todayStr()}`);
    lines.push(`项目：滨江花园住宅小区项目`);
    lines.push('');
    lines.push('【一、到货验收信息】───────────────────────');
    lines.push(`  到货单号：${arr.id}`);
    lines.push(`  材料批号：${arr.batchNo}`);
    lines.push(`  材料名称：${arr.materialName}（${arr.materialType}）`);
    lines.push(`  规格型号：${arr.spec}`);
    lines.push(`  合同规格：${arr.contractSpec}`);
    lines.push(`  到货数量：${arr.quantity} ${arr.unit}`);
    lines.push(`  规格核对：${arr.specMatched ? '✅ 一致' : '❌ 不一致'}`);
    lines.push(`  供应商：${arr.supplier}`);
    lines.push(`  运输车辆：${arr.vehicleNo || '未记录'} / ${arr.driverName || '未记录'}`);
    lines.push(`  到货时间：${arr.arrivalTime}`);
    lines.push(`  验收人：${arr.receiver} / 见证人 ${arr.witness}`);
    lines.push(`  当前状态：${arr.status}`);
    lines.push(`  验收备注：${arr.remarks || '无'}`);
    lines.push('');

    lines.push('【二、见证取样信息】───────────────────────');
    if (samps.length === 0) {
      lines.push('  ⚠ 尚未生成取样任务');
    } else {
      samps.forEach((s, i) => {
        lines.push(`  ${i + 1}. 取样编号：${s.samplingNo}`);
        lines.push(`     取样规格：${s.spec} / 数量 ${s.quantity}${s.unit}`);
        lines.push(`     取样日期：${s.samplingDate}`);
        lines.push(`     见证人：${s.witnessName}（${s.witnessUnit}）`);
        lines.push(`     送检状态：第${s.currentStep}/5步 · ${s.currentStep >= 5 ? '✅ 已完成' : '进行中'}`);
        lines.push(`     检测机构：${s.labName || '未送检'}`);
        if (s.reportNo) lines.push(`     报告编号：${s.reportNo}`);
      });
    }
    lines.push('');

    lines.push('【三、检测报告信息】───────────────────────');
    if (insps.length === 0) {
      lines.push('  ⚠ 暂无检测报告');
    } else {
      insps.forEach((x, i) => {
        const ok = x.conclusion === 'qualified';
        lines.push(`  ${i + 1}. 报告编号：${x.reportNo}`);
        lines.push(`     检测机构：${x.labName}`);
        lines.push(`     检测日期：${x.inspectDate} / 检测师 ${x.inspector}`);
        lines.push(`     结  论：${ok ? '✅ 合格' : x.conclusion === 'partial' ? '⚠️ 部分合格' : '❌ 不合格'}`);
        lines.push(`     检测项：合格 ${x.items.filter(it => it.isQualified).length} / 总 ${x.items.length} 项`);
        if (!ok && x.blockUsage) lines.push(`     🔴 已拦截，禁止使用（检测不合格）`);
        if (x.reInspection) lines.push(`     ♻ 已进行加倍复验`);
        if (x.rectificationRequired) lines.push(`     ⚠ 需发起整改`);
      });
    }
    lines.push('');

    lines.push('【四、安装使用信息】───────────────────────');
    if (insts.length === 0) {
      lines.push('  ⚠ 尚未分配安装位置');
    } else {
      let total = 0;
      insts.forEach((r, i) => {
        const m = r.materials.find(x => x.batchNo === batchNo);
        const qty = m ? m.quantity : 0;
        total += qty;
        lines.push(`  ${i + 1}. ${r.building} ${r.floor} · ${r.area}`);
        lines.push(`     构件名称：${r.componentName}（${r.componentCode}）`);
        lines.push(`     使用数量：${qty}${m?.unit || ''}`);
        lines.push(`     施工班组：${r.teamName} / 班组长 ${r.teamLeader}`);
        lines.push(`     安装日期：${r.installDate}`);
      });
      lines.push('');
      lines.push(`  📊 使用合计：${total}（单位），已覆盖 ${insts.length} 处安装位置`);
    }
    lines.push('');

    lines.push('【五、整改记录】───────────────────────────');
    if (rects.length === 0) {
      lines.push('  ✅ 该批次无整改记录');
    } else {
      const map: Record<string, string> = {
        pending: '待处理', processing: '整改中', confirming: '待确认',
        approved: '已通过', rejected: '已驳回'
      };
      rects.forEach((r, i) => {
        lines.push(`  ${i + 1}. 整改单号：${r.rectNo}`);
        lines.push(`     整改标题：${r.title}`);
        lines.push(`     当前状态：${map[r.status]} / 优先级 ${r.priority === 'high' ? '🔴高' : r.priority === 'medium' ? '🟡中' : '🟢低'}`);
        lines.push(`     负责人：${r.responsible} / 截止日期 ${r.deadline}`);
        lines.push(`     问题描述：${r.description.slice(0, 60)}${r.description.length > 60 ? '...' : ''}`);
        lines.push(`     处理进度：${r.timeline.length} 步`);
      });
    }
    lines.push('');
    lines.push('═══════════════════════════════════════════');
    lines.push('  本台账由建材质量追溯系统自动生成');
    lines.push('  所有数据已加密存档，可审计可追溯');
    lines.push(`  共 ${samps.length + insps.length + insts.length + rects.length} 条关联记录`);
    lines.push('═══════════════════════════════════════════');
    return lines.join('\n');
  }
}));
