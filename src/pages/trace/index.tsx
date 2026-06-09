import React, { useState, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useTraceStore } from '@/store/traceStore';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';
import { ARRIVAL_STATUS, BUILDINGS, SAMPLING_STEP_LABELS, INSPECTION_CONCLUSION_MAP } from '@/data/constants';

export default function TracePage() {
  const store = useTraceStore();
  const [mode, setMode] = useState<'batch' | 'component'>('batch');
  const [query, setQuery] = useState('');

  const projectArrivals = store.arrivals;
  const allSamplings = store.samplings;
  const allInspections = store.inspections;
  const allInstalls = store.installRecords;
  const allRects = store.rectifications;

  const pendingRects = useMemo(() => allRects.filter(
    r => ['pending', 'processing', 'confirming'].includes(r.status)
  ), [allRects]);

  const matchResults = useMemo(() => {
    if (!query) return [];
    const kw = query.toLowerCase();
    const matched = projectArrivals.filter(a =>
      a.batchNo.toLowerCase().includes(kw) ||
      a.materialName.toLowerCase().includes(kw)
    );
    return matched.slice(0, 5);
  }, [query, projectArrivals]);

  const handleEntry = (action: string) => {
    switch (action) {
      case 'reverse':
        setMode('component');
        break;
      case 'batch':
        Taro.navigateTo({ url: '/pages/batch-detail/index' });
        break;
      case 'install':
        Taro.navigateTo({ url: '/pages/install-location/index' });
        break;
      case 'export':
        Taro.showActionSheet({
          itemList: ['导出来货验收台账', '导出取样送检台账', '导出检测报告台账', '导出整改记录'],
          success: () => {
            Taro.showToast({ title: '已生成导出文件', icon: 'success' });
          }
        });
        break;
      case 'inspect':
        Taro.navigateTo({ url: '/pages/inspection/index' });
        break;
      case 'rect':
        Taro.navigateTo({ url: '/pages/rectification/index' });
        break;
    }
  };

  const handleGoBatchDetail = (batchNo: string) => {
    Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${batchNo}` });
  };

  const handleGoArrival = (id: string) => {
    Taro.navigateTo({ url: `/pages/arrival-detail/index?id=${id}` });
  };

  const getSamplingsOfArrival = (arrivalId: string) =>
    allSamplings.filter(s => s.arrivalId === arrivalId);

  const getInspectionsOfArrival = (arrivalId: string) =>
    allInspections.filter(i => i.arrivalId === arrivalId);

  const getInstallsOfBatch = (batchNo: string) =>
    allInstalls.filter(rec => rec.materials.some(m => m.batchNo === batchNo));

  const entries = [
    { icon: '🏗️', title: '按构件反查', desc: '从安装位置追溯材料批次来源', cls: styles.iconReverse, action: 'reverse' },
    { icon: '📊', title: '按批次追溯', desc: '输入批号查看全生命周期', cls: styles.iconRange, action: 'batch' },
    { icon: '📍', title: '安装位置', desc: `楼栋分配 · ${allInstalls.length}条记录`, cls: styles.iconInstall, action: 'install' },
    { icon: '📁', title: '导出台账', desc: '验收记录、取样、检测数据导出', cls: styles.iconExport, action: 'export' },
    { icon: '🧪', title: '检测管理', desc: `录入结论 · ${allInspections.length}份报告`, cls: styles.iconInspect, action: 'inspect' },
    { icon: '🛠️', title: '整改跟踪', desc: `${pendingRects.length}项待处理整改`, cls: styles.iconRect, action: 'rect' }
  ];

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>质量追溯</Text>
        <Text className='pageSubtitle'>全链路追溯 · 双向溯源 · 台账导出</Text>
      </View>

      {pendingRects.length > 0 && (
        <View className={styles.warningBanner} onClick={() => handleEntry('rect')}>
          <Text className={styles.warningIcon}>⚠️</Text>
          <View className={styles.warningContent}>
            <Text className={styles.warningTitle}>
              有 {pendingRects.length} 项待处理整改
            </Text>
            <Text className={styles.warningDesc}>
              请及时跟进处理，点击查看详情 →
            </Text>
          </View>
        </View>
      )}

      <View className={styles.entryGrid}>
        {entries.map(e => (
          <View key={e.action} className={styles.entryCard} onClick={() => handleEntry(e.action)}>
            <View className={classnames(styles.entryIcon, e.cls)}>
              <Text>{e.icon}</Text>
            </View>
            <Text className={styles.entryTitle}>{e.title}</Text>
            <Text className={styles.entryDesc}>{e.desc}</Text>
          </View>
        ))}
      </View>

      <View className={styles.querySection}>
        <View className={styles.queryTitle}>
          <Text>🔍</Text>
          <Text>{mode === 'batch' ? '批次号 / 材料名 查询' : '按构件位置反查'}</Text>
        </View>

        {mode === 'batch' ? (
          <>
            <View className={styles.inputRow}>
              <View className={styles.inputBox}>
                <Input
                  className={styles.input}
                  placeholder='请输入批次号或材料名称（如 HC20260610-001）'
                  value={query}
                  onInput={(e) => setQuery(e.detail.value)}
                  confirmType='search'
                  onConfirm={() => matchResults.length > 0 ? handleGoBatchDetail(matchResults[0].batchNo) : null}
                />
              </View>
              <View
                className={styles.searchBtn}
                onClick={() => {
                  if (matchResults.length > 0) {
                    handleGoBatchDetail(matchResults[0].batchNo);
                  } else {
                    Taro.showToast({ title: '未找到该批号', icon: 'none' });
                  }
                }}
              >
                <Text>查询</Text>
              </View>
            </View>
            <View className={styles.quickTags}>
              {['HC20260610-001', 'SN20260610-008', 'HT20260609-015', 'DT20260606-017'].map(t => (
                <View key={t} className={styles.quickTag} onClick={() => setQuery(t)}>
                  <Text>{t}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View className={styles.quickTags} style={{ marginBottom: 16 }}>
              {BUILDINGS.slice(1).map(b => (
                <View key={b} className={styles.quickTag} onClick={() => {
                  Taro.navigateTo({ url: '/pages/install-location/index' });
                }}>
                  <Text>📍 {b}</Text>
                </View>
              ))}
            </View>
            <View className={styles.quickTags}>
              {['基础底板主筋', '框架柱主筋', '污水立管', '主供电干线', '室内填充墙'].map(c => (
                <View key={c} className={styles.quickTag} onClick={() => {
                  setQuery(c);
                  setMode('batch');
                }}>
                  <Text>🏗️ {c}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {query && (
        <>
          <Text className='cardTitle' style={{ marginBottom: 16 }}>
            查询结果（{matchResults.length}）
          </Text>

          {matchResults.length === 0 ? (
            <EmptyState title='未匹配到批次' description='请输入正确的批号或材料名' />
          ) : (
            matchResults.map(a => {
              const asm = ARRIVAL_STATUS[a.status];
              const traceSamplings = getSamplingsOfArrival(a.id);
              const traceInspections = getInspectionsOfArrival(a.id);
              const traceInstalls = getInstallsOfBatch(a.batchNo);
              const hasUnqualified = traceInspections.some(i => i.conclusion === 'unqualified');

              const stepLabel = (step: number) =>
                SAMPLING_STEP_LABELS[Math.min(step, SAMPLING_STEP_LABELS.length - 1)] || '待开始';

              return (
                <View key={a.id} className={styles.resultCard}>
                  <View className={styles.resultHeader} onClick={() => handleGoArrival(a.id)}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text className={styles.resultTitle}>{a.materialName} {a.spec}</Text>
                      <Text className={styles.resultBatch}>批次：{a.batchNo}</Text>
                    </View>
                    <StatusTag text={asm.label} type={asm.type} size='sm' />
                  </View>

                  {hasUnqualified && (
                    <View style={{ paddingBottom: 16, color: '#F53F3F', fontSize: 22, fontWeight: 600 }}>
                      ⚠️ 存在不合格检测项，已限制使用
                    </View>
                  )}

                  <View className={styles.pathBox}>
                    {[
                      { step: '📦 到货验收', info: `${a.arrivalTime} · 验收：${a.receiver} · 监理：${a.witness || '待签字'}` },
                      { step: `🧪 取样送检（${traceSamplings.length}组）`,
                        info: traceSamplings.length > 0
                          ? `${traceSamplings.map(s => stepLabel(s.currentStep)).join('、')}`
                          : '尚未取样' },
                      { step: `📊 检测报告（${traceInspections.length}份）`,
                        info: traceInspections.length > 0
                          ? `${traceInspections.map(i => INSPECTION_CONCLUSION_MAP[i.conclusion]?.label || '检测中').join('、')}`
                          : '等待检测' },
                      { step: `📍 安装记录（${traceInstalls.length}处）`,
                        info: traceInstalls.length > 0
                          ? `涉及${[...new Set(traceInstalls.map(i => i.building))].length}栋 · ${traceInstalls.map(i => i.componentName).slice(0, 2).join('、')}${traceInstalls.length > 2 ? '…' : ''}`
                          : '尚未分配安装位置' }
                    ].map((p, i) => (
                      <View key={i} className={styles.pathNode}>
                        <View className={styles.pathDot} />
                        <View className={styles.pathContent}>
                          <Text className={styles.pathStep}>{p.step}</Text>
                          <Text className={styles.pathInfo}>{p.info}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View className={styles.statRow}>
                    <View className={styles.statCol} onClick={(e) => { e.stopPropagation(); Taro.switchTab({ url: '/pages/sampling/index' }); }}>
                      <Text className={styles.statNum}>{traceSamplings.length}</Text>
                      <Text className={styles.statLabel}>取样组数</Text>
                    </View>
                    <View className={styles.statCol}>
                      <Text className={styles.statNum} style={{ color: traceInspections.length > 0 && traceInspections.every(i => i.conclusion === 'qualified') ? '#00B42A' : (traceInspections.length === 0 ? '#86909C' : '#F53F3F') }}>
                        {traceInspections.length}
                      </Text>
                      <Text className={styles.statLabel}>检测报告</Text>
                    </View>
                    <View className={styles.statCol} onClick={(e) => { e.stopPropagation(); Taro.navigateTo({ url: '/pages/install-location/index' }); }}>
                      <Text className={styles.statNum} style={{ color: '#722ED1' }}>{traceInstalls.length}</Text>
                      <Text className={styles.statLabel}>安装位置</Text>
                    </View>
                  </View>

                  <View className={styles.actionRow}>
                    <View
                      className={styles.primaryActionBtn}
                      onClick={() => handleGoBatchDetail(a.batchNo)}
                    >
                      <Text>📊 查看完整追溯链路</Text>
                    </View>
                    <View
                      className={styles.secondaryActionBtn}
                      onClick={() => handleGoArrival(a.id)}
                    >
                      <Text>📦 到货详情</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </>
      )}

      {!query && (
        <View style={{ marginTop: 8 }}>
          <Text className='cardTitle' style={{ marginBottom: 16 }}>快速查询入口</Text>
          {projectArrivals.slice(0, 4).map(a => (
            <View key={a.id} className={styles.resultCard}>
              <View className={styles.resultHeader}>
                <View style={{ flex: 1 }} onClick={() => handleGoArrival(a.id)}>
                  <Text className={styles.resultTitle}>{a.materialName} {a.spec}</Text>
                  <Text className={styles.resultBatch}>批次：{a.batchNo} · {a.supplierName}</Text>
                </View>
                <View className={styles.quickTag} onClick={(e) => {
                  e.stopPropagation();
                  handleGoBatchDetail(a.batchNo);
                }}>
                  <Text style={{ color: '#1E6FFF' }}>追溯链路 →</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
