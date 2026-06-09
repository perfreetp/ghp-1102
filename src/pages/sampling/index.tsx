import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { currentProjectId } from '@/data/projects';
import { useTraceStore } from '@/store/traceStore';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';
import { SAMPLING_STEP_LABELS } from '@/data/constants';

const statusFilters = [
  { label: '全部', value: '', minStep: 0, maxStep: 99 },
  { label: '待取样', value: 'pending', minStep: 0, maxStep: 0 },
  { label: '制样已完成', value: 'sampling', minStep: 1, maxStep: 1 },
  { label: '已送检', value: 'sent', minStep: 2, maxStep: 2 },
  { label: '检测中', value: 'testing', minStep: 3, maxStep: 4 },
  { label: '已出报告', value: 'done', minStep: 5, maxStep: 99 },
];

const timelineSteps = ['现场取样', '已封样', '送检测机构', '检测机构接收', '出具报告'];

// 根据取样记录获得兼容currentStep（不管原来有没有，都给个值）
const resolveStep = (s: any): number => {
  if (typeof s.currentStep === 'number') return Math.min(Math.max(s.currentStep, 0), 5);
  // 兼容老status字段
  const map: Record<string, number> = { pending: 0, sampling: 1, made: 1, sent: 2, sealed: 2, testing: 3, received: 4, done: 5 };
  return map[s.status] ?? 1;
};

// 给取样号、见证人单位、检测机构给默认值保证不空
const resolveField = <T,>(val: T | undefined, fallback: T): T => (val === undefined || val === null || (val as any) === '' ? fallback : val);

