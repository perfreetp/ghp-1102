import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { currentProjectId } from '@/data/projects';
import {
  getRectificationsByProject,
  rectificationStatusMap,
  sourceTypeMap,
  getPendingRectifications
} from '@/data/rectification';
import SearchBar from '@/components/SearchBar';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';

const STATUS_FILTERS = [
  { label: '全部', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '整改中', value: 'processing' },
  { label: '待确认', value: 'confirming' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' },
];

const dotColors: Record<string, string> = {
  pending: '#F53F3F',
  processing: '#FF7D00',
  confirming: '#1E6FFF',
  approved: '#00B42A',
  rejected: '#86909C'
};

export default function RectificationPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const allRects = useMemo(() => getRectificationsByProject(currentProjectId), []);
  const pending = useMemo(() => getPendingRectifications(), []);

  const summary = useMemo(() => ({
    total: allRects.length,
    pending: allRects.filter(r => r.status === 'pending').length,
    processing: allRects.filter(r => r.status === 'processing').length,
    confirming: allRects.filter(r => r.status === 'confirming').length,
  }), [allRects]);

  const list = useMemo(() => {
    return allRects.filter(r => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (search) {
        const kw = search.toLowerCase();
        return (
          r.rectNo.toLowerCase().includes(kw) ||
          r.title.toLowerCase().includes(kw) ||
          r.sourceNo?.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [allRects, search, statusFilter]);

  const handleApprove = (id: string) => {
    Taro.showModal({
      title: '监理确认通过',
      content: '确认该整改已完成并通过验收？',
      confirmColor: '#00B42A',
      success: res => {
        if (res.confirm) {
          Taro.showToast({ title: '已通过', icon: 'success' });
        }
      }
    });
  };

  const handleReject = (id: string) => {
    Taro.showModal({
      title: '驳回整改',
      content: '确认该整改未达标需要重新处理？',
      confirmColor: '#F53F3F',
      success: res => {
        if (res.confirm) {
          Taro.showToast({ title: '已驳回', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>整改管理</Text>
        <Text className='pageSubtitle'>发起整改 · 监理确认 · 闭环跟踪</Text>
      </View>

      <SearchBar
        placeholder='搜索整改编号/标题/关联单号'
        value={search}
        onChange={setSearch}
      />

      {pending.length > 0 && (
        <View style={{
          background: 'linear-gradient(135deg, #FFF3E0, #FFE4B8)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
          onClick={() => setStatusFilter('confirming')}
        >
          <View>
            <Text style={{ fontSize: 26, fontWeight: 600, color: '#AD4E00' }}>
              ⚠️ 有 {summary.confirming} 项整改待监理确认
            </Text>
            <Text style={{ fontSize: 22, color: '#AD4E00', opacity: 0.8, marginTop: 4, display: 'block' }}>
              请及时审核整改结果
            </Text>
          </View>
          <Text style={{ fontSize: 24, color: '#AD4E00', fontWeight: 500 }}>去处理 →</Text>
        </View>
      )}

      <View className={styles.summaryBar}>
        <View className={styles.summaryItem}>
          <Text className={styles.statNum} style={{ color: '#1E6FFF' }}>{summary.total}</Text>
          <Text className={styles.statLbl}>总整改</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.statNum} style={{ color: '#F53F3F' }}>{summary.pending}</Text>
          <Text className={styles.statLbl}>待处理</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.statNum} style={{ color: '#FF7D00' }}>{summary.processing}</Text>
          <Text className={styles.statLbl}>整改中</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.statNum} style={{ color: '#722ED1' }}>{summary.confirming}</Text>
          <Text className={styles.statLbl}>待确认</Text>
        </View>
      </View>

      <View className={styles.statusTabs}>
        {STATUS_FILTERS.map(f => (
          <View
            key={f.value}
            className={classnames(styles.tabItem, statusFilter === f.value && styles.tabActive)}
            onClick={() => setStatusFilter(f.value)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingBottom: 180 }}>
        {list.length === 0 ? (
          <EmptyState
            title='暂无整改记录'
            description='检测不合格或巡检发现问题可发起整改'
            actionText='去检测管理'
            onAction={() => Taro.navigateTo({ url: '/pages/inspection/index' })}
          />
        ) : (
          list.map(r => {
            const sm = rectificationStatusMap[r.status];
            const isUrgent = r.priority === 'high';
            const priClass = r.priority === 'high' ? styles.priorityHigh : r.priority === 'medium' ? styles.priorityMedium : styles.priorityLow;
            return (
              <View key={r.id} className={styles.rectCard}>
                <View className={classnames(styles.priorityBar, priClass)} />

                <View className={styles.cardHeader}>
                  <View style={{ flex: 1, paddingLeft: 8 }}>
                    <Text className={styles.rectNo}>
                      整改单：{r.rectNo}
                      {isUrgent && <Text style={{ color: '#F53F3F', marginLeft: 12 }}>🔴 紧急</Text>}
                    </Text>
                    <Text className={styles.rectTitle}>{r.title}</Text>
                  </View>
                  <StatusTag text={sm.label} type={sm.type} size='sm' />
                </View>

                <View className={styles.sourceSection}>
                  <Text className={styles.sourceLabel}>来源：{sourceTypeMap[r.sourceType]}</Text>
                  <Text className={styles.sourceContent}>{r.sourceNo || '—'}</Text>
                </View>

                <View className={styles.descText}>
                  <Text>{r.description}</Text>
                </View>

                <View className={styles.metaGrid}>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>发起人：</Text>
                    <Text className={styles.metaValue}>{r.initiator}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>负责人：</Text>
                    <Text className={styles.metaValue}>{r.responsible}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>发起时间：</Text>
                    <Text className={styles.metaValue}>{r.createDate}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>截止日期：</Text>
                    <Text className={styles.metaValue} style={{ color: r.deadline && r.status !== 'approved' ? '#F53F3F' : undefined }}>
                      {r.deadline}
                    </Text>
                  </View>
                </View>

                <View className={styles.timeline}>
                  <Text className={styles.timelineTitle}>📋 处理进度</Text>
                  {r.timeline.map((t, idx) => (
                    <View key={idx} className={styles.timelineItem}>
                      <View
                        className={styles.timelineDot}
                        style={{ backgroundColor: dotColors[r.status] || '#1E6FFF' }}
                      />
                      {idx < r.timeline.length - 1 && <View className={styles.timelineLine} />}
                      <View className={styles.timelineContent}>
                        <View className={styles.timelineHeader}>
                          <Text className={styles.timelineAction}>{t.action}</Text>
                          <Text className={styles.timelineTime}>{t.time}</Text>
                        </View>
                        <Text className={styles.timelineOperator}>操作人：{t.operator}</Text>
                        {t.remark && <Text className={styles.timelineRemark}>{t.remark}</Text>}
                      </View>
                    </View>
                  ))}
                </View>

                <View className={styles.cardActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.btnSecondary)}
                    onClick={() => r.sourceBatchNo && Taro.navigateTo({ url: `/pages/batch-detail/index?batchNo=${r.sourceBatchNo}` })}
                  >
                    <Text>🔗 追溯来源</Text>
                  </View>
                  {(r.status === 'pending' || r.status === 'rejected') && (
                    <View className={classnames(styles.actionBtn, styles.btnPrimary)}>
                      <Text>📝 开始整改</Text>
                    </View>
                  )}
                  {r.status === 'processing' && (
                    <View className={classnames(styles.actionBtn, styles.btnPrimary)}>
                      <Text>✅ 提交整改</Text>
                    </View>
                  )}
                  {r.status === 'confirming' && (
                    <>
                      <View
                        className={classnames(styles.actionBtn, styles.btnReject)}
                        onClick={() => handleReject(r.id)}
                      >
                        <Text>❌ 驳回</Text>
                      </View>
                      <View
                        className={classnames(styles.actionBtn, styles.btnApprove)}
                        onClick={() => handleApprove(r.id)}
                      >
                        <Text>✓ 监理确认</Text>
                      </View>
                    </>
                  )}
                  {r.status === 'approved' && (
                    <View className={classnames(styles.actionBtn, styles.btnSecondary)}>
                      <Text>📄 查看详情</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      <View className='fabBtn' onClick={() => Taro.showToast({ title: '发起整改', icon: 'none' })}>
        <Text style={{ fontSize: 28 }}>📋</Text>
      </View>
    </View>
  );
}
