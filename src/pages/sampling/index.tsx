import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { samplingStatusMap } from '@/data/sampling';
import { currentProjectId } from '@/data/projects';
import { useTraceStore } from '@/store/traceStore';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';

const statusFilters = [
  { label: '全部', value: '' },
  { label: '待送检', value: 'pending' },
  { label: '已送检', value: 'sent' },
  { label: '检测中', value: 'testing' },
  { label: '已出报告', value: 'done' },
  { label: '取样中', value: 'sampling' }
];

const timelineSteps = ['现场取样', '已封样', '送检测机构', '检测机构接收', '出具报告'];

export default function SamplingPage() {
  const store = useTraceStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [, setTick] = useState(0);

  useDidShow(() => setTick(t => t + 1));

  const allSamplings = useMemo(() => {
    const list = store.samplings.filter(s => s.projectId === currentProjectId);
    return list;
  }, [store.samplings]);

  const filteredList = useMemo(() => {
    return allSamplings.filter(s => {
      if (statusFilter && s.status !== statusFilter) return false;
      if (searchText) {
        const kw = searchText.toLowerCase();
        return (
          s.materialName.toLowerCase().includes(kw) ||
          s.batchNo.toLowerCase().includes(kw) ||
          s.samplingNo.toLowerCase().includes(kw) ||
          s.witnessName.includes(searchText)
        );
      }
      return true;
    });
  }, [allSamplings, statusFilter, searchText]);

  const stats = useMemo(() => {
    return {
      total: allSamplings.length,
      pending: allSamplings.filter(s => s.status === 'pending' || s.status === 'sampling').length,
      testing: allSamplings.filter(s => s.status === 'sent' || s.status === 'testing').length,
      done: allSamplings.filter(s => s.status === 'done').length
    };
  }, [allSamplings]);

  const getStepStatus = (status: string, idx: number, curStep: number) => {
    const cur = curStep || (
      status === 'pending' ? 1 :
        status === 'sent' ? 3 :
          status === 'testing' ? 4 :
            status === 'done' ? 5 :
              curStep || 2
    );
    if (idx + 1 <= cur) return idx + 1 < cur ? 'done' : 'active';
    return 'pending';
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>取样送检</Text>
        <Text className='pageSubtitle'>见证取样 · 跟踪送检 · 录入检测</Text>
      </View>

      <SearchBar
        placeholder='搜索批号/取样号/见证'
        value={searchText}
        onChange={setSearchText}
        showScan
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
            title='暂无取样记录'
            description='到货验收后可生成见证取样任务'
            actionText='去新增取样'
            onAction={() => Taro.navigateTo({ url: '/pages/sampling-create/index' })}
          />
        ) : (
          filteredList.map(s => {
            const info = samplingStatusMap[s.status] || { text: s.status, type: 'info' };
            return (
              <View key={s.id} className={styles.card}>
                <View className={styles.cardHead}>
                  <View className={styles.headLeft}>
                    <View className={styles.qyIcon}><Text>🧪</Text></View>
                    <View>
                      <Text className={styles.qyNo}>{s.samplingNo}</Text>
                      <Text className={styles.matName}>{s.materialName} · 批号{s.batchNo.slice(-8)}</Text>
                    </View>
                  </View>
                  <StatusTag text={info.text} type={info.type} size='sm' />
                </View>

                <View className={styles.cardBody}>
                  <View className={styles.infoGrid}>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>取样规格</Text>
                      <Text className={styles.cellVal}>{s.spec}</Text>
                    </View>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>数量</Text>
                      <Text className={styles.cellVal}>{s.quantity}{s.unit}</Text>
                    </View>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>取样日期</Text>
                      <Text className={styles.cellVal}>{s.samplingDate}</Text>
                    </View>
                    <View className={styles.cell}>
                      <Text className={styles.cellLbl}>检测机构</Text>
                      <Text className={styles.cellVal}>{(s.labName || '').slice(0, 10)}</Text>
                    </View>
                  </View>
                </View>

                <View className={styles.timelineWrap}>
                  <Text className={styles.tlTitle}>📍 送检流程进度</Text>
                  <View className={styles.tlBar}>
                    {timelineSteps.map((step, i) => {
                      const st = getStepStatus(s.status, i, s.currentStep);
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
                          )}>{step}</Text>
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
                    <Text>{(s.witnessName || '监').slice(0, 1)}</Text>
                  </View>
                  <View className={styles.witInfo}>
                    <Text className={styles.witName}>监理见证：{s.witnessName}</Text>
                    <Text className={styles.witUnit}>{s.witnessUnit}</Text>
                  </View>
                  <View
                    className={styles.traceBtn}
                    onClick={() => Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${s.batchNo}` })}
                  >
                    <Text>� 追溯批次</Text>
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
