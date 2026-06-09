import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { arrivalStatusMap, materialTypes } from '@/data/arrivals';
import { currentProjectId } from '@/data/projects';
import { useTraceStore } from '@/store/traceStore';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';

const statusFilters = [
  { label: '全部', value: '' },
  { label: '待验收', value: 'pending' },
  { label: '已验收', value: 'accepted' },
  { label: '取样中', value: 'sampling' },
  { label: '已完成', value: 'completed' },
  { label: '已拒收', value: 'rejected' }
];

export default function ArrivalPage() {
  const store = useTraceStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [, setTick] = useState(0);

  useDidShow(() => {
    setTick(t => t + 1);
  });

  const projectArrivals = store.getArrivalsByProject?.(currentProjectId) || store.arrivals || [];

  const filteredList = useMemo(() => {
    return projectArrivals.filter(a => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (typeFilter && a.materialType !== typeFilter) return false;
      if (searchText) {
        const kw = searchText.toLowerCase();
        return (
          (a.materialName || '').toLowerCase().includes(kw) ||
          (a.batchNo || '').toLowerCase().includes(kw) ||
          (a.supplier || a.supplierName || '').toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [projectArrivals, statusFilter, typeFilter, searchText]);

  const summary = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      today: projectArrivals.filter(a => (a.arrivalTime || '').startsWith(todayStr) || (a.arrivalTime || '').startsWith('2026-06-10')).length,
      pending: projectArrivals.filter(a => a.status === 'pending' || a.status === 'accepted').length,
      rejected: projectArrivals.filter(a => a.status === 'rejected').length
    };
  }, [projectArrivals]);

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
          itemList: ['HC20260610-001（钢筋 HRB400）', 'SN20260610-008（水泥 P·O42.5）', 'HT20260609-015（KP1 烧结砖）', 'DT20260606-017（YJV 电缆）'],
          success: (r) => {
            const map = ['HC20260610-001', 'SN20260610-008', 'HT20260609-015', 'DT20260606-017'];
            setSearchText(map[r.tapIndex]);
          }
        });
      }
    });
  };

  const handleCreateSampling = (a: any) => {
    Taro.navigateTo({ url: `/pages/sampling-create/index?arrivalId=${a.id}` });
  };

  const getStatusInfo = (status: string) => {
    const map = arrivalStatusMap;
    return map[status] || { text: status, type: 'info' };
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>到货验收</Text>
        <Text className='pageSubtitle'>扫码登记 · 核对规格 · 留存照片</Text>
      </View>

      <SearchBar
        placeholder='搜索批号/材料/供应商'
        value={searchText}
        onChange={setSearchText}
        onScan={handleScan}
      />

      <View className={styles.summaryRow}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryNum}>{summary.today}</Text>
          <Text className={styles.summaryText}>今日到货</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryNum} style={{ color: '#FF7D00' }}>{summary.pending}</Text>
          <Text className={styles.summaryText}>待处理</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryNum} style={{ color: '#F53F3F' }}>{summary.rejected}</Text>
          <Text className={styles.summaryText}>拒收数</Text>
        </View>
      </View>

      <ScrollView scrollX className={styles.typeScroll}>
        <View
          className={classnames(styles.typeChip, typeFilter === '' && styles.typeChipActive)}
          onClick={() => setTypeFilter('')}
        >
          <Text>全部类型</Text>
        </View>
        {materialTypes.map(t => (
          <View
            key={t}
            className={classnames(styles.typeChip, typeFilter === t && styles.typeChipActive)}
            onClick={() => setTypeFilter(t)}
          >
            <Text>{t}</Text>
          </View>
        ))}
      </ScrollView>

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
            title='暂无到货记录'
            description='点击右下角按钮开始登记'
            actionText='立即登记'
            onAction={() => Taro.navigateTo({ url: '/pages/arrival-create/index' })}
          />
        ) : (
          filteredList.map(a => {
            const info = getStatusInfo(a.status);
            const photos = [...(a.photos?.nameplate || []), ...(a.photos?.appearance || [])];
            return (
              <View key={a.id} className={styles.card}
                onClick={() => Taro.navigateTo({ url: `/pages/arrival-detail/index?id=${a.id}` })}>
                <View className={styles.cardTop}>
                  <View className={styles.cardHeader}>
                    <Text className={styles.materialName}>{a.materialName}</Text>
                    <StatusTag text={info.text} type={info.type} size='sm' />
                  </View>
                  <View className={styles.batchRow}>
                    <View className={styles.batchBox}>
                      <Text className={styles.batchLabel}>批号</Text>
                      <Text className={styles.batchText}>{a.batchNo}</Text>
                    </View>
                    <Text className={styles.timeText}>🕐 {a.arrivalTime}</Text>
                  </View>
                </View>

                <View className={styles.cardBody}>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>规格型号</Text>
                    <View className={styles.infoSpec}>
                      <Text className={styles.specText}>{a.spec}</Text>
                      {!a.specMatched && (
                        <View className={styles.mismatchTag}>
                          <Text>⚠ 规格差异</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>到货数量</Text>
                    <Text className={styles.qtyText}>
                      <Text className={styles.qtyNum}>{a.quantity}</Text>
                      <Text className={styles.qtyUnit}> {a.unit}</Text>
                    </Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>供应商</Text>
                    <Text className={styles.infoValue}>🚚 {a.supplier}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>运输车辆</Text>
                    <Text className={styles.infoValue}>
                      🚛 {a.vehicleNo || '未记录'} · {a.driverName || '司机'}
                    </Text>
                  </View>
                </View>

                {photos.length > 0 && (
                  <View className={styles.photoRow}>
                    {photos.slice(0, 3).map((p, i) => (
                      <image key={i} src={p} className={styles.photoThumb} mode='aspectFill' />
                    ))}
                    {photos.length > 3 && (
                      <View className={styles.photoMore}>
                        <Text>+{photos.length - 3}</Text>
                      </View>
                    )}
                  </View>
                )}

                <View className={styles.cardFooter}>
                  <View
                    className={classnames(styles.actionBtn, styles.btnSecondary)}
                    onClick={(e) => { e.stopPropagation(); handleCreateSampling(a); }}
                  >
                    <Text>🧪 生成取样</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.btnPrimary)}
                    onClick={(e) => {
                      e.stopPropagation();
                      Taro.showModal({
                        title: '导出台账',
                        content: store.exportBatchLedger(a.batchNo).slice(0, 80) + '...',
                        showCancel: false
                      });
                    }}
                  >
                    <Text>📄 导出台账</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View className='fabBtn' onClick={() => Taro.navigateTo({ url: '/pages/arrival-create/index' })}>
        <Text style={{ fontSize: 36 }}>+</Text>
      </View>
    </View>
  );
}
