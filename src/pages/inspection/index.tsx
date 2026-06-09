import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { currentProjectId } from '@/data/projects';
import { getInspectionsByProject, inspectionConclusionMap, getUnqualifiedInspections } from '@/data/inspection';
import StatusTag from '@/components/StatusTag';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';

export default function InspectionPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [conclusionFilter, setConclusionFilter] = useState<string>('');

  const allInspections = useMemo(() => getInspectionsByProject(currentProjectId), []);
  const unqualified = useMemo(() => getUnqualifiedInspections(), []);

  const summary = useMemo(() => ({
    total: allInspections.length,
    qualified: allInspections.filter(i => i.conclusion === 'qualified').length,
    unqualified: allInspections.filter(i => i.conclusion === 'unqualified').length
  }), [allInspections]);

  const list = useMemo(() => {
    return allInspections.filter(i => {
      if (conclusionFilter && i.conclusion !== conclusionFilter) return false;
      if (search) {
        const kw = search.toLowerCase();
        return (
          i.materialName.toLowerCase().includes(kw) ||
          i.batchNo.toLowerCase().includes(kw) ||
          i.reportNo.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [allInspections, search, conclusionFilter]);

  const handleGoRect = (rectId?: string) => {
    if (rectId) {
      Taro.navigateTo({ url: `/pages/rectification/index?id=${rectId}` });
    } else {
      Taro.navigateTo({ url: '/pages/rectification/index' });
    }
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>检测管理</Text>
        <Text className='pageSubtitle'>录入结论 · 拦截不合格 · 复验登记</Text>
      </View>

      <SearchBar
        placeholder='搜索报告编号/材料/批号'
        value={search}
        onChange={setSearch}
      />

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={styles.num} style={{ color: '#1E6FFF' }}>{summary.total}</Text>
          <Text className={styles.lbl}>总检测</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.num} style={{ color: '#00B42A' }}>{summary.qualified}</Text>
          <Text className={styles.lbl}>合格</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.num} style={{ color: '#F53F3F' }}>{summary.unqualified}</Text>
          <Text className={styles.lbl}>不合格</Text>
        </View>
      </View>

      <View style={{ display: 'flex', gap: 12, paddingBottom: 16 }}>
        {[
          { label: '全部', value: '' },
          { label: '合格', value: 'qualified' },
          { label: '不合格', value: 'unqualified' },
        ].map(f => (
          <View
            key={f.value}
            style={{
              padding: '10px 20px',
              borderRadius: 40,
              fontSize: 24,
              background: conclusionFilter === f.value ? 'linear-gradient(135deg,#1E6FFF,#4D92FF)' : '#fff',
              color: conclusionFilter === f.value ? '#fff' : '#4E5969',
              fontWeight: conclusionFilter === f.value ? 500 : 400,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onClick={() => setConclusionFilter(f.value)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingBottom: 180 }}>
        {list.length === 0 ? (
          <EmptyState
            title='暂无检测记录'
            description='取样送检后检测机构会出具报告'
            actionText='去生成取样'
            onAction={() => Taro.switchTab({ url: '/pages/sampling/index' })}
          />
        ) : (
          list.map(i => {
            const cm = inspectionConclusionMap[i.conclusion];
            const isOk = i.conclusion === 'qualified';
            return (
              <View key={i.id} className={styles.reportCard}>
                <View className={styles.reportTop}>
                  <View>
                    <Text className={styles.reportNo}>报告编号：{i.reportNo}</Text>
                    <Text className={styles.reportTitle}>{i.materialName}</Text>
                    <Text style={{ fontSize: 22, color: '#86909C', marginTop: 4, display: 'block' }}>
                      {i.spec} · 批号 {i.batchNo}
                    </Text>
                  </View>
                  <StatusTag text={cm.label} type={cm.type} size='sm' />
                </View>

                <View className={styles.metaRow}>
                  <View className={styles.metaCell}>
                    <Text className={styles.metaLabel}>检测机构：</Text>
                    <Text>{i.labName}</Text>
                  </View>
                  <View className={styles.metaCell}>
                    <Text className={styles.metaLabel}>检测日期：</Text>
                    <Text>{i.inspectDate}</Text>
                  </View>
                  <View className={styles.metaCell}>
                    <Text className={styles.metaLabel}>检测师：</Text>
                    <Text>{i.inspector}</Text>
                  </View>
                  <View className={styles.metaCell}>
                    <Text className={styles.metaLabel}>复验：</Text>
                    <Text>{i.reInspection ? '是' : '否'}</Text>
                  </View>
                </View>

                <View className={classnames(
                  styles.conclusionBar,
                  isOk ? styles.conclusionQualified : styles.conclusionUnqualified
                )}>
                  <View className={classnames(styles.conclusionIcon, isOk ? styles.iconOk : styles.iconBad)}>
                    <Text>{isOk ? '✓' : '✕'}</Text>
                  </View>
                  <View className={styles.conclusionContent}>
                    <Text className={classnames(styles.conclusionText, isOk ? styles.textOk : styles.textBad)}>
                      检测结论：{cm.label}
                    </Text>
                    <Text className={styles.conclusionRemarks}>
                      {i.remarks}
                    </Text>
                    {!isOk && i.blockUsage && (
                      <Text style={{ fontSize: 20, color: '#F53F3F', fontWeight: 600, marginTop: 6, display: 'block' }}>
                        🔴 该批次已被拦截使用
                      </Text>
                    )}
                  </View>
                </View>

                <View className={styles.itemsTable}>
                  <View className={styles.tableHead}>
                    <Text>检测项目</Text>
                    <Text>标准值</Text>
                    <Text>实测值</Text>
                    <Text style={{ textAlign: 'center' }}>判定</Text>
                  </View>
                  {i.items.slice(0, 4).map((item, idx) => (
                    <View
                      key={idx}
                      className={classnames(
                        styles.tableRow,
                        item.isQualified ? styles.rowOk : styles.rowBad
                      )}
                    >
                      <Text className={styles.cellName}>{item.name}</Text>
                      <Text>{item.standard}</Text>
                      <Text className={styles.cellResult}>{item.result}</Text>
                      <Text style={{ textAlign: 'center' }}>
                        {item.isQualified ? '合格' : '不合格'}
                      </Text>
                    </View>
                  ))}
                  {i.items.length > 4 && (
                    <View style={{ padding: '12px 24px', fontSize: 20, color: '#1E6FFF', textAlign: 'center' }}>
                      + 查看全部 {i.items.length} 项 →
                    </View>
                  )}
                </View>

                <View className={styles.footerActions}>
                  {!isOk && i.rectificationRequired && (
                    <View
                      className={classnames(styles.actionItem, styles.actError)}
                      onClick={() => handleGoRect(i.rectificationId)}
                    >
                      <Text>📋 整改详情</Text>
                    </View>
                  )}
                  {!isOk && !i.reInspection && (
                    <View className={classnames(styles.actionItem, styles.actWarn)}>
                      <Text>🔄 加倍复验</Text>
                    </View>
                  )}
                  <View
                    className={classnames(styles.actionItem, styles.actInfo)}
                    onClick={() => Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${i.batchNo}` })}
                  >
                    <Text>🔗 追溯批次</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {unqualified.length > 0 && (
        <View className='fabBtn' style={{ background: 'linear-gradient(135deg,#F53F3F,#FF6B6B)' }}
          onClick={() => setConclusionFilter('unqualified')}
        >
          <Text style={{ fontSize: 32 }}>⚠</Text>
        </View>
      )}
    </View>
  );
}
