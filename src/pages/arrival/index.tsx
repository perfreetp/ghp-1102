import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getArrivalsByProject, arrivalStatusMap, materialTypes } from '@/data/arrivals';
import { currentProjectId } from '@/data/projects';
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
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const projectArrivals = useMemo(() => getArrivalsByProject(currentProjectId), []);

  const filteredList = useMemo(() => {
    return projectArrivals.filter(a => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (typeFilter && a.materialType !== typeFilter) return false;
      if (searchText) {
        const kw = searchText.toLowerCase();
        return (
          a.materialName.toLowerCase().includes(kw) ||
          a.batchNo.toLowerCase().includes(kw) ||
          a.supplier.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [projectArrivals, statusFilter, typeFilter, searchText]);

  const summary = useMemo(() => {
    return {
      today: projectArrivals.filter(a => a.arrivalTime.startsWith('2026-06-10')).length,
      pending: projectArrivals.filter(a => a.status === 'pending' || a.status === 'accepted').length,
      rejected: projectArrivals.filter(a => a.status === 'rejected').length
    };
  }, [projectArrivals]);

  const handleScan = () => {
    Taro.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        setSearchText(res.result);
        Taro.showToast({ title: '已识别批号', icon: 'success' });
      },
      fail: () => {
        Taro.showToast({ title: '扫码已取消', icon: 'none' });
      }
    });
  };

  const handleGoDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/arrival-detail/index?id=${id}` });
  };

  const handleCreate = () => {
    Taro.navigateTo({ url: '/pages/arrival-create/index' });
  };

  const handleSampling = (id: string) => {
    Taro.navigateTo({ url: `/pages/sampling-create/index?arrivalId=${id}` });
  };

  const handleInspection = (id: string) => {
    Taro.navigateTo({ url: `/pages/inspection/index?arrivalId=${id}` });
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>到货验收</Text>
        <Text className='pageSubtitle'>扫码登记 · 拍照留存 · 核对合同</Text>
      </View>

      <SearchBar
        placeholder='搜索材料名/批号/供应商'
        value={searchText}
        onChange={setSearchText}
        onScan={handleScan}
      />

      <ScrollView
        className={styles.filterTabs}
        scrollX
        style={{ padding: 8, marginLeft: -8, marginRight: -8 }}
      >
        {statusFilters.map(f => (
          <View
            key={f.value}
            className={classnames(
              styles.tabItem,
              statusFilter === f.value && styles.tabItemActive
            )}
            style={{ minWidth: 120, flex: 'none' }}
            onClick={() => setStatusFilter(f.value)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.summaryRow}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryNum} style={{ color: '#1E6FFF' }}>{summary.today}</Text>
          <Text className={styles.summaryLabel}>今日到货</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryNum} style={{ color: '#FF7D00' }}>{summary.pending}</Text>
          <Text className={styles.summaryLabel}>待处理</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryNum} style={{ color: '#F53F3F' }}>{summary.rejected}</Text>
          <Text className={styles.summaryLabel}>已拒收</Text>
        </View>
      </View>

      <ScrollView className={styles.filterTabs} scrollX style={{ padding: 0 }}>
        {materialTypes.slice(0, 6).map(m => (
          <View
            key={m.value}
            className={classnames(
              styles.tabItem,
              typeFilter === m.value && styles.tabItemActive
            )}
            style={{ minWidth: 140, flex: 'none' }}
            onClick={() => setTypeFilter(m.value)}
          >
            <Text>{m.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ paddingTop: 24, paddingBottom: 200 }}>
        {filteredList.length === 0 ? (
          <EmptyState
            title='暂无到货记录'
            description='点击右下角按钮登记新到货'
            actionText='登记到货'
            onAction={handleCreate}
          />
        ) : (
          filteredList.map(a => {
            const sm = arrivalStatusMap[a.status];
            return (
              <View
                key={a.id}
                className={styles.arrivalCard}
                onClick={() => handleGoDetail(a.id)}
              >
                <View className={styles.cardHeader}>
                  <View className={styles.headerLeft}>
                    <View className={styles.batchRow}>
                      <Text className={styles.batchLabel}>批次</Text>
                      <Text className={styles.batchNo}>{a.batchNo}</Text>
                    </View>
                    <Text className={styles.materialName}>{a.materialName}</Text>
                    <Text style={{ fontSize: 22, color: '#86909C', marginTop: 4 }}>{a.materialType} · {a.spec}</Text>
                  </View>
                  <StatusTag text={sm.label} type={sm.type} size='sm' />
                </View>

                <View className={styles.infoGrid}>
                  <View className={styles.infoCell}>
                    <Text className={styles.infoLabel}>数量：</Text>
                    <Text className={styles.infoValue}>{a.quantity}{a.unit}</Text>
                  </View>
                  <View className={styles.infoCell}>
                    <Text className={styles.infoLabel}>供应商：</Text>
                    <Text className={styles.infoValue}>{a.supplier.slice(0, 8)}...</Text>
                  </View>
                  <View className={styles.infoCell}>
                    <Text className={styles.infoLabel}>车牌：</Text>
                    <Text className={styles.infoValue}>{a.vehicleNo}</Text>
                  </View>
                  <View className={styles.infoCell}>
                    <Text className={styles.infoLabel}>时间：</Text>
                    <Text className={styles.infoValue}>{a.arrivalTime.slice(5)}</Text>
                  </View>
                  <View className={styles.infoCell}>
                    <Text className={styles.infoLabel}>接收：</Text>
                    <Text className={styles.infoValue}>{a.receiver}</Text>
                  </View>
                  <View className={styles.infoCell}>
                    <Text className={styles.infoLabel}>见证：</Text>
                    <Text className={styles.infoValue}>{a.witness}</Text>
                  </View>
                </View>

                <View className={styles.specMatchBar}>
                  <Text className={styles.specIcon}>
                    {a.specMatched ? '✅' : '⚠️'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text className={`${styles.specText} ${a.specMatched ? styles.specMatch : styles.specMismatch}`}>
                      合同规格核对：<Text className={styles.specBold}>{a.specMatched ? '一致通过' : '不一致已拦截'}</Text>
                    </Text>
                    <Text style={{ fontSize: 20, color: '#86909C', marginTop: 2, display: 'block' }}>
                      合同要求：{a.contractSpec}
                    </Text>
                  </View>
                </View>

                <View className={styles.cardActions} catchTap>
                  {(a.status === 'accepted' || a.status === 'completed') && (
                    <View
                      className={`${styles.actionBtn} ${styles.btnSecondary}`}
                      onClick={(e) => { e.stopPropagation(); handleSampling(a.id); }}
                    >
                      <Text>生成取样</Text>
                    </View>
                  )}
                  {(a.samplingIds && a.samplingIds.length > 0) && (
                    <View
                      className={`${styles.actionBtn} ${styles.btnWarning}`}
                      onClick={(e) => { e.stopPropagation(); handleInspection(a.id); }}
                    >
                      <Text>查看检测</Text>
                    </View>
                  )}
                  <View
                    className={`${styles.actionBtn} ${styles.btnPrimary}`}
                    onClick={(e) => { e.stopPropagation(); handleGoDetail(a.id); }}
                  >
                    <Text>查看详情</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View className='fabBtn' onClick={handleCreate}>
        <Text style={{ fontWeight: 300 }}>+</Text>
      </View>
    </View>
  );
}
