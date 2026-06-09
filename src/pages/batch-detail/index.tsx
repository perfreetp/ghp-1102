import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useTraceStore } from '@/store/traceStore';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';
import { ARRIVAL_STATUS, SAMPLING_STEP_LABELS, INSPECTION_CONCLUSION_MAP, RECTIFICATION_STATUS_MAP, RECTIFICATION_PRIORITY_MAP } from '@/data/constants';

export default function BatchDetailPage() {
  const router = useRouter();
  const paramBatch = ((router.params.batchNo as string) || '').trim();

  const store = useTraceStore();
  const arrivals = store.arrivals;
  const allSamplings = store.samplings;
  const allInspections = store.inspections;
  const allInstalls = store.installRecords;
  const allRects = store.rectifications;

  const allBatchNos = useMemo(() => [...new Set(arrivals.map(a => a.batchNo))], [arrivals]);

  const [searchInput, setSearchInput] = useState(paramBatch || (allBatchNos[0] || ''));
  const [batchNo, setBatchNo] = useState<string>(paramBatch || (allBatchNos[0] || ''));
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState('');

  const arrival = useMemo(() => arrivals.find(a => a.batchNo === batchNo), [arrivals, batchNo]);
  const relatedSamplings = useMemo(() =>
    arrival ? allSamplings.filter(s => s.arrivalId === arrival.id) : []
  , [allSamplings, arrival]);
  const relatedInspections = useMemo(() =>
    arrival ? allInspections.filter(i => i.arrivalId === arrival.id) : []
  , [allInspections, arrival]);
  const relatedInstalls = useMemo(() =>
    allInstalls.filter(rec => rec.materials.some(m => m.batchNo === batchNo))
  , [allInstalls, batchNo]);
  const relatedRects = useMemo(() =>
    allRects.filter(r => r.sourceBatchNo === batchNo)
  , [allRects, batchNo]);

  const hasUnqualified = relatedInspections.some(i => i.conclusion === 'unqualified');
  const hasInstall = relatedInstalls.length > 0;
  const hasRect = relatedRects.length > 0;

  const totalQty = relatedInstalls.reduce((s, r) => {
    const found = r.materials.find(m => m.batchNo === batchNo);
    return s + (found ? found.quantity : 0);
  }, 0);
  const totalUnit = arrival?.unit || '';

  const findBatchByKeyword = (kw: string): string | null => {
    if (!kw) return null;
    const low = kw.toLowerCase().trim();
    // 精确匹配
    const exact = allBatchNos.find(b => b.toLowerCase() === low);
    if (exact) return exact;
    // 包含匹配
    const inc = allBatchNos.find(b => b.toLowerCase().includes(low));
    if (inc) return inc;
    // 反向包含
    const rinc = allBatchNos.find(b => low.includes(b.toLowerCase()));
    if (rinc) return rinc;
    return null;
  };

  const handleSearch = () => {
    const kw = searchInput.trim();
    if (!kw) {
      Taro.showToast({ title: '请输入批号', icon: 'none' });
      return;
    }
    const found = findBatchByKeyword(kw);
    if (found) {
      setBatchNo(found);
      Taro.showToast({ title: '已定位到批次', icon: 'success' });
    } else {
      Taro.showToast({ title: `未找到「${kw}」，请检查批号`, icon: 'none' });
    }
  };

  const handleScan = () => {
    Taro.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        const code = (res.result || '').trim();
        setSearchInput(code);
        const found = findBatchByKeyword(code);
        if (found) {
          setBatchNo(found);
          Taro.showToast({ title: '扫码匹配到批次', icon: 'success' });
        } else {
          Taro.showModal({
            title: '扫码结果',
            content: `扫码获得「${code}」，系统暂未收录该批号。可手动输入或返回列表查看。`,
            showCancel: false,
            confirmText: '好的'
          });
        }
      },
      fail: () => {
        Taro.showActionSheet({
          itemList: ['HC20260610-001（钢筋）', 'SN20260610-008（水泥）', 'HT20260609-015（砌体）', 'DT20260606-017（电缆）'],
          success: (r) => {
            const map = ['HC20260610-001', 'SN20260610-008', 'HT20260609-015', 'DT20260606-017'];
            const code = map[r.tapIndex];
            setSearchInput(code);
            setBatchNo(code);
          }
        });
      }
    });
  };

  const handleSelectHistory = (b: string) => {
    setBatchNo(b);
    setSearchInput(b);
  };

  const handleExport = () => {
    const text = store.exportBatchLedger(batchNo);
    setExportText(text);
    setShowExport(true);
  };

  const handleCopy = () => {
    Taro.setClipboardData({
      data: exportText,
      success: () => Taro.showToast({ title: '台账已复制到剪贴板', icon: 'success' })
    });
  };

  const stepLabel = (step: number) =>
    SAMPLING_STEP_LABELS[Math.min(Math.max(step, 0), SAMPLING_STEP_LABELS.length - 1)] || '待开始';

  // 渲染空态（未找到批次时）
  if (!arrival) {
    return (
      <View className='pageContainer'>
        <View className={styles.formCard} style={{ padding: 24, borderRadius: 16 }}>
          <View style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <View className={styles.formInput} style={{ flex: 1, height: 72 }}>
              <Input
                value={searchInput}
                onInput={e => setSearchInput(e.detail.value)}
                onConfirm={handleSearch}
                placeholder='输入批号查询，如 HC20260610-001'
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 26 }}
              />
            </View>
            <View
              onClick={handleScan}
              style={{
                background: '#F2F3F5', color: '#4E5969', padding: '0 20rpx',
                height: 72, borderRadius: 12, display: 'flex', alignItems: 'center',
                fontWeight: 600, fontSize: 26, flexShrink: 0
              }}
            >
              <Text>📷</Text>
            </View>
            <View
              style={{
                background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)',
                color: '#fff', padding: '0 28rpx',
                height: 72, borderRadius: 12, display: 'flex', alignItems: 'center',
                fontWeight: 600, fontSize: 26, flexShrink: 0
              }}
              onClick={handleSearch}
            >
              <Text>🔍 查询</Text>
            </View>
          </View>
          <View style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <Text style={{ fontSize: 22, color: '#86909C', paddingTop: 4 }}>示例批号：</Text>
            {['HC20260610-001', 'SN20260610-008', 'HT20260609-015'].map(b => (
              <Text
                key={b}
                onClick={() => handleSelectHistory(b)}
                style={{
                  fontSize: 20, padding: '6rpx 16rpx', borderRadius: 20,
                  background: '#F2F3F5', color: '#4E5969',
                }}
              >{b}</Text>
            ))}
          </View>
          <EmptyState
            title={searchInput ? `批号「${searchInput}」暂未收录` : '请输入要查询的批号'}
            description='可手动输入或点击上方📷扫码模拟'
          />
        </View>
      </View>
    );
  }

  const asm = ARRIVAL_STATUS[arrival.status] || { label: '未知', type: 'info' as const };

  return (
    <View className='pageContainer' style={{ paddingBottom: 180 }}>
      <View className={styles.formCard} style={{ padding: 20, marginBottom: 16, borderRadius: 16 }}>
        <View style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <View className={styles.formInput} style={{ flex: 1, height: 72 }}>
            <Input
              value={searchInput}
              onInput={e => setSearchInput(e.detail.value)}
              onConfirm={handleSearch}
              placeholder='输入批号查询，如 HC20260610-001'
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 26 }}
            />
          </View>
          <View
            onClick={handleScan}
            style={{
              background: '#F2F3F5', color: '#4E5969', padding: '0 20rpx',
              height: 72, borderRadius: 12, display: 'flex', alignItems: 'center',
              fontWeight: 600, fontSize: 26, flexShrink: 0
            }}
          >
            <Text>📷</Text>
          </View>
          <View
            onClick={handleSearch}
            style={{
              background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)',
              color: '#fff', padding: '0 28rpx',
              height: 72, borderRadius: 12, display: 'flex', alignItems: 'center',
              fontWeight: 600, fontSize: 26, flexShrink: 0
            }}
          >
            <Text>🔍 查询</Text>
          </View>
        </View>
        <View style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Text style={{ fontSize: 22, color: '#86909C', paddingTop: 4 }}>快速切换：</Text>
          {allBatchNos.slice(0, 8).map(b => (
            <Text
              key={b}
              onClick={() => handleSelectHistory(b)}
              style={{
                fontSize: 20, padding: '6rpx 16rpx', borderRadius: 20,
                background: b === batchNo ? 'linear-gradient(135deg,#1E6FFF,#4D92FF)' : '#F2F3F5',
                color: b === batchNo ? '#fff' : '#4E5969',
                fontWeight: b === batchNo ? 500 : 400
              }}
            >{b.length > 10 ? b.slice(-10) : b}</Text>
          ))}
        </View>
      </View>

      <View className={styles.batchCard}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className={styles.batchTag}>🔍 材料批次追溯</Text>
          <StatusTag text={asm.label} type={asm.type as any} size='sm' />
        </View>
        <Text className={styles.batchNo}>{arrival.batchNo}</Text>
        <Text className={styles.batchMatName}>{arrival.materialName} · {arrival.spec}</Text>
        <View className={styles.batchStats}>
          <View className={styles.statCol}>
            <Text className={styles.statVal}>{arrival.quantity}</Text>
            <Text className={styles.statLbl}>到货总量 {arrival.unit}</Text>
          </View>
          <View className={styles.statCol}>
            <Text className={styles.statVal} style={{
              color: relatedInspections.length === 0 ? '#86909C' : (relatedInspections.every(i => i.conclusion === 'qualified') ? '#00B42A' : '#F53F3F')
            }}>{relatedInspections.filter(i => i.conclusion === 'qualified').length}/{relatedInspections.length}</Text>
            <Text className={styles.statLbl}>检测合格</Text>
          </View>
          <View className={styles.statCol}>
            <Text className={styles.statVal} style={{ color: '#722ED1' }}>{relatedInstalls.length}</Text>
            <Text className={styles.statLbl}>使用位置</Text>
          </View>
        </View>
      </View>

      {hasUnqualified ? (
        <View className={classnames(styles.statusBanner, styles.bannerErr)}>
          <View className={classnames(styles.bannerIcon, styles.iconErr)}><Text>✕</Text></View>
          <View className={styles.bannerText}>
            <Text className={styles.bannerTitle}>⚠️ 该批次含不合格检测</Text>
            <Text className={styles.bannerDesc}>已拦截使用，{relatedRects.length}项整改进行中</Text>
          </View>
          <StatusTag text='已拦截' type='error' size='sm' />
        </View>
      ) : hasInstall ? (
        <View className={classnames(styles.statusBanner, styles.bannerOk)}>
          <View className={classnames(styles.bannerIcon, styles.iconOk)}><Text>✓</Text></View>
          <View className={styles.bannerText}>
            <Text className={styles.bannerTitle}>✅ 批次流转正常</Text>
            <Text className={styles.bannerDesc}>已通过检测并完成安装使用</Text>
          </View>
          <StatusTag text='正常' type='success' size='sm' />
        </View>
      ) : (
        <View className={classnames(styles.statusBanner, styles.bannerWarn)}>
          <View className={classnames(styles.bannerIcon, styles.iconWarn)}><Text>!</Text></View>
          <View className={styles.bannerText}>
            <Text className={styles.bannerTitle}>⏳ 流转中</Text>
            <Text className={styles.bannerDesc}>
              {relatedInspections.length === 0 ? '正在检测中，请等待检测结果' : '检测完成，等待安装使用'}
            </Text>
          </View>
          <StatusTag text='流转中' type='warning' size='sm' />
        </View>
      )}

      <ScrollView scrollY className={styles.timelineWrap}>
        <Text className={styles.timelineTitle}>🔄 全生命周期追溯</Text>

        {/* Step1 到货验收 */}
        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, styles.dotDone)}><Text>1</Text></View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>📦 到货验收</Text>
              <Text className={styles.tlTime}>{arrival.arrivalTime}</Text>
            </View>
            <View className={styles.tlBody}>
              {[
                ['到货单号', arrival.id],
                ['供应商', arrival.supplier],
                ['规格', arrival.spec],
                ['数量', `${arrival.quantity}${arrival.unit}`],
                ['验收人 / 监理', `${arrival.receiver} / ${arrival.witness || '待签字'}`],
                ['运输车辆', arrival.vehicleNo || '—'],
                ['规格核对', arrival.specMatched ? '✅ 与合同一致' : '❌ 不一致'],
              ].map(([k, v]) => (
                <View key={k} className={styles.tlRow}>
                  <Text className={styles.tlKey}>{k}</Text>
                  <Text className={styles.tlVal}>{v}</Text>
                </View>
              ))}
              {arrival.remarks && (
                <View className={styles.tlRow}>
                  <Text className={styles.tlKey}>备注</Text>
                  <Text className={styles.tlVal}>{arrival.remarks}</Text>
                </View>
              )}
              <View className={styles.tlActions}>
                <View className={classnames(styles.tlBtn, styles.tlBtnGhost)}
                  onClick={() => Taro.navigateTo({ url: `/pages/arrival-detail/index?id=${arrival.id}` })}>
                  <Text>查看详情</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Step2 取样送检 */}
        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, relatedSamplings.length > 0 ? styles.dotDone : styles.dotPending)}><Text>2</Text></View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>📌 见证取样（{relatedSamplings.length}组）</Text>
              <Text className={styles.tlTime}>{relatedSamplings[0]?.samplingDate || '待取样'}</Text>
            </View>
            <View className={styles.tlBody}>
              {relatedSamplings.length === 0 ? (
                <Text style={{ fontSize: 24, color: '#86909C', padding: '12rpx 0' }}>⏳ 暂无取样记录，点击到货详情→生成取样任务</Text>
              ) : (
                relatedSamplings.map((s, idx) => {
                  const stepColors = ['#86909C', '#1E6FFF', '#1E6FFF', '#722ED1', '#722ED1', '#00B42A'];
                  const step = Math.min(Math.max(s.currentStep || 0, 0), 5);
                  return (
                    <View key={s.id} className={styles.samplingCard}>
                      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontWeight: 600, fontSize: 24 }}>组{idx + 1} · {s.samplingNo}</Text>
                        <StatusTag text={stepLabel(step)} type={step >= 5 ? 'success' : (step >= 2 ? 'primary' : 'warning')} size='sm' />
                      </View>
                      <View style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 22, color: '#4E5969', marginBottom: 8 }}>
                        <Text>👁️ 见证人：{s.witnessName}</Text>
                        <Text>📐 {s.quantity}{s.unit}</Text>
                        <Text>🏛️ {s.labName || '—'}</Text>
                      </View>
                      <View style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {SAMPLING_STEP_LABELS.map((lbl, i) => (
                          <View key={i} style={{
                            flex: 1, height: 8, borderRadius: 4,
                            background: i <= step ? stepColors[step] : '#F2F3F5',
                            position: 'relative'
                          }} />
                        ))}
                      </View>
                      <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 20, color: '#86909C' }}>
                        <Text>待取样</Text>
                        <Text>报告出具</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>

        {/* Step3 检测结论 */}
        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, relatedInspections.length > 0 ? styles.dotDone : styles.dotPending)}><Text>3</Text></View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>📊 检测报告（{relatedInspections.length}份）</Text>
              <Text className={styles.tlTime}>{relatedInspections[0]?.reportDate || '待检测'}</Text>
            </View>
            <View className={styles.tlBody}>
              {relatedInspections.length === 0 ? (
                <Text style={{ fontSize: 24, color: '#86909C', padding: '12rpx 0' }}>⏳ 等待实验室出具检测报告</Text>
              ) : (
                relatedInspections.map(i => {
                  const cm = INSPECTION_CONCLUSION_MAP[i.conclusion] || { label: '未知', type: 'info' as const };
                  return (
                    <View key={i.id} className={styles.samplingCard}>
                      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontWeight: 600, fontSize: 24 }}>{i.reportNo}</Text>
                        <StatusTag text={cm.label} type={cm.type as any} size='sm' />
                      </View>
                      <View style={{ fontSize: 22, color: '#4E5969', lineHeight: 1.8 }}>
                        <Text>📅 {i.reportDate} · 🏛️ {i.labName}</Text>
                        {i.unqualifiedItems && i.unqualifiedItems.length > 0 && (
                          <Text style={{ color: '#F53F3F' }}>
                            {'\n'}⚠️ 不合格项：{i.unqualifiedItems.join('、')}
                          </Text>
                        )}
                        {i.remarks && <Text style={{ color: '#86909C' }}>{'\n'}备注：{i.remarks}</Text>}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>

        {/* Step4 安装使用 */}
        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, hasInstall ? styles.dotDone : styles.dotPending)}><Text>4</Text></View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>📍 安装使用（{relatedInstalls.length}处 · {totalQty}{totalUnit}）</Text>
              <Text className={styles.tlTime}>{relatedInstalls[0]?.installDate || '待安装'}</Text>
            </View>
            <View className={styles.tlBody}>
              {relatedInstalls.length === 0 ? (
                <Text style={{ fontSize: 24, color: '#86909C', padding: '12rpx 0' }}>⏳ 尚未分配安装位置，检测合格后可登记</Text>
              ) : (
                relatedInstalls.map(r => {
                  const m = r.materials.find(x => x.batchNo === batchNo);
                  return (
                    <View key={r.id} className={styles.samplingCard}>
                      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={{ fontWeight: 600, fontSize: 24, display: 'block', marginBottom: 4 }}>
                            🏢 {r.building} {r.floor} · {r.componentName}
                          </Text>
                          <Text style={{ fontSize: 22, color: '#4E5969', lineHeight: 1.6, display: 'block' }}>
                            👷 班组：{r.teamName} · {r.teamLeader || ''}
                          </Text>
                          {m && (
                            <Text style={{ fontSize: 22, color: '#1E6FFF', display: 'block', marginTop: 2 }}>
                              📦 用料：{m.materialName} · {m.quantity}{m.unit}
                            </Text>
                          )}
                        </View>
                        <View
                          className={styles.tlBtn}
                          onClick={() => Taro.navigateTo({ url: '/pages/install-location/index' })}
                          style={{ padding: '4rpx 12rpx', fontSize: 20, height: 40, lineHeight: '32rpx' }}
                        >
                          <Text>位置</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>

        {/* Step5 整改记录 */}
        <View className={styles.tlItem}>
          <View className={classnames(styles.tlDot, hasRect ? styles.dotDone : styles.dotPending)}><Text>5</Text></View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>🛠️ 整改记录（{relatedRects.length}项）</Text>
              <Text className={styles.tlTime}>{relatedRects[0]?.createdAt || '无整改'}</Text>
            </View>
            <View className={styles.tlBody}>
              {relatedRects.length === 0 ? (
                <Text style={{ fontSize: 24, color: '#00B42A', padding: '12rpx 0' }}>✅ 批次合格，无整改记录</Text>
              ) : (
                relatedRects.map(r => {
                  const rsm = RECTIFICATION_STATUS_MAP[r.status];
                  const prm = RECTIFICATION_PRIORITY_MAP[r.priority];
                  return (
                    <View key={r.id} className={styles.samplingCard}>
                      <View style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                        <Text style={{ fontWeight: 600, fontSize: 24 }}>🔧 {r.rectNo}</Text>
                        <View style={{ padding: '2rpx 10rpx', borderRadius: 8, background: prm.bg, color: prm.color, fontSize: 20 }}>{prm.label}</View>
                        <StatusTag text={rsm.label} type={rsm.type as any} size='sm' />
                      </View>
                      <Text style={{ fontSize: 22, color: '#4E5969', lineHeight: 1.6, display: 'block', marginBottom: 6 }}>
                        📝 {r.description}
                      </Text>
                      {r.timeline && r.timeline.slice(-1)[0] && (
                        <Text style={{ fontSize: 20, color: '#86909C' }}>
                          最新：{r.timeline[r.timeline.length - 1].action} · {r.timeline[r.timeline.length - 1].operator} · {r.timeline[r.timeline.length - 1].time}
                        </Text>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 底部按钮栏 */}
      <View className={styles.bottomBar}>
        <View className={styles.bottomBtnGhost} onClick={() => Taro.navigateTo({ url: '/pages/install-location/index' })}>
          <Text>📍 查看使用位置</Text>
        </View>
        <View className={styles.bottomBtnPrimary} onClick={handleExport}>
          <Text>📄 导出台账</Text>
        </View>
      </View>

      {/* 导出台账弹窗 */}
      {showExport && (
        <View className={styles.modalMask} onClick={() => setShowExport(false)}>
          <View className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 30, fontWeight: 700 }}>📄 验收台账预览</Text>
              <Text style={{ color: '#86909C', fontSize: 22 }} onClick={() => setShowExport(false)}>✕ 关闭</Text>
            </View>
            <ScrollView scrollY className={styles.exportArea}>
              <Text style={{ whiteSpace: 'pre-wrap', fontSize: 24, lineHeight: 1.8, color: '#1D2129', fontFamily: 'monospace' }}>
                {exportText || '暂无台账内容'}
              </Text>
            </ScrollView>
            <View style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <View className={styles.tlBtnGhost} onClick={() => setShowExport(false)} style={{ flex: 1, justifyContent: 'center' }}>
                <Text>关闭</Text>
              </View>
              <View className={styles.bottomBtnPrimary} onClick={handleCopy} style={{ flex: 1 }}>
                <Text>📋 复制全部</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
