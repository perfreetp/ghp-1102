import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { arrivalStatusMap } from '@/data/arrivals';
import { useTraceStore } from '@/store/traceStore';
import StatusTag from '@/components/StatusTag';

export default function ArrivalDetailPage() {
  const router = useRouter();
  const store = useTraceStore();
  const id = (router.params.id as string) || store.arrivals[0]?.id;

  const arrival = useMemo(() => store.getArrivalById(id as string) || store.arrivals[0], [id, store]);

  if (!arrival) {
    return (
      <View className='pageContainer'>
        <Text style={{ padding: 40, textAlign: 'center', display: 'block' }}>未找到到货记录</Text>
      </View>
    );
  }

  const sm = arrivalStatusMap[arrival.status] || { text: arrival.status, type: 'info' as const };
  const nameplates = arrival.photos?.nameplate || [];
  const appearances = arrival.photos?.appearance || [];
  const allPhotos = [
    ...nameplates.map(url => ({ url, label: '铭牌' })),
    ...appearances.map((url, i) => ({ url, label: `外观${i + 1}` }))
  ];

  const relatedSamplings = store.getSamplingsByBatch(arrival.batchNo);
  const relatedInspections = store.getInspectionsByBatch(arrival.batchNo);
  const relatedInstalls = store.getInstallsByBatch(arrival.batchNo);
  const relatedRects = store.getRectificationsByBatch(arrival.batchNo);

  return (
    <View className='pageContainer' style={{ paddingBottom: 180 }}>
      <View className={styles.topHeader}>
        <Text className={styles.topNo}>到货单号：{arrival.id}</Text>
        <Text className={styles.topTitle}>{arrival.materialName}</Text>
        <View style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <Text className={styles.topBatch}>批号 {arrival.batchNo}</Text>
          <StatusTag text={sm.text} type={sm.type as any} size='md' />
        </View>
        <View className={styles.topInfo}>
          <View className={styles.infoBlock}>
            <Text className={styles.infoLabel}>数量</Text>
            <Text className={styles.infoValue}>{arrival.quantity} {arrival.unit}</Text>
          </View>
          <View className={styles.infoBlock}>
            <Text className={styles.infoLabel}>规格</Text>
            <Text className={styles.infoValue}>{arrival.spec}</Text>
          </View>
          <View className={styles.infoBlock}>
            <Text className={styles.infoLabel}>到货时间</Text>
            <Text className={styles.infoValue}>{arrival.arrivalTime}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHead}>
          <View style={{ width: 6, height: 28, background: '#1E6FFF', borderRadius: 4 }} />
          <Text className={styles.sectionName}>基本信息</Text>
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>材料类型</Text>
            <Text className={styles.gridVal}>{arrival.materialType}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>供应商</Text>
            <Text className={styles.gridVal}>🚚 {arrival.supplier}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>运输车辆</Text>
            <Text className={styles.gridVal}>{arrival.vehicleNo || '无'}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>司机</Text>
            <Text className={styles.gridVal}>👤 {arrival.driverName || '无'}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>验收人</Text>
            <Text className={styles.gridVal}>{arrival.receiver}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>监理见证</Text>
            <Text className={styles.gridVal}>👁️ {arrival.witness}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>联系电话</Text>
            <Text className={styles.gridVal}>{arrival.driverPhone || '-'}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.gridLabel}>关联业务</Text>
            <Text className={styles.gridVal}>取样{relatedSamplings.length}·检测{relatedInspections.length}·安装{relatedInstalls.length}</Text>
          </View>
        </View>

        <View className={styles.specCompareBox}>
          <View className={styles.specHeader}>
            <Text style={{ fontSize: 26, fontWeight: 700, color: '#1D2129' }}>📋 规格核对</Text>
            <StatusTag
              text={arrival.specMatched ? '✅ 规格一致' : '⚠️ 规格差异'}
              type={arrival.specMatched ? 'success' : 'error'}
              size='sm'
            />
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 16 }}>
            <View style={{ flex: 1, padding: 16, background: '#F7F8FA', borderRadius: 12 }}>
              <Text style={{ fontSize: 22, color: '#86909C', display: 'block', marginBottom: 6 }}>合同要求</Text>
              <Text style={{ fontSize: 24, color: '#1D2129', fontWeight: 500 }}>{arrival.contractSpec}</Text>
            </View>
            <View style={{
              flex: 1, padding: 16, borderRadius: 12,
              background: arrival.specMatched ? 'rgba(0,180,42,0.06)' : 'rgba(245,63,63,0.06)',
              border: `1rpx solid ${arrival.specMatched ? 'rgba(0,180,42,0.3)' : 'rgba(245,63,63,0.3)'}`
            }}>
              <Text style={{ fontSize: 22, color: '#86909C', display: 'block', marginBottom: 6 }}>实际到货</Text>
              <Text style={{ fontSize: 24, color: '#1D2129', fontWeight: 600 }}>{arrival.spec}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHead}>
          <View style={{ width: 6, height: 28, background: '#FF7D00', borderRadius: 4 }} />
          <Text className={styles.sectionName}>验收照片 ({allPhotos.length}张)</Text>
        </View>
        <View className={styles.photoGrid}>
          {allPhotos.map((p, i) => (
            <View key={i} className={styles.photoCell}>
              <image src={p.url} className={styles.photoImg} mode='aspectFill' />
              <View className={styles.photoLabel}>
                <Text>{p.label}</Text>
              </View>
            </View>
          ))}
          <View className={styles.photoAdd}>
            <Text style={{ fontSize: 48, color: '#C9CDD4' }}>+</Text>
            <Text style={{ fontSize: 22, color: '#86909C', marginTop: 8 }}>补传照片</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHead}>
          <View style={{ width: 6, height: 28, background: '#722ED1', borderRadius: 4 }} />
          <Text className={styles.sectionName}>📝 验收备注</Text>
        </View>
        <View style={{
          padding: 20, background: '#FAFBFC', borderRadius: 12,
          borderLeft: '4rpx solid #722ED1'
        }}>
          <Text style={{ fontSize: 24, color: '#1D2129', lineHeight: 1.7 }}>
            {arrival.remarks || '无特殊备注'}
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHead}>
          <View style={{ width: 6, height: 28, background: '#14C9C9', borderRadius: 4 }} />
          <Text className={styles.sectionName}>🔗 关联业务</Text>
        </View>
        <View
          className={classnames(styles.linkCard, relatedSamplings.length > 0 && styles.linkActive)}
          onClick={() => relatedSamplings.length > 0 && Taro.switchTab({ url: '/pages/sampling/index' })}
        >
          <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 36 }}>🧪</Text>
            <View>
              <Text style={{ fontSize: 26, color: '#1D2129', fontWeight: 600 }}>见证取样</Text>
              <Text style={{ fontSize: 22, color: '#86909C' }}>
                {relatedSamplings.length > 0
                  ? `已创建${relatedSamplings.length}个取样任务：${relatedSamplings.map(s => s.samplingNo.slice(-4)).join('、')}`
                  : '尚未生成取样任务'}
              </Text>
            </View>
          </View>
          <Text style={{ color: relatedSamplings.length > 0 ? '#1E6FFF' : '#C9CDD4' }}>
            {relatedSamplings.length > 0 ? '›' : '✕'}
          </Text>
        </View>
        <View
          className={classnames(styles.linkCard, relatedInspections.length > 0 && styles.linkActive)}
          onClick={() => relatedInspections.length > 0 && Taro.navigateTo({ url: '/pages/inspection/index' })}
        >
          <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 36 }}>🔬</Text>
            <View>
              <Text style={{ fontSize: 26, color: '#1D2129', fontWeight: 600 }}>检测报告</Text>
              <Text style={{ fontSize: 22, color: '#86909C' }}>
                {relatedInspections.length > 0
                  ? `${relatedInspections.length}份报告：${relatedInspections.map(i => i.conclusion === 'qualified' ? '✅' : '❌').join(' ')}`
                  : '暂无检测报告'}
              </Text>
            </View>
          </View>
          <Text style={{ color: relatedInspections.length > 0 ? '#1E6FFF' : '#C9CDD4' }}>
            {relatedInspections.length > 0 ? '›' : '✕'}
          </Text>
        </View>
        <View
          className={classnames(styles.linkCard, relatedInstalls.length > 0 && styles.linkActive)}
          onClick={() => relatedInstalls.length > 0 && Taro.navigateTo({ url: '/pages/install-location/index' })}
        >
          <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 36 }}>🏗️</Text>
            <View>
              <Text style={{ fontSize: 26, color: '#1D2129', fontWeight: 600 }}>安装使用</Text>
              <Text style={{ fontSize: 22, color: '#86909C' }}>
                {relatedInstalls.length > 0
                  ? `已安装到${relatedInstalls.length}处：${[...new Set(relatedInstalls.map(r => r.building))].join('、')}`
                  : (relatedInspections.some(i => !i.isQualified) ? '⚠️ 检测不合格，已禁止分配' : '尚未分配安装位置')}
              </Text>
            </View>
          </View>
          <Text style={{ color: relatedInstalls.length > 0 ? '#1E6FFF' : '#C9CDD4' }}>
            {relatedInstalls.length > 0 ? '›' : '✕'}
          </Text>
        </View>
        {relatedRects.length > 0 && (
          <View
            className={classnames(styles.linkCard, styles.linkActive)}
            onClick={() => Taro.navigateTo({ url: '/pages/rectification/index' })}
          >
            <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Text style={{ fontSize: 36 }}>⚠️</Text>
              <View>
                <Text style={{ fontSize: 26, color: '#1D2129', fontWeight: 600 }}>整改记录</Text>
                <Text style={{ fontSize: 22, color: '#86909C' }}>
                  {relatedRects.length}项整改，{relatedRects.filter(r => r.status === 'approved').length}项已闭环
                </Text>
              </View>
            </View>
            <Text style={{ color: '#1E6FFF' }}>›</Text>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.barBtn, styles.barGhost)}
          onClick={() => Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${arrival.batchNo}` })}
        >
          <Text>� 追溯批次</Text>
        </View>
        <View
          className={classnames(styles.barBtn, styles.barOrange)}
          onClick={() => Taro.navigateTo({ url: `/pages/sampling-create/index?arrivalId=${arrival.id}` })}
        >
          <Text>🧪 生成取样</Text>
        </View>
        <View
          className={classnames(styles.barBtn, styles.barPrimary)}
          onClick={() => Taro.showModal({
            title: '📄 导出台账预览（前100字）',
            content: store.exportBatchLedger(arrival.batchNo).slice(0, 200) + '\n...\n[点批次详情查看完整台账]',
            showCancel: false
          })}
        >
          <Text>📄 导出台账</Text>
        </View>
      </View>
    </View>
  );
}
