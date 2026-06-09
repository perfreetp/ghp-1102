import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useTraceStore } from '@/store/traceStore';
import { currentProjectId } from '@/data/projects';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '整改中' },
  { key: 'confirming', label: '待确认' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已驳回' }
];

const STEP_ICONS: Record<string, string> = {
  '发起整改': '🆕', '指派整改': '📋', '开始整改': '🔨',
  '提交整改': '📝', '监理确认通过': '✅', '监理驳回，需重新整改': '❌',
  '重新开始整改': '♻️'
};

export default function RectificationPage() {
  const store = useTraceStore();
  const [filter, setFilter] = useState('all');
  const [, setTick] = useState(0);

  // Tab切换回来时强制刷新
  useDidShow(() => {
    setTick(t => t + 1);
  });

  const allRects = useMemo(() =>
    store.getRectificationsByProject?.(currentProjectId) || store.rectifications || [],
    [store]);

  const stats = useMemo(() => ({
    total: allRects.length,
    pending: allRects.filter(r => r.status === 'pending').length,
    processing: allRects.filter(r => r.status === 'processing' || r.status === 'rejected').length,
    confirming: allRects.filter(r => r.status === 'confirming').length
  }), [allRects]);

  const urgentConfirm = useMemo(
    () => allRects.find(r => r.status === 'confirming' && r.priority === 'high'),
    [allRects]
  );

  const list = useMemo(() => {
    if (filter === 'all') return allRects;
    return allRects.filter(r => r.status === filter);
  }, [allRects, filter]);

  const handleStart = (id: string) => {
    store.updateRectificationStatus(id, 'processing');
    Taro.showToast({ title: '已开始整改', icon: 'success' });
  };

  const handleSubmit = (id: string) => {
    store.updateRectificationStatus(id, 'confirming');
    Taro.showToast({ title: '已提交监理确认', icon: 'success' });
  };

  const handleApprove = (id: string) => {
    Taro.showModal({
      title: '⚠️ 监理确认通过',
      content: '确认该整改已经现场复核合格？此操作将闭环完成整改流程，不可撤销。',
      confirmText: '确认通过',
      confirmColor: '#00B42A',
      success: r => {
        if (r.confirm) {
          store.approveRectification(id, '王建国（监理总监）');
          Taro.showToast({ title: '整改已通过', icon: 'success' });
        }
      }
    });
  };

  const handleReject = (id: string) => {
    Taro.showModal({
      title: '❌ 监理驳回',
      content: '确认该整改不符合要求？将进入整改中重新整改。',
      confirmText: '确认驳回',
      confirmColor: '#F53F3F',
      success: r => {
        if (r.confirm) {
          store.rejectRectification(id, '王建国（监理总监）');
          Taro.showToast({ title: '已驳回，重新整改', icon: 'none' });
        }
      }
    });
  };

  const handleRestart = (id: string) => {
    Taro.showModal({
      title: '♻️ 重新开始整改',
      content: '确认将该整改重置为整改中状态？',
      confirmText: '开始整改',
      confirmColor: '#FF7D00',
      success: r => {
        if (r.confirm) {
          store.restartRectification(id, '张工（项目整改负责人）');
          Taro.showToast({ title: '已重新开始整改', icon: 'success' });
        }
      }
    });
  };

  const getStatusMeta = (s: string) => {
    const map: Record<string, { text: string; type: any }> = {
      pending: { text: '待处理', type: 'warning' },
      processing: { text: '整改中', type: 'info' },
      confirming: { text: '待确认', type: 'pending' },
      approved: { text: '已通过', type: 'success' },
      rejected: { text: '已驳回', type: 'error' }
    };
    return map[s] || { text: s, type: 'info' };
  };

  return (
    <View className='pageContainer'>
      <View className='pageHeader'>
        <Text className='pageTitle'>整改管理</Text>
        <Text className='pageSubtitle'>发起整改 · 监理确认 · 闭环完成</Text>
      </View>

      {urgentConfirm && (
        <View className={styles.urgentBar} onClick={() => setFilter('confirming')}>
          <View className={styles.urgentLeft}>
            <Text className={styles.urgentIcon}>🔥</Text>
            <View className={styles.urgentText}>
              <Text className={styles.urgentTitle}>紧急待确认：{urgentConfirm.title}</Text>
              <Text className={styles.urgentDesc}>整改单号 {urgentConfirm.rectNo} · 请尽快监理复核</Text>
            </View>
          </View>
          <Text className={styles.urgentArrow}>→</Text>
        </View>
      )}

      <View className={styles.statBar}>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#1E6FFF' }}>{stats.total}</Text>
          <Text className={styles.statLbl}>总整改</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#F53F3F' }}>{stats.pending}</Text>
          <Text className={styles.statLbl}>待处理</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#FF7D00' }}>{stats.processing}</Text>
          <Text className={styles.statLbl}>整改中</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum} style={{ color: '#722ED1' }}>{stats.confirming}</Text>
          <Text className={styles.statLbl}>待确认</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {FILTERS.map(f => (
          <View
            key={f.key}
            className={classnames(styles.tabItem, filter === f.key && styles.tabActive)}
            onClick={() => setFilter(f.key)}
          >
            <Text>{f.label}</Text>
            {(['pending', 'processing', 'confirming'].includes(f.key) && stats[f.key as any] > 0) && (
              <View className={styles.tabBadge}><Text>{stats[f.key as any]}</Text></View>
            )}
          </View>
        ))}
      </View>

      <View style={{ paddingBottom: 180 }}>
        {list.length === 0 ? (
          <EmptyState
            title='暂无整改记录'
            description='发现质量问题时可发起整改流程'
            actionText='回到货验收'
            onAction={() => Taro.switchTab({ url: '/pages/arrival/index' })}
          />
        ) : (
          list.map(r => {
            const meta = getStatusMeta(r.status);
            const priorityGradient = r.priority === 'high'
              ? 'linear-gradient(180deg,#F53F3F 0%,#FF7D00 100%)'
              : r.priority === 'medium'
                ? 'linear-gradient(180deg,#FF7D00 0%,#FFB500 100%)'
                : 'linear-gradient(180deg,#00B42A 0%,#52C41A 100%)';
            return (
              <View key={r.id} className={styles.rectCard}>
                <View className={styles.priorityBar} style={{ background: priorityGradient }} />
                <View className={styles.cardBody}>
                  <View className={styles.cardHeader}>
                    <View className={styles.headerLeft}>
                      <Text className={styles.rectNo}>
                        {(r.priority === 'high' ? '🔴' : r.priority === 'medium' ? '🟡' : '🟢')} {r.rectNo || '整改单'}
                      </Text>
                      <StatusTag text={meta.text} type={meta.type} size='sm' />
                    </View>
                    <View className={styles.deadlineTag}>
                      <Text>📅 {r.deadline || '待指定'}</Text>
                    </View>
                  </View>

                  <View className={styles.sourceSection}>
                    <Text className={styles.sectionLabel}>来源：</Text>
                    <Text className={styles.sourceValue}>
                      {r.sourceType === 'inspection' ? '🔬 检测报告 ' : '👁️ 现场巡检 '}
                      {r.sourceBatchNo ? `批号 ${r.sourceBatchNo}` : (r.source || '未分类')}
                    </Text>
                  </View>

                  <Text className={styles.rectTitle}>{r.title || '整改事项'}</Text>
                  <View className={styles.problemBox}>
                    <Text className={styles.problemText}>❌ {r.description || '无详细描述'}</Text>
                  </View>

                  <View className={styles.metaGrid}>
                    <View className={styles.metaCell}>
                      <Text className={styles.metaKey}>负责人</Text>
                      <Text className={styles.metaVal}>{r.responsible || '未指派'}</Text>
                    </View>
                    <View className={styles.metaCell}>
                      <Text className={styles.metaKey}>涉及位置</Text>
                      <Text className={styles.metaVal}>{r.location || '未定位'}</Text>
                    </View>
                    <View className={styles.metaCell}>
                      <Text className={styles.metaKey}>创建人</Text>
                      <Text className={styles.metaVal}>{r.createdBy || '系统'}</Text>
                    </View>
                    <View className={styles.metaCell}>
                      <Text className={styles.metaKey}>创建时间</Text>
                      <Text className={styles.metaVal}>{r.createDate || r.createdAt || '2026-06-10'}</Text>
                    </View>
                  </View>

                  <View className={styles.timelineSection}>
                    <Text className={styles.timelineTitle}>处理进度</Text>
                    <View className={styles.timelineList}>
                      {(r.timeline || []).map((t, i) => (
                        <View key={i} className={styles.tlRow}>
                          <View className={styles.tlLeft}>
                            <View className={styles.tlDot}>
                              <Text style={{ fontSize: 16 }}>{STEP_ICONS[t.action] || '📌'}</Text>
                            </View>
                            {i < (r.timeline || []).length - 1 && <View className={styles.tlLine} />}
                          </View>
                          <View className={styles.tlContent}>
                            <View className={styles.tlRowHead}>
                              <Text className={styles.tlAction}>{t.action || '处理'}</Text>
                              <Text className={styles.tlTime}>{t.time || '---'}</Text>
                            </View>
                            <Text className={styles.tlOperator}>操作人：{t.operator || '未指定'}</Text>
                            {t.remark && <Text className={styles.tlRemark}>📝 {t.remark}</Text>}
                          </View>
                        </View>
                      ))}
                      {(r.timeline || []).length === 0 && (
                        <Text style={{ fontSize: 22, color: '#86909C', padding: 16 }}>⏳ 暂无处理记录</Text>
                      )}
                    </View>
                  </View>

                  {r.status === 'pending' && (
                    <View className={styles.actionBar}>
                      <View className={styles.actionBtn} style={{ background: 'linear-gradient(135deg,#FF7D00,#FF9A2E)' }}
                        onClick={() => handleStart(r.id)}>
                        <Text>🔨 开始整改</Text>
                      </View>
                    </View>
                  )}
                  {r.status === 'rejected' && (
                    <View className={styles.actionBar}>
                      <View className={classnames(styles.actionBtn, styles.btnGhost)}
                        onClick={() => Taro.showToast({ title: '整改照片上传中', icon: 'none' })}>
                        <Text>📷 上传凭证</Text>
                      </View>
                      <View className={styles.actionBtn} style={{ background: 'linear-gradient(135deg,#722ED1,#9254DE)' }}
                        onClick={() => handleRestart(r.id)}>
                        <Text>♻️ 重新整改</Text>
                      </View>
                    </View>
                  )}
                  {r.status === 'processing' && (
                    <View className={styles.actionBar}>
                      <View className={classnames(styles.actionBtn, styles.btnGhost)}
                        onClick={() => Taro.showToast({ title: '整改照片上传中', icon: 'none' })}>
                        <Text>📷 上传凭证</Text>
                      </View>
                      <View className={styles.actionBtn} style={{ background: 'linear-gradient(135deg,#1E6FFF,#4D92FF)' }}
                        onClick={() => handleSubmit(r.id)}>
                        <Text>📝 提交整改</Text>
                      </View>
                    </View>
                  )}
                  {r.status === 'confirming' && (
                    <View className={styles.actionBar}>
                      <View className={classnames(styles.actionBtn, styles.btnDanger)}
                        onClick={() => handleReject(r.id)}>
                        <Text>❌ 驳回</Text>
                      </View>
                      <View className={classnames(styles.actionBtn, styles.btnSuccess)}
                        onClick={() => handleApprove(r.id)}>
                        <Text>✅ 监理确认</Text>
                      </View>
                    </View>
                  )}
                  {r.status === 'approved' && (
                    <View className={styles.closedHint}>
                      <Text>✅ 整改已通过监理复核，流程闭环完成</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      <View className='fabBtn' onClick={() => Taro.showToast({ title: '发起整改功能', icon: 'none' })}>
        <Text style={{ fontSize: 36 }}>+</Text>
      </View>
    </View>
  );
}
