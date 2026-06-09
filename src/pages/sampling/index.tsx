import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getSamplingsByProject, samplingStatusMap } from '@/data/sampling';
import { currentProjectId } from '@/data/projects';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';

const statusFilters = [
  { label: '全部', value: '' },
  { label: '待送检', value: 'pending' },
  { label: '已送检', value: 'sent' },
  { label: '检测中', value: 'testing' },
  { label: '已出报告', value: 'done' }
];

const timelineSteps = ['现场取样', '已封样', '送检测机构', '检测机构接收', '出具报告'];

export default function SamplingPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const allSamplings = useMemo(() => getSamplingsByProject(currentProjectId), []);

  const filteredList = useMemo(() => {
    return allSamplings.filter(s => {
      if (statusFilter && s.status !== statusFilter) return false;
      if (searchText) {
        const kw = searchText.toLowerCase();
        return (
          s.materialName.toLowerCase().includes(kw) ||
          s.batchNo.toLowerCase().includes(kw) ||
          s.samplingNo.toLowerCase().includes(kw) ||
          s.witness.includes(searchText)
        );
      }
      return true;
    });
  }, [allSamplings, statusFilter, searchText]);

  const stats = useMemo(() => {
    return {
      total: allSamplings.length,
      pending: allSamplings.filter(s => s.status === 'pending').length,
      testing: allSamplings.filter(s => s.status === 'sent' || s.status === 'testing').length,
      done: allSamplings.filter(s => s.status === 'done').length
    };
  }, [allSamplings]);

  const getStepStatus = (status: string, idx: number) => {
    const stepMap: Record<string, number> = {
      pending: 1,
      sent: 3,
      testing: 4,
      done: 5
    };
    const cur = stepMap[status] || 1;
    if (idx < cur) return 'done';
    if (idx === cur - 1) return 'doing';
    return 'pending';
  };

  const getStepTime = (s: any, idx: number) => {
    const times = ['', s.samplingTime, s.samplingTime, s.sendTime, s.receiveTime];
    return times[idx] || '';
  };

  const handleCreate = () => {
    Taro.navigateTo({ url: '/pages/sampling-create/index' });
  };

  const handleGoInspection = (samplingId: string) => {
    Taro.navigateTo({ url: `/pages/inspection/index?samplingId=${samplingId}` });
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>取样送检</Text>
        <Text className='pageSubtitle'>见证取样 · 跟踪送检 · 报告录入</Text>
      </View>

      <SearchBar
        placeholder='搜索材料/取样编号/见证人'
        value={searchText}
        onChange={setSearchText}
      />

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#1E6FFF' }}>{stats.total}</Text>
          <Text className={styles.statLabel}>总取样</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#FF7D00' }}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待送检</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#86909C' }}>{stats.testing}</Text>
          <Text className={styles.statLabel}>检测中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#00B42A' }}>{stats.done}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
      </View>

      <View className={styles.filterBar}>
        {statusFilters.map(f => (
          <View
            key={f.value}
            className={classnames(styles.filterBtn, statusFilter === f.value && styles.filterBtnActive)}
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
            description='对已验收的材料生成见证取样任务'
            actionText='新建取样'
            onAction={handleCreate}
          />
        ) : (
          filteredList.map(s => {
            const sm = samplingStatusMap[s.status];
            const stepIdx = s.status === 'pending' ? 0 : s.status === 'sent' ? 2 : s.status === 'testing' ? 3 : 4;
            return (
              <View key={s.id} className={styles.samplingCard}>
                <View className={styles.cardTop}>
                  <View>
                    <Text className={styles.samplingNo}>取样编号：{s.samplingNo}</Text>
                    <Text className={styles.samplingTitle}>{s.materialName}</Text>
                    <Text style={{ fontSize: 22, color: '#86909C', marginTop: 4, display: 'block' }}>
                      {s.spec}
                    </Text>
                  </View>
                  <StatusTag text={sm.label} type={sm.type} size='sm' />
                </View>

                <View className={styles.batchInfo}>
                  <Text className={styles.batchIcon}>🔗</Text>
                  <Text className={styles.batchText}>
                    关联批次：{s.batchNo} · 代表数量 {s.representQuantity}{s.materialName.includes('钢筋') ? '吨' : s.materialName.includes('水泥') ? '吨' : '㎡'}
                  </Text>
                </View>

                <View className={styles.infoGroup}>
                  <View className={styles.groupTitle}>
                    <Text>📋</Text>
                    <Text>取样信息</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <View className={styles.infoCol}>
                      <Text className={styles.infoLabel}>取样员</Text>
                      <Text className={styles.infoValue}>{s.sampler}</Text>
                    </View>
                    <View className={styles.infoCol}>
                      <Text className={styles.infoLabel}>取样地点</Text>
                      <Text className={styles.infoValue}>{s.samplingLocation}</Text>
                    </View>
                  </View>
                  <View className={styles.infoRow}>
                    <View className={styles.infoCol}>
                      <Text className={styles.infoLabel}>取样规格</Text>
                      <Text className={styles.infoValue}>{s.samplingQuantity}</Text>
                    </View>
                    <View className={styles.infoCol}>
                      <Text className={styles.infoLabel}>检测机构</Text>
                      <Text className={styles.infoValue} style={{ fontSize: 20 }}>{s.lab.slice(0, 12)}...</Text>
                    </View>
                  </View>
                </View>

                <View className={styles.witnessBox}>
                  <View className={styles.witnessAvatar}>
                    <Text>{s.witness.charAt(0)}</Text>
                  </View>
                  <View className={styles.witnessInfo}>
                    <Text className={styles.witnessName}>
                      监理见证人：{s.witness}
                      {s.witnessPhone && <Text style={{ fontSize: 20, color: '#86909C', fontWeight: 400, marginLeft: 12 }}>
                        {s.witnessPhone}
                      </Text>}
                    </Text>
                    <Text className={styles.witnessUnit}>{s.witnessUnit}</Text>
                  </View>
                </View>

                <View className={styles.timelineBox}>
                  {timelineSteps.map((step, idx) => {
                    const ss = getStepStatus(s.status, idx);
                    const t = getStepTime(s, idx);
                    return (
                      <View key={idx} className={styles.timelineItem}>
                        <View className={classnames(
                          styles.timelineDot,
                          ss === 'done' && styles.timelineDone,
                          ss === 'doing' && styles.timelineDoing
                        )} />
                        <View className={styles.timelineContent}>
                          <Text className={styles.timelineText}>
                            <Text className={
                              ss === 'done' ? styles.statusDone :
                              ss === 'doing' ? styles.statusDoing : styles.statusPending
                            }>{step}</Text>
                            {t && <Text className={styles.timelineTime}>· {t.slice(5)}</Text>}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  {s.expectedResultTime && (
                    <View className={styles.timelineItem}>
                      <View className={styles.timelineDot} />
                      <View className={styles.timelineContent}>
                        <Text className={styles.timelineText} style={{ color: '#FF7D00' }}>
                          预计出具报告：{s.expectedResultTime}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <View className={styles.cardFooter}>
                  {(s.status === 'done' || s.status === 'testing') && (
                    <View className={`${styles.filterBtn} ${styles.filterBtnActive}`} style={{ flex: 1 }}
                      onClick={() => handleGoInspection(s.id)}
                    >
                      <Text>查看检测报告</Text>
                    </View>
                  )}
                  {s.status === 'pending' && (
                    <View className={`${styles.filterBtn} ${styles.filterBtnActive}`} style={{ flex: 1 }}>
                      <Text>📤 去送检</Text>
                    </View>
                  )}
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