export default function SamplingPage() {
  const store = useTraceStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [, setTick] = useState(0);

  useDidShow(() => setTick(t => t + 1));

  const allSamplings = useMemo(() => store.samplings.filter(s => s.projectId === currentProjectId) || [], [store.samplings]);

  const handleScan = () => {
    Taro.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        const code = (res.result || '').trim();
        setSearchText(code);
        Taro.showToast({ title: `扫码:${code.slice(0, 10)}…`, icon: 'none' });
      },
      fail: () => {
        Taro.showActionSheet({
          itemList: ['HC20260610-001（钢筋，2条取样）', 'SN20260610-008（水泥）', '见证人：周志强', '取样号S2026061003（KP砖）'],
          success: (r) => {
            const map = ['HC20260610-001', 'SN20260610-008', '周志强', 'S2026061003'];
            setSearchText(map[r.tapIndex]);
          }
        });
      }
    });
  };

  const filteredList = useMemo(() => {
    return allSamplings.filter(s => {
      const step = resolveStep(s);
      if (statusFilter) {
        const f = statusFilters.find(x => x.value === statusFilter);
        if (f && (step < f.minStep || step > f.maxStep)) return false;
      }
      if (searchText) {
        const kw = searchText.toLowerCase();
        return (
          resolveField(s.materialName, '').toLowerCase().includes(kw) ||
          resolveField(s.batchNo, '').toLowerCase().includes(kw) ||
          resolveField(s.samplingNo, '').toLowerCase().includes(kw) ||
          resolveField(s.witnessName, '').includes(searchText) ||
          resolveField(s.witnessUnit, '').includes(searchText) ||
          resolveField(s.labName, '').toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [allSamplings, statusFilter, searchText]);

  const stats = useMemo(() => {
    const stepOf = (s: any) => resolveStep(s);
    return {
      total: allSamplings.length,
      pending: allSamplings.filter(s => stepOf(s) <= 1).length,
      testing: allSamplings.filter(s => stepOf(s) >= 2 && stepOf(s) <= 4).length,
      done: allSamplings.filter(s => stepOf(s) >= 5).length
    };
  }, [allSamplings]);

  const stepToStatusInfo = (step: number) => {
    if (step >= 5) return { text: '已出报告', type: 'success' as const };
    if (step >= 2) return { text: '送检中', type: 'primary' as const };
    if (step >= 1) return { text: '制样完成', type: 'warning' as const };
    return { text: '待取样', type: 'warning' as const };
  };

  const getStepStatus = (idx: number, step: number) => {
    // 0-based step转换：timelineSteps[0]对应现场取样step>=1开始点亮
    const curLight = step; // step=0都没点亮，step=1对应点亮第0和节点
    if (idx + 1 <= curLight) return idx + 1 < curLight ? 'done' : 'active';
    return 'pending';
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>取样送检</Text>
        <Text className='pageSubtitle'>见证取样 · 跟踪送检 · 录入检测</Text>
      </View>

      <SearchBar
        placeholder='搜索批号/取样号/见证人/机构'
        value={searchText}
        onChange={setSearchText}
        onScan={handleScan}
      />

      <View className={styles.statBar}>
        <View className={styles.statCard} style={{ borderColor: '#1E6FFF' }}>
          <Text className={styles.statNum} style={{ color: '#1E6FFF' }}>{stats.total}</Text>
          <Text className={styles.statLbl}>总数</Text>
        </View>
        <View className={styles.statCard} style={{ borderColor: '#FF7D00' }}>
          <Text className={styles.statNum} style={{ color: '#FF7D00' }}>{stats.pending}</Text>
          <Text className={styles.statLbl}>待送检</Text>
        </View>
        <View className={styles.statCard} style={{ borderColor: '#722ED1' }}>
          <Text className={styles.statNum} style={{ color: '#722ED1' }}>{stats.testing}</Text>
          <Text className={styles.statLbl}>检测中</Text>
        </View>
        <View className={styles.statCard} style={{ borderColor: '#00B42A' }}>
          <Text className={styles.statNum} style={{ color: '#00B42A' }}>{stats.done}</Text>
          <Text className={styles.statLbl}>已完成</Text>
        </View>
      </View>

      <View className={styles.filterBar}>
        {statusFilters.map(f => (
          <View
            key={f.value}
            className={classnames(styles.filterItem, statusFilter === f.value && styles.filterActive)}
            onClick={() => setStatusFilter(f.value)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingBottom: 200 }}>
        {filteredList.length === 0 ? (
          <EmptyState
            title={searchText ? `未找到「${searchText}」的取样记录` : '暂无取样记录'}
            description='到货验收后可生成见证取样任务'
            actionText='去新增取样'
            onAction={() => Taro.navigateTo({ url: '/pages/sampling-create/index' })}
          />
        ) : (
          filteredList.map(s => {
            const step = resolveStep(s);
            const info = stepToStatusInfo(step);
            // 补齐默认值，保证所有字段不空
            const samplingNo = resolveField(s.samplingNo, `QY-${s.batchNo.slice(-8)}`);
            const spec = resolveField(s.spec, resolveField(s.materialName, '材料规格'));
            const quantity = resolveField(s.quantity, 1);
            const unit = resolveField(s.unit, '组');
            const samplingDate = resolveField(s.samplingDate, '2026-06-10');
            const labName = resolveField(s.labName, '上海市建设工程质量检测中心');
            const witnessName = resolveField(s.witnessName, '周志强');
            const witnessUnit = resolveField(s.witnessUnit, '上海建科监理有限公司');
            const batchShort = (s.batchNo || '').slice(-10);

            return (
              <View key={s.id} className={styles.card}>
                <View className={styles.cardHead}>
                  <View className={styles.headLeft}>
                    <View className={styles.qyIcon}><Text>🧪</Text></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text className={styles.qyNo}>{samplingNo}</Text>
                      <Text className={styles.matName}>{s.materialName || '见证取样'} · 批号{batchShort}</Text>
                    </View>
                  </View>
                  <StatusTag text={info.text} type={info.type} size='sm' />
                </View>

                <View className={styles.cardBody}>
                  <View className={styles.infoGrid}>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>取样规格</Text>
                      <Text className={styles.cellVal}>{spec}</Text>
                    </View>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>取样数量</Text>
                      <Text className={styles.cellVal}>{quantity}{unit}</Text>
                    </View>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>取样日期</Text>
                      <Text className={styles.cellVal}>{samplingDate}</Text>
                    </View>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>送检进度</Text>
                      <Text className={styles.cellVal} style={{ color: step >= 5 ? '#00B42A' : (step >= 2 ? '#1E6FFF' : '#FF7D00'), fontWeight: 600 }}>
                        {SAMPLING_STEP_LABELS[step] || '流转中'}
                      </Text>
                    </View>
                    <View className={styles.cell} style={{ gridColumn: '1 / -1' }}>
                      <Text className={styles.cellLbl}>检测机构</Text>
                      <Text className={styles.cellVal}>{labName}</Text>
                    </View>
                  </View>
                </View>

                <View className={styles.timelineWrap}>
                  <Text className={styles.tlTitle}>📍 送检流程进度（步骤{step}/5）</Text>
                  <View className={styles.tlBar}>
                    {timelineSteps.map((tlStep, i) => {
                      const st = getStepStatus(i, step);
                      return (
                        <View key={i} className={styles.tlStep}>
                          <View className={classnames(
                            styles.tlDot,
                            st === 'done' && styles.dotDone,
                            st === 'active' && styles.dotActive,
                            st === 'pending' && styles.dotPending
                          )}>
                            <Text>{st === 'done' ? '✓' : i + 1}</Text>
                          </View>
                          <Text className={classnames(
                            styles.tlLabel,
                            st !== 'pending' && styles.tlLabelActive
                          )}>{tlStep}</Text>
                          {i < timelineSteps.length - 1 && (
                            <View className={classnames(
                              styles.tlConnector,
                              st === 'done' && styles.connDone
                            )} />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View className={styles.witnessRow}>
                  <View className={styles.witAvatar}>
                    <Text>{witnessName.slice(0, 1)}</Text>
                  </View>
                  <View className={styles.witInfo} style={{ flex: 1, minWidth: 0 }}>
                    <Text className={styles.witName}>监理见证人：{witnessName}</Text>
                    <Text className={styles.witUnit}>{witnessUnit}</Text>
                  </View>
                  <View
                    className={styles.traceBtn}
                    onClick={() => Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${s.batchNo}` })}
                  >
                    <Text>🔗 追溯批次</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View className='fabBtn' onClick={() => Taro.navigateTo({ url: '/pages/sampling-create/index' })}>
        <Text style={{ fontSize: 36 }}>+</Text>
      </View>
    </View>
  );
}
