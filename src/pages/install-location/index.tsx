import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { currentProjectId } from '@/data/projects';
import { useTraceStore } from '@/store/traceStore';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';

const BUILDINGS = ['全部', '1号楼', '2号楼', '3号楼', '5号楼', '6号楼', '地下车库'];
const FLOORS = ['全部', 'B2层', 'B1层', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '1-3层', '1-10层', '3-6层', '7-9层'];

export default function InstallLocationPage() {
  const store = useTraceStore();
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('全部');
  const [floorFilter, setFloorFilter] = useState('全部');
  const [selBuilding, setSelBuilding] = useState(BUILDINGS[0]);
  const [selFloor, setSelFloor] = useState('5F');
  const [traceDetail, setTraceDetail] = useState<any>(null);

  const allRecords = useMemo(() => store.getInstallsByProject(currentProjectId), [store]);

  const summary = useMemo(() => ({
    total: allRecords.length,
    buildings: new Set(allRecords.map(r => r.building)).size,
    installed: allRecords.reduce((s, r) => s + r.materials.length, 0),
    teams: new Set(allRecords.map(r => r.teamName)).size
  }), [allRecords]);

  const list = useMemo(() => {
    return allRecords.filter(r => {
      if (buildingFilter !== '全部' && r.building !== buildingFilter) return false;
      if (floorFilter !== '全部' && r.floor !== floorFilter) return false;
      if (search) {
        const kw = search.toLowerCase();
        return (
          r.building.toLowerCase().includes(kw) ||
          r.componentName.toLowerCase().includes(kw) ||
          r.teamName.toLowerCase().includes(kw) ||
          r.materials.some(m => m.batchNo.toLowerCase().includes(kw))
        );
      }
      return true;
    });
  }, [allRecords, search, buildingFilter, floorFilter]);

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>安装位置</Text>
        <Text className='pageSubtitle'>分配楼栋楼层 · 绑定施工班组</Text>
      </View>

      <SearchBar
        placeholder='搜索楼栋/构件/班组/批号'
        value={search}
        onChange={setSearch}
        showScan
      />

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className='num' style={{ color: '#1E6FFF', fontSize: 40, fontWeight: 700 }}>{summary.total}</Text>
          <Text className='lbl' style={{ fontSize: 20, color: '#86909C', marginTop: 4 }}>安装记录</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className='num' style={{ color: '#722ED1', fontSize: 40, fontWeight: 700 }}>{summary.buildings}</Text>
          <Text className='lbl' style={{ fontSize: 20, color: '#86909C', marginTop: 4 }}>覆盖楼栋</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className='num' style={{ color: '#00B42A', fontSize: 40, fontWeight: 700 }}>{summary.installed}</Text>
          <Text className='lbl' style={{ fontSize: 20, color: '#86909C', marginTop: 4 }}>材料批次</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className='num' style={{ color: '#FF7D00', fontSize: 40, fontWeight: 700 }}>{summary.teams}</Text>
          <Text className='lbl' style={{ fontSize: 20, color: '#86909C', marginTop: 4 }}>施工班组</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {BUILDINGS.map(b => (
          <View
            key={b}
            className={classnames(styles.tabItem, buildingFilter === b && styles.tabActive)}
            onClick={() => setBuildingFilter(b)}
          >
            <Text>{b}</Text>
          </View>
        ))}
      </View>

      <View className={styles.filterTabs}>
        {FLOORS.map(f => (
          <View
            key={f}
            className={classnames(styles.tabItem, floorFilter === f && styles.tabActive)}
            onClick={() => setFloorFilter(f)}
          >
            <Text>{f}</Text>
          </View>
        ))}
      </View>

      <View className={styles.floorPicker}>
        <View className={styles.pickerCol} onClick={() => Taro.showActionSheet({ itemList: BUILDINGS, success: r => setSelBuilding(BUILDINGS[r.tapIndex]) })}>
          <Text className={styles.pickerLabel}>📍 楼栋</Text>
          <Text className={styles.pickerValue}>{selBuilding} ▾</Text>
        </View>
        <View className={styles.pickerCol} onClick={() => Taro.showActionSheet({ itemList: FLOORS.slice(1), success: r => setSelFloor(FLOORS.slice(1)[r.tapIndex]) })}>
          <Text className={styles.pickerLabel}>🏢 楼层</Text>
          <Text className={styles.pickerValue}>{selFloor} ▾</Text>
        </View>
        <View className={styles.pickerCol}>
          <Text className={styles.pickerLabel}>🔧 构件</Text>
          <Text className={styles.pickerValue}>全部 ▾</Text>
        </View>
      </View>

      <View style={{ paddingBottom: 180 }}>
        {list.length === 0 ? (
          <EmptyState
            title='暂无安装记录'
            description='材料验收合格后可分配安装位置'
            actionText='去到货验收'
            onAction={() => Taro.switchTab({ url: '/pages/arrival/index' })}
          />
        ) : (
          list.map(r => (
            <View key={r.id} className={styles.installCard}>
              <View className={styles.cardHeader}>
                <Text className={styles.cardTitle}>{r.componentName}</Text>
                <View className={styles.locationBadge}>
                  <Text>{r.building} {r.floor}</Text>
                </View>
              </View>

              <View className={styles.infoGrid}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>安装区域：</Text>
                  <Text className={styles.infoValue}>{r.area}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>安装时间：</Text>
                  <Text className={styles.infoValue}>{r.installDate}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>构件编号：</Text>
                  <Text className={styles.infoValue}>{r.componentCode}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoLabel}>安装数量：</Text>
                  <Text className={styles.infoValue}>{r.quantity} {r.unit}</Text>
                </View>
              </View>

              <View className={styles.teamSection}>
                <View className={styles.teamHeader}>
                  <Text className={styles.teamTitle}>👷 施工班组</Text>
                  <StatusTag text='已绑定' type='success' size='sm' />
                </View>
                <View className={styles.teamInfo}>
                  <View className={styles.teamAvatar}>
                    <Text>{r.teamName.slice(0, 1)}</Text>
                  </View>
                  <View className={styles.teamDetails}>
                    <Text className={styles.teamName}>{r.teamName}</Text>
                    <Text className={styles.teamLeader}>班组长：{r.teamLeader} · 联系 {r.teamPhone}</Text>
                  </View>
                </View>
              </View>

              <View className={styles.materialList}>
                <Text className={styles.matSectionTitle}>📦 使用材料批次（{r.materials.length}项）</Text>
                {r.materials.slice(0, 3).map(m => (
                  <View key={m.batchNo} className={styles.matItem}>
                    <View className={styles.matLeft}>
                      <Text className={styles.matName}>{m.materialName}</Text>
                      <Text className={styles.matBatch}>批号：{m.batchNo}</Text>
                    </View>
                    <Text className={styles.matQty}>{m.quantity}{m.unit}</Text>
                  </View>
                ))}
                {r.materials.length > 3 && (
                  <View style={{ padding: '12px 0', fontSize: 22, color: '#1E6FFF', textAlign: 'center' }}>
                    + 查看全部 {r.materials.length} 项材料 →
                  </View>
                )}
              </View>

              <View className={styles.cardActions}>
                <View
                  className={classnames(styles.actionBtn, styles.btnSecondary)}
                  onClick={() => setTraceDetail({
                    component: r.componentName,
                    building: r.building,
                    floor: r.floor,
                    area: r.area,
                    materials: r.materials
                  })}
                >
                  <Text>🔍 反查来源</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.btnTrace)}
                  onClick={() => Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${r.materials[0]?.batchNo}` })}
                >
                  <Text>🔗 追溯批次</Text>
                </View>
                <View
                  className={classnames(styles.actionBtn, styles.btnPrimary)}
                  onClick={() => Taro.showToast({ title: '编辑分配功能开发中', icon: 'none' })}
                >
                  <Text>✏️ 编辑分配</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {traceDetail && (
        <View style={{
          position: 'fixed', left: 0, right: 0, top: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32
        }} onClick={() => setTraceDetail(null)}>
          <View
            style={{
              width: '100%', background: '#fff', borderRadius: 16, overflow: 'hidden',
              maxHeight: '80vh'
            }}
            onClick={e => e.stopPropagation()}
          >
            <View style={{
              padding: 24,
              background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)',
              color: '#fff'
            }}>
              <Text style={{ fontSize: 22, opacity: 0.9, display: 'block', marginBottom: 6 }}>🔍 按构件反查来源</Text>
              <Text style={{ fontSize: 30, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                {traceDetail.component}
              </Text>
              <Text style={{ fontSize: 22, opacity: 0.85 }}>
                {traceDetail.building} {traceDetail.floor} · {traceDetail.area}
              </Text>
            </View>
            <View style={{ padding: 20, maxHeight: '50vh', overflow: 'auto' }}>
              <Text style={{ fontSize: 22, color: '#86909C', display: 'block', marginBottom: 16 }}>
                共使用 {traceDetail.materials.length} 项材料批次，点击查看详情追溯：
              </Text>
              {traceDetail.materials.map(m => {
                const arr = store.arrivals.find(a => a.batchNo === m.batchNo);
                return (
                  <View
                    key={m.batchNo}
                    onClick={() => {
                      setTraceDetail(null);
                      Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${m.batchNo}` });
                    }}
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      border: '1rpx solid #F2F3F5',
                      marginBottom: 12,
                      background: '#FAFBFC',
                    }}
                  >
                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <View>
                        <Text style={{ fontSize: 26, fontWeight: 600, color: '#1D2129', display: 'block', marginBottom: 4 }}>
                          {m.materialName}
                        </Text>
                        <Text style={{ fontSize: 22, color: '#1E6FFF', fontFamily: 'monospace' }}>
                          #{m.batchNo}
                        </Text>
                      </View>
                      <View style={{ textAlign: 'right' }}>
                        <Text style={{ fontSize: 30, fontWeight: 700, color: '#FF7D00' }}>{m.quantity}</Text>
                        <Text style={{ fontSize: 20, color: '#86909C', display: 'block' }}>{m.unit}</Text>
                      </View>
                    </View>
                    {arr && (
                      <View style={{
                        marginTop: 8,
                        padding: '8rpx 14rpx',
                        background: 'rgba(30,111,255,0.06)',
                        borderRadius: 8
                      }}>
                        <Text style={{ fontSize: 20, color: '#4E5969' }}>
                          🚚 {arr.supplier} · {arr.arrivalTime.slice(0, 10)}到货
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
            <View style={{
              padding: 20,
              borderTop: '1rpx solid #F2F3F5'
            }}>
              <View
                onClick={() => setTraceDetail(null)}
                style={{
                  width: '100%',
                  height: 80,
                  borderRadius: 12,
                  background: '#F2F3F5',
                  color: '#4E5969',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 600
                }}
              >
                <Text>关闭</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View className='fabBtn' onClick={() => Taro.showToast({ title: '新增安装记录', icon: 'none' })}>
        <Text style={{ fontSize: 36 }}>+</Text>
      </View>
    </View>
  );
}
