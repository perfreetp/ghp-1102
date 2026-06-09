import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { arrivals, getArrivalById } from '@/data/arrivals';
import { arrivalStatusMap } from '@/data/arrivals';
import StatusTag from '@/components/StatusTag';

export default function ArrivalDetailPage() {
  const router = useRouter();
  const id = router.params.id || arrivals[0].id;

  const arrival = useMemo(() => getArrivalById(id as string), [id]);

  if (!arrival) {
    return (
      <View className='pageContainer'>
        <Text>未找到到货记录</Text>
      </View>
    );
  }

  const sm = arrivalStatusMap[arrival.status];
  const allPhotos = [
    { url: arrival.nameplatePhoto, label: '铭牌' },
    ...arrival.appearancePhotos.map((url, i) => ({ url, label: `外观${i + 1}` }))
  ];

  return (
    <View className='pageContainer' style={{ paddingBottom: 180 }}>
      <View className={styles.topHeader}>
        <Text className={styles.topNo}>到货单号：{arrival.id}</Text>
        <Text className={styles.topTitle}>{arrival.materialName}</Text>
        <View style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
          <Text className={styles.topBatch}>批号 {arrival.batchNo}</Text>
          <View
            style={{
              background: 'rgba(255,255,255,0.95)',
              color: sm.color,
              padding: '6px 16px',
              borderRadius: 40,
              fontSize: 22,
              fontWeight: 600
            }}
          >
            <Text>{sm.label}</Text>
          </View>
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
            <Text className={styles.infoValue}>{arrival.arrivalTime.slice(5)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>📋 基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoRow}>
            <Text className={styles.label}>材料类型</Text>
            <Text className={styles.value}>{arrival.materialType}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.label}>所属项目</Text>
            <Text className={styles.value}>{arrival.projectName}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.label}>供应商</Text>
            <Text className={styles.value}>{arrival.supplier}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.label}>运输车辆</Text>
            <Text className={styles.value}>{arrival.vehicleNo}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.label}>司机</Text>
            <Text className={styles.value}>{arrival.driverName} {arrival.driverPhone}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.label}>验收人</Text>
            <Text className={styles.value}>{arrival.receiver}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.label}>见证人</Text>
            <Text className={styles.value}>{arrival.witness}</Text>
          </View>
        </View>

        <View className={styles.specCheck}>
          <Text style={{ fontSize: 24, fontWeight: 600, color: '#1D2129', marginBottom: 8 }}>
            📐 合同规格核对
          </Text>
          <View className={styles.specRow}>
            <Text className={styles.specLabel}>规格</Text>
            <Text className={styles.specContract}>{arrival.contractSpec}</Text>
            <Text className={classnames(styles.specActual, arrival.specMatched ? styles.match : styles.mismatch)}>
              {arrival.specMatched ? '✓ ' : '✕ '}{arrival.spec}
            </Text>
          </View>
          <View className={classnames(styles.specResultBar, arrival.specMatched ? 'ok' : 'bad')}>
            <Text style={{ fontSize: 32 }}>{arrival.specMatched ? '✅' : '❌'}</Text>
            <Text style={{ fontSize: 24, fontWeight: 600, color: arrival.specMatched ? '#00B42A' : '#F53F3F' }}>
              {arrival.specMatched ? '规格与合同一致' : '规格不符合合同要求，已标记'}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>📷 验收照片（{allPhotos.length}张）</Text>
        <View className={styles.photoGrid}>
          {allPhotos.map((p, i) => (
            <View key={i} className={styles.photoItem}>
              <Image className={styles.photoImg} src={p.url} mode='aspectFill' />
              <Text className={styles.photoLabel}>{p.label}</Text>
            </View>
          ))}
          <View
            className={styles.photoItem}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2rpx dashed #C9CDD4',
              background: '#F7F8FA'
            }}
            onClick={() => Taro.showToast({ title: '添加照片', icon: 'none' })}
          >
            <Text style={{ fontSize: 48, color: '#C9CDD4' }}>+</Text>
          </View>
        </View>
      </View>

      {arrival.remarks && (
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>📝 验收备注</Text>
          <Text style={{ fontSize: 24, color: '#4E5969', lineHeight: 1.7 }}>
            {arrival.remarks}
          </Text>
        </View>
      )}

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>🔗 关联业务</Text>
        <View
          className={styles.relatedItem}
          onClick={() => Taro.switchTab({ url: '/pages/sampling/index' })}
        >
          <View className={styles.relatedLeft}>
            <Text className={styles.relTitle}>📌 取样任务（{arrival.samplingIds.length}项）</Text>
            <Text className={styles.relSub}>
              {arrival.samplingIds.length > 0 ? arrival.samplingIds.join('、') : '尚未生成取样任务'}
            </Text>
          </View>
          <Text style={{ fontSize: 24, color: '#C9CDD4' }}>›</Text>
        </View>
        <View
          className={styles.relatedItem}
          onClick={() => Taro.navigateTo({ url: '/pages/inspection/index' })}
        >
          <View className={styles.relatedLeft}>
            <Text className={styles.relTitle}>🔬 检测报告（{arrival.inspectionIds.length}份）</Text>
            <Text className={styles.relSub}>
              {arrival.inspectionIds.length > 0 ? arrival.inspectionIds.join('、') : '暂无检测报告'}
            </Text>
          </View>
          <Text style={{ fontSize: 24, color: '#C9CDD4' }}>›</Text>
        </View>
        <View
          className={styles.relatedItem}
          onClick={() => Taro.navigateTo({ url: '/pages/install-location/index' })}
        >
          <View className={styles.relatedLeft}>
            <Text className={styles.relTitle}>🏗️ 安装位置（{arrival.installIds.length}处）</Text>
            <Text className={styles.relSub}>
              {arrival.installIds.length > 0 ? arrival.installIds.join('、') : '尚未分配安装位置'}
            </Text>
          </View>
          <Text style={{ fontSize: 24, color: '#C9CDD4' }}>›</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.bottomBtn, styles.btnGhost)}
          onClick={() => Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${arrival.batchNo}` })}
        >
          <Text>🔗 追溯</Text>
        </View>
        {arrival.samplingIds.length === 0 && (
          <View
            className={classnames(styles.bottomBtn, styles.btnWarning)}
            onClick={() => Taro.navigateTo({ url: '/pages/sampling-create/index' })}
          >
            <Text>生成取样</Text>
          </View>
        )}
        <View className={classnames(styles.bottomBtn, styles.btnPrimary)}>
          <Text>导出台账</Text>
        </View>
      </View>
    </View>
  );
}
