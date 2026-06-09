import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { projects, currentProjectId } from '@/data/projects';
import StatCard from '@/components/StatCard';
import StatusTag from '@/components/StatusTag';
import SectionHeader from '@/components/SectionHeader';

const projectStatusMap: Record<string, { label: string; type: any }> = {
  active: { label: '进行中', type: 'success' },
  paused: { label: '已暂停', type: 'warning' },
  completed: { label: '已竣工', type: 'info' }
};

const statusFilters = [
  { label: '全部项目', value: '' },
  { label: '进行中', value: 'active' },
  { label: '已暂停', value: 'paused' },
  { label: '已竣工', value: 'completed' }
];

export default function ProjectPage() {
  const [selectedId, setSelectedId] = useState(currentProjectId);
  const [statusFilter, setStatusFilter] = useState('');

  const currentProject = useMemo(() => projects.find(p => p.id === selectedId), [selectedId]);
  const filteredProjects = useMemo(() => {
    if (!statusFilter) return projects;
    return projects.filter(p => p.status === statusFilter);
  }, [statusFilter]);

  const selectProject = (id: string) => {
    setSelectedId(id);
    Taro.showToast({ title: '已切换项目', icon: 'success', duration: 1500 });
  };

  const handleQuickEntry = (type: string) => {
    switch (type) {
      case 'arrival':
        Taro.switchTab({ url: '/pages/arrival/index' });
        break;
      case 'sampling':
        Taro.switchTab({ url: '/pages/sampling/index' });
        break;
      case 'inspection':
        Taro.navigateTo({ url: '/pages/inspection/index' });
        break;
      case 'trace':
        Taro.switchTab({ url: '/pages/trace/index' });
        break;
    }
  };

  return (
    <View className='pageContainer'>
      {currentProject && (
        <View className={styles.header}>
          <View className={styles.projectSelect}>
            <View className={styles.currentProject}>
              <Text className={styles.currentLabel}>当前项目</Text>
              <Text className={styles.currentName}>{currentProject.name}</Text>
            </View>
            <Text className={styles.selectArrow}>⇅</Text>
          </View>
          <View className={styles.statGrid}>
            <StatCard
              label='到货批次'
              value={currentProject.stats.totalArrivals}
              unit='批'
              color='primary'
            />
            <StatCard
              label='待取样'
              value={currentProject.stats.pendingSampling}
              unit='批'
              color='warning'
            />
            <StatCard
              label='待出报告'
              value={currentProject.stats.pendingInspection}
              unit='项'
              color='info'
            />
            <StatCard
              label='合格率'
              value={currentProject.stats.passRate}
              unit='%'
              color='success'
              subLabel={`整改${currentProject.stats.rectifications}项`}
            />
          </View>
        </View>
      )}

      <View className={styles.quickEntry}>
        <View className={styles.quickItem} onClick={() => handleQuickEntry('arrival')}>
          <View className={`${styles.quickIcon} ${styles.iconArrival}`}>
            <Text>🚛</Text>
          </View>
          <Text className={styles.quickLabel}>到货验收</Text>
        </View>
        <View className={styles.quickItem} onClick={() => handleQuickEntry('sampling')}>
          <View className={`${styles.quickIcon} ${styles.iconSampling}`}>
            <Text>🧪</Text>
          </View>
          <Text className={styles.quickLabel}>取样送检</Text>
        </View>
        <View className={styles.quickItem} onClick={() => handleQuickEntry('inspection')}>
          <View className={`${styles.quickIcon} ${styles.iconInspect}`}>
            <Text>📊</Text>
          </View>
          <Text className={styles.quickLabel}>检测管理</Text>
        </View>
        <View className={styles.quickItem} onClick={() => handleQuickEntry('trace')}>
          <View className={`${styles.quickIcon} ${styles.iconTrace}`}>
            <Text>🔗</Text>
          </View>
          <Text className={styles.quickLabel}>质量追溯</Text>
        </View>
      </View>

      <SectionHeader title='项目列表' subtitle={`共 ${filteredProjects.length} 个项目`} />

      <ScrollView className={styles.filterBar} scrollX>
        {statusFilters.map(f => (
          <View
            key={f.value}
            className={classnames(styles.filterChip, statusFilter === f.value && styles.filterChipActive)}
            onClick={() => setStatusFilter(f.value)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.listArea}>
        {filteredProjects.map(p => {
          const ps = projectStatusMap[p.status];
          const isActive = p.id === selectedId;
          return (
            <View
              key={p.id}
              className={classnames(styles.projectCard, isActive && styles.projectCardActive)}
              onClick={() => selectProject(p.id)}
            >
              <View className={styles.projectRow}>
                <Text className={styles.projectName}>{p.name}</Text>
                <View className={styles.statusWrap}>
                  <StatusTag text={ps.label} type={ps.type} size='sm' />
                </View>
              </View>
              <View className={styles.projectLoc}>
                <Text className={styles.locIcon}>📍</Text>
                <Text>{p.location}</Text>
              </View>
              <View className={styles.projectInfo}>
                <View className={styles.infoItem}>
                  <Text>🏗️</Text>
                  <Text>{p.projectType}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text>📐</Text>
                  <Text>{p.area}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text>🏢</Text>
                  <Text>{p.buildingCount}栋</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text>👷</Text>
                  <Text>{p.manager}</Text>
                </View>
              </View>
              <View className={styles.projectStats}>
                <View className={styles.statItem}>
                  <Text className={styles.statNum}>{p.stats.totalArrivals}</Text>
                  <Text className={styles.statLabel}>到货</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNum}>{p.stats.pendingSampling}</Text>
                  <Text className={styles.statLabel}>待取样</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNum}>{p.stats.rectifications}</Text>
                  <Text className={styles.statLabel}>整改</Text>
                </View>
                <View className={styles.statItem}>
                  <Text className={styles.statNum} style={{ color: '#00B42A' }}>{p.stats.passRate}%</Text>
                  <Text className={styles.statLabel}>合格率</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
