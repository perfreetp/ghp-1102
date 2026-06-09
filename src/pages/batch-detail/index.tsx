import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useTraceStore } from '@/store/traceStore';
import StatusTag from '@/components/StatusTag';

export default function BatchDetailPage() {
  const router = useRouter();
  const paramBatch = (router.params.batchNo as string) || '';

  const store = useTraceStore();
  const arrivals = store.arrivals;

  const allBatchNos = useMemo(() => {
    return [...new Set(arrivals.map(a => a.batchNo))];
  }, [arrivals]);

  const [searchInput, setSearchInput] = useState(paramBatch || arrivals[0]?.batchNo || '');
  const [batchNo, setBatchNo] = useState(paramBatch || arrivals[0]?.batchNo || '');
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState('');

  const arrival = useMemo(() => arrivals.find(a => a.batchNo === batchNo), [arrivals, batchNo]);
  const relatedSamplings = useMemo(() => store.getSamplingsByBatch(batchNo), [store, batchNo]);
  const relatedInspections = useMemo(() => store.getInspectionsByBatch(batchNo), [store, batchNo]);
  const relatedInstalls = useMemo(() => store.getInstallsByBatch(batchNo), [store, batchNo]);
  const relatedRects = useMemo(() => store.getRectificationsByBatch(batchNo), [store, batchNo]);

  const hasUnqualified = relatedInspections.some(i => i.conclusion === 'unqualified');
  const hasInstall = relatedInstalls.length > 0;
  const hasRect = relatedRects.length > 0;

  const totalQty = relatedInstalls.reduce((s, r) => {
    const found = r.materials.find(m => m.batchNo === batchNo);
    return s + (found ? found.quantity : 0);
  }, 0);

  const handleSearch = () => {
    const match = allBatchNos.find(b =>
      b.toLowerCase().includes(searchInput.toLowerCase()) ||
      searchInput.toLowerCase().includes(b.toLowerCase())
    );
    if (match) {
      setBatchNo(match);
      Taro.showToast({ title: '已找到批次', icon: 'success' });
    } else {
      Taro.showModal({
        title: '未找到批次',
        content: `批号「${searchInput}」暂无追溯记录，下方为示例数据`,
        showCancel: false,
        success: () => setBatchNo(allBatchNos[0] || '')
      });
    }
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
      success: () => Taro.showToast({ title: '台账已复制', icon: 'success' })
    });
  };

  if (!arrival) {
    return (
      <View className='pageContainer'>
        <View className={styles.formCard} style={{ padding: 24 }}>
          <View style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <View className={styles.formInput} style={{ flex: 1 }}>
              <input
                value={searchInput}
                onInput={e => setSearchInput(e.detail.value)}
                placeholder='输入批号查询，如 HC20260610-001'
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 26 }}
              />
            </View>
            <View
              style={{
                background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)',
                color: '#fff',
                padding: '0 24px',
                height: 80,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: 26
              }}
              onClick={handleSearch}
            >
              <Text>🔍 查询</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, color: '#86909C', textAlign: 'center', display: 'block', padding: '64rpx 0' }}>
            暂无该批次追溯记录
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className='pageContainer' style={{ paddingBottom: 180 }}>
      <View className={styles.formCard} style={{
        padding: 20,
        marginBottom: 16,
        borderRadius: 16
      }}>
        <View style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <View className={styles.formInput} style={{ flex: 1, height: 72 }}>
            <input
              value={searchInput}
              onInput={e => setSearchInput(e.detail.value)}
              onConfirm={handleSearch}
              placeholder='输入批号查询，如 HC20260610-001'
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 26 }}
            />
          </View>
          <View
            onClick={handleSearch}
            style={{
              background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)',
              color: '#fff',
              padding: '0 28rpx',
              height: 72,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: 26,
              flexShrink: 0
            }}
          >
            <Text>🔍 查询</Text>
          </View>
        </View>
        <View style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Text style={{ fontSize: 22, color: '#86909C', paddingTop: 4 }}>快速切换：</Text>
          {allBatchNos.slice(0, 6).map(b => (
            <Text
              key={b}
              onClick={() => handleSelectHistory(b)}
              style={{
                fontSize: 20,
                padding: '6rpx 16rpx',
                borderRadius: 20,
                background: b === batchNo ? 'linear-gradient(135deg,#1E6FFF,#4D92FF)' : '#F2F3F5',
                color: b === batchNo ? '#fff' : '#4E5969',
                fontWeight: b === batchNo ? 500 : 400
              }}
            >
              {b.slice(-8)}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.batchCard}>
        <Text className={styles.batchTag}>🔍 材料批次追溯</Text>
        <Text className={styles.batchNo}>{arrival.batchNo}</Text>
        <Text className={styles.batchMatName}>{arrival.materialName} · {arrival.spec}</Text>
        <View className={styles.batchStats}>
          <View className={styles.statCol}>
            <Text className={styles.statVal}>{arrival.quantity}</Text>
            <Text className={styles.statLbl}>到货总量({arrival.unit})</Text>
          </View>
          <View className={styles.statCol}>
            <Text className={styles.statVal}>{relatedInspections.filter(i => i.conclusion === 'qualified').length}/{relatedInspections.length}</Text>
            <Text className={styles.statLbl}>检测合格</Text>
          </View>
          <View className={styles.statCol}>
            <Text className={styles.statVal}>{relatedInstalls.length}</Text>
            <Text className={styles.statLbl}>使用位置</Text>
          </View>
        </View>
      </View>

      {hasUnqualified ? (
        <View className={classnames(styles.statusBanner, styles.bannerErr)}>
          <View className={classnames(styles.bannerIcon, styles.iconErr)}>
            <Text>✕</Text>
          </View>
          <View className={styles.bannerText}>
            <Text className={styles.bannerTitle}>⚠️ 该批次含不合格检测</Text>
            <Text className={styles.bannerDesc}>已拦截使用，{relatedRects.length}项整改进行中</Text>
          </View>
          <StatusTag text='已拦截' type='error' size='sm' />
        </View>
      ) : hasInstall ? (
        <View className={classnames(styles.statusBanner, styles.bannerOk)}>
          <View className={classnames(styles.bannerIcon, styles.iconOk)}>
            <Text>✓</Text>
          </View>
          <View className={styles.bannerText}>
            <Text className={styles.bannerTitle}>✅ 批次流转正常</Text>
            <Text className={styles.bannerDesc}>已通过检测并完成安装使用</Text>
          </View>
          <StatusTag text='正常' type='success' size='sm' />
        </View>
      ) : (
        <View className={classnames(styles.statusBanner, styles.bannerWarn)}>
          <View className={classnames(styles.bannerIcon, styles.iconWarn)}>
            <Text>!</Text>
          </View>
          <View className={styles.bannerText}>
            <Text className={styles.bannerTitle}>⏳ 流转中</Text>
            <Text className={styles.bannerDesc}>正在检测中，请等待检测结果</Text>
          </View>
          <StatusTag text='流转中' type='warning' size='sm' />
        </View>
      )}

      <View className={styles.timelineWrap}>
        <Text className={styles.timelineTitle}>🔄 全生命周期追溯</Text>

        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, styles.dotDone)}><Text>1</Text></View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>📦 到货验收</Text>
              <Text className={styles.tlTime}>{arrival.arrivalTime}</Text>
            </View>
            <View className={styles.tlBody}>
              <View className={styles.tlRow}>
                <Text className={styles.tlKey}>到货单号</Text>
                <Text className={styles.tlVal}>{arrival.id}</Text>
              </View>
              <View className={styles.tlRow}>
                <Text className={styles.tlKey}>供应商</Text>
                <Text className={styles.tlVal}>{arrival.supplier}</Text>
              </View>
              <View className={styles.tlRow}>
                <Text className={styles.tlKey}>数量/规格</Text>
                <Text className={styles.tlVal}>{arrival.quantity}{arrival.unit} · {arrival.spec}</Text>
              </View>
              <View className={styles.tlRow}>
                <Text className={styles.tlKey}>验收人</Text>
                <Text className={styles.tlVal}>{arrival.receiver} / 监理 {arrival.witness}</Text>
              </View>
              <View className={styles.tlRow}>
                <Text className={styles.tlKey}>规格核对</Text>
                <Text className={styles.tlVal} style={{ color: arrival.specMatched ? '#00B42A' : '#F53F3F' }}>
                  {arrival.specMatched ? '✅ 与合同一致' : '❌ 不一致'}
                </Text>
              </View>
              <View className={styles.tlActions}>
                <View
                  className={classnames(styles.tlBtn, styles.tlBtnGhost)}
                  onClick={() => Taro.navigateTo({ url: `/pages/arrival-detail/index?id=${arrival.id}` })}
                >
                  <Text>查看详情</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, relatedSamplings.length > 0 ? styles.dotDone : styles.dotPending)}>
            <Text>2</Text>
          </View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>📌 见证取样</Text>
              <Text className={styles.tlTime}>{relatedSamplings[0]?.samplingDate || '待取样'}</Text>
            </View>
            <View className={styles.tlBody}>
              {relatedSamplings.length > 0 ? (
                relatedSamplings.slice(0, 1).map(s => (
                  <View key={s.id}>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>取样编号</Text>
                      <Text className={styles.tlVal}>{s.samplingNo}</Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>取样规格</Text>
                      <Text className={styles.tlVal}>{s.spec}</Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>见证人</Text>
                      <Text className={styles.tlVal}>{s.witnessName}({s.witnessUnit})</Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>送检状态</Text>
                      <Text className={styles.tlVal}>{s.currentStep >= 5 ? '✓ 已完成' : `第${s.currentStep}/5步 · 进行中`}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.tlRow}>
                  <Text className={styles.tlVal} style={{ color: '#86909C' }}>尚未生成取样任务</Text>
                </View>
              )}
              {relatedSamplings.length > 0 && (
                <View className={styles.tlActions}>
                  <View
                    className={classnames(styles.tlBtn, styles.tlBtnGhost)}
                    onClick={() => Taro.switchTab({ url: '/pages/sampling/index' })}
                  >
                    <Text>查看取样详情</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, relatedInspections.length > 0 ? styles.dotDone : styles.dotPending)}>
            <Text>3</Text>
          </View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>🔬 检测报告</Text>
              <Text className={styles.tlTime}>{relatedInspections[0]?.inspectDate || '待检测'}</Text>
            </View>
            <View className={styles.tlBody}>
              {relatedInspections.length > 0 ? (
                relatedInspections.map(i => (
                  <View key={i.id}>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>报告编号</Text>
                      <Text className={styles.tlVal}>{i.reportNo}</Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>检测机构</Text>
                      <Text className={styles.tlVal}>{i.labName}</Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>检测结论</Text>
                      <Text className={styles.tlVal} style={{ color: i.conclusion === 'qualified' ? '#00B42A' : '#F53F3F' }}>
                        {i.conclusion === 'qualified' ? '✅ 合格' : '❌ 不合格'}
                      </Text>
                    </View>
                    {i.conclusion === 'unqualified' && (
                      <View className={styles.tlRow}>
                        <Text className={styles.tlKey}>使用拦截</Text>
                        <Text className={styles.tlVal} style={{ color: '#F53F3F' }}>
                          {i.blockUsage ? '🔴 已拦截禁止使用' : '未拦截'}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View className={styles.tlRow}>
                  <Text className={styles.tlVal} style={{ color: '#86909C' }}>暂无检测报告</Text>
                </View>
              )}
              {relatedInspections.length > 0 && (
                <View className={styles.tlActions}>
                  <View
                    className={classnames(styles.tlBtn, styles.tlBtnGhost)}
                    onClick={() => Taro.navigateTo({ url: '/pages/inspection/index' })}
                  >
                    <Text>查看检测报告</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className={styles.tlItem}>
          <View className={styles.tlLine} />
          <View className={classnames(styles.tlDot, hasInstall ? styles.dotDone : styles.dotPending)}>
            <Text>4</Text>
          </View>
          <View className={styles.tlContent}>
            <View className={styles.tlHeader}>
              <Text className={styles.tlName}>🏗️ 安装使用</Text>
              <Text className={styles.tlTime}>{relatedInstalls[0]?.installDate || '待分配'}</Text>
            </View>
            <View className={styles.tlBody}>
              {hasInstall ? (
                <View>
                  <View className={styles.tlRow}>
                    <Text className={styles.tlKey}>使用位置</Text>
                    <Text className={styles.tlVal}>
                      {relatedInstalls.map(r => `${r.building}${r.floor}`).join('、')}
                    </Text>
                  </View>
                  <View className={styles.tlRow}>
                    <Text className={styles.tlKey}>使用部位</Text>
                    <Text className={styles.tlVal}>
                      {relatedInstalls.map(r => r.componentName).join('、')}
                    </Text>
                  </View>
                  <View className={styles.tlRow}>
                    <Text className={styles.tlKey}>已用数量</Text>
                    <Text className={styles.tlVal} style={{ color: '#1E6FFF', fontWeight: 700 }}>
                      {totalQty}{arrival.unit} / 共{arrival.quantity}{arrival.unit}
                    </Text>
                  </View>
                  <View className={styles.tlRow}>
                    <Text className={styles.tlKey}>施工班组</Text>
                    <Text className={styles.tlVal}>
                      {[...new Set(relatedInstalls.map(r => r.teamName))].join('、')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className={styles.tlRow}>
                  <Text className={styles.tlVal} style={{ color: '#86909C' }}>
                    {hasUnqualified ? '❌ 不合格，禁止分配安装' : '尚未分配安装位置'}
                  </Text>
                </View>
              )}
              {hasInstall && (
                <View className={styles.tlActions}>
                  <View
                    className={classnames(styles.tlBtn, styles.tlBtnGhost)}
                    onClick={() => Taro.navigateTo({ url: '/pages/install-location/index' })}
                  >
                    <Text>查看安装位置</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {hasRect && (
          <View className={styles.tlItem}>
            <View className={styles.tlDot} style={{ background: '#F53F3F', color: '#fff' }}>
              <Text>!</Text>
            </View>
            <View className={styles.tlContent}>
              <View className={styles.tlHeader}>
                <Text className={styles.tlName}>⚠️ 整改记录</Text>
                <Text className={styles.tlTime}>{relatedRects[0]?.createDate}</Text>
              </View>
              <View className={styles.tlBody}>
                {relatedRects.map(r => {
                  const map: Record<string, string> = {
                    pending: '待处理', processing: '整改中', confirming: '待确认',
                    approved: '已通过', rejected: '已驳回'
                  };
                  return (
                    <View key={r.id}>
                      <View className={styles.tlRow}>
                        <Text className={styles.tlKey}>整改单号</Text>
                        <Text className={styles.tlVal}>{r.rectNo}</Text>
                      </View>
                      <View className={styles.tlRow}>
                        <Text className={styles.tlKey}>整改状态</Text>
                        <Text className={styles.tlVal}>
                          {r.status === 'approved' ? '✅ 已完成' : '⏳ ' + map[r.status]}
                        </Text>
                      </View>
                      <View className={styles.tlRow}>
                        <Text className={styles.tlKey}>问题描述</Text>
                        <Text className={styles.tlVal}>{r.title}</Text>
                      </View>
                    </View>
                  );
                })}
                <View className={styles.tlActions}>
                  <View
                    className={classnames(styles.tlBtn, styles.tlBtnPrimary)}
                    onClick={() => Taro.navigateTo({ url: '/pages/rectification/index' })}
                  >
                    <Text>查看整改详情</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHead}>
          <Text className={styles.sectionName}>📍 使用范围分布（共{relatedInstalls.length}处）</Text>
        </View>
        {hasInstall ? (
          relatedInstalls.map(r => {
            const mat = r.materials.find(m => m.batchNo === batchNo);
            return (
              <View key={r.id} className={styles.usageItem}>
                <View className={styles.usageIcon}><Text>🏢</Text></View>
                <View className={styles.usageInfo}>
                  <Text className={styles.usageLoc}>{r.building} {r.floor} · {r.area}</Text>
                  <Text className={styles.usageComp}>构件：{r.componentName}（{r.componentCode}）</Text>
                  <Text className={styles.usageTeam}>👷 {r.teamName} · 班组长 {r.teamLeader}</Text>
                </View>
                <View className={styles.usageQty}>
                  <Text className={styles.qtyNum}>{mat?.quantity || 0}</Text>
                  <Text className={styles.qtyUnit}>{mat?.unit}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ fontSize: 24, color: '#86909C', textAlign: 'center', padding: '32rpx 0' }}>
            暂无安装使用记录
          </Text>
        )}
      </View>

      <View className={styles.bottomFloat}>
        <View className={classnames(styles.floatBtn, styles.btnExport)} onClick={handleExport}>
          <Text>📄 导出台账</Text>
        </View>
        <View
          className={classnames(styles.floatBtn, styles.btnShare)}
          onClick={() => Taro.showToast({ title: '生成追溯码成功', icon: 'success' })}
        >
          <Text>� 生成追溯码</Text>
        </View>
      </View>

      {showExport && (
        <View style={{
          position: 'fixed', left: 0, right: 0, top: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32
        }} onClick={() => setShowExport(false)}>
          <View
            style={{
              width: '100%',
              maxHeight: '80vh',
              background: '#fff',
              borderRadius: 16,
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <View style={{
              padding: '24rpx 28rpx',
              borderBottom: '1rpx solid #F2F3F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text style={{ fontSize: 28, fontWeight: 700, color: '#1D2129' }}>
                📄 追溯台账预览
              </Text>
              <Text
                onClick={handleCopy}
                style={{
                  fontSize: 24, color: '#1E6FFF', fontWeight: 500,
                  padding: '8rpx 20rpx',
                  background: 'rgba(30,111,255,0.08)',
                  borderRadius: 20
                }}
              >
                📋 复制全部
              </Text>
            </View>
            <ScrollView scrollY style={{ maxHeight: '55vh', padding: 24 }}>
              <Text selectable style={{
                fontSize: 20,
                lineHeight: 1.8,
                color: '#1D2129',
                fontFamily: 'Consolas, monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {exportText}
              </Text>
            </ScrollView>
            <View style={{
              padding: 24,
              borderTop: '1rpx solid #F2F3F5',
              display: 'flex', gap: 16
            }}>
              <View
                onClick={() => setShowExport(false)}
                style={{
                  flex: 1, height: 76, borderRadius: 12,
                  background: '#F2F3F5', color: '#4E5969',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 600
                }}
              >
                <Text>关闭</Text>
              </View>
              <View
                onClick={handleCopy}
                style={{
                  flex: 1.2, height: 76, borderRadius: 12,
                  background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 600
                }}
              >
                <Text>复制台账内容</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
