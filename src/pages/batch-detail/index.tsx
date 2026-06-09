import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { arrivals } from '@/data/arrivals';
import { samplingList } from '@/data/sampling';
import { inspections } from '@/data/inspection';
import { installRecords } from '@/data/trace';
import { rectifications } from '@/data/rectification';
import StatusTag from '@/components/StatusTag';

export default function BatchDetailPage() {
  const router = useRouter();
  const batchNo = (router.params.batchNo as string) || arrivals[0].batchNo;

  const arrival = useMemo(() => arrivals.find(a => a.batchNo === batchNo) || arrivals[0], [batchNo]);
  const relatedSamplings = useMemo(() => samplingList.filter(s => s.batchNo === batchNo), [batchNo]);
  const relatedInspections = useMemo(() => inspections.filter(i => i.batchNo === batchNo), [batchNo]);
  const relatedInstalls = useMemo(() => installRecords.filter(r => r.materials.some(m => m.batchNo === batchNo)), [batchNo]);
  const relatedRects = useMemo(() => rectifications.filter(r => r.sourceBatchNo === batchNo), [batchNo]);

  const hasUnqualified = relatedInspections.some(i => i.conclusion === 'unqualified');
  const hasInstall = relatedInstalls.length > 0;
  const hasRect = relatedRects.length > 0;

  const totalQty = relatedInstalls.reduce((s, r) => {
    const found = r.materials.find(m => m.batchNo === batchNo);
    return s + (found ? found.quantity : 0);
  }, 0);

  return (
    <View className='pageContainer' style={{ paddingBottom: 180 }}>
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
          <View className={classnames(styles.tlDot, styles.dotDone)}>
            <Text>1</Text>
          </View>
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
                {relatedRects.map(r => (
                  <View key={r.id}>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>整改单号</Text>
                      <Text className={styles.tlVal}>{r.rectNo}</Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>整改状态</Text>
                      <Text className={styles.tlVal}>
                        {r.status === 'approved' ? '✅ 已完成' : '⏳ ' + r.status}
                      </Text>
                    </View>
                    <View className={styles.tlRow}>
                      <Text className={styles.tlKey}>问题描述</Text>
                      <Text className={styles.tlVal}>{r.title}</Text>
                    </View>
                  </View>
                ))}
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
          <Text style={{ fontSize: 22, color: '#86909C' }}>展开 ›</Text>
        </View>
        {hasInstall ? (
          relatedInstalls.slice(0, 3).map(r => {
            const mat = r.materials.find(m => m.batchNo === batchNo);
            return (
              <View key={r.id} className={styles.usageItem}>
                <View className={styles.usageIcon}>
                  <Text>🏢</Text>
                </View>
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
        <View
          className={classnames(styles.floatBtn, styles.btnExport)}
          onClick={() => Taro.showToast({ title: '正在导出追溯台账...', icon: 'loading' })}
        >
          <Text>📄 导出台账</Text>
        </View>
        <View
          className={classnames(styles.floatBtn, styles.btnShare)}
          onClick={() => Taro.showToast({ title: '生成追溯码成功', icon: 'success' })}
        >
          <Text>🔗 生成追溯码</Text>
        </View>
      </View>
    </View>
  );
}
