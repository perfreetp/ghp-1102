import React, { useState, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { arrivals } from '@/data/arrivals';

const SAMPLING_POINTS = [
  { id: 'top', label: '上部', icon: '↑' },
  { id: 'mid', label: '中部', icon: '•' },
  { id: 'bottom', label: '下部', icon: '↓' },
  { id: 'left', label: '左侧', icon: '←' },
  { id: 'center', label: '中心', icon: '◎' },
  { id: 'right', label: '右侧', icon: '→' },
];

const LAB_LIST = [
  { name: '上海市建设工程检测中心', address: '浦东新区张江路200号' },
  { name: '同济建设工程质量检测站', address: '杨浦区四平路1239号' },
  { name: '中建八局检测技术中心', address: '浦东新区高科西路888号' },
];

export default function SamplingCreatePage() {
  const router = useRouter();
  const arrivalId = (router.params.arrivalId as string) || arrivals[0].id;

  const selectedArrival = useMemo(() => {
    return arrivals.find(a => a.id === arrivalId) || arrivals[0];
  }, [arrivalId]);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const samplingNo = useMemo(() => {
    return `QY${today.replace(/-/g, '')}${String(Math.floor(Math.random() * 9000) + 1000)}`;
  }, [today]);

  const [form, setForm] = useState({
    spec: selectedArrival?.spec || '',
    quantity: '',
    unit: selectedArrival?.unit || '吨',
    samplingDate: today,
    witnessName: '周建国',
    witnessUnit: '上海建科监理有限公司',
    witnessPhone: '13800138000',
    samplingPoints: ['mid', 'center'] as string[],
    labIndex: 0,
    sealNo: 'FH' + String(Math.floor(Math.random() * 90000) + 10000),
    sampler: '王磊',
    remarks: ''
  });

  const handleTogglePoint = (pointId: string) => {
    const exists = form.samplingPoints.includes(pointId);
    const newPoints = exists
      ? form.samplingPoints.filter(p => p !== pointId)
      : [...form.samplingPoints, pointId];
    setForm({ ...form, samplingPoints: newPoints });
  };

  const handleChangeArrival = () => {
    const items = arrivals.slice(0, 5).map(a => `${a.id} · ${a.materialName.slice(0, 12)}`);
    Taro.showActionSheet({
      itemList: items,
      success: res => {
        const arr = arrivals[res.tapIndex];
        if (arr) {
          setForm({
            ...form,
            spec: arr.spec,
            unit: arr.unit
          });
        }
      }
    });
  };

  const handleSelectLab = () => {
    Taro.showActionSheet({
      itemList: LAB_LIST.map(l => l.name),
      success: res => {
        setForm({ ...form, labIndex: res.tapIndex });
      }
    });
  };

  const handleSubmit = () => {
    if (!form.spec) {
      Taro.showToast({ title: '请填写取样规格', icon: 'none' });
      return;
    }
    if (form.samplingPoints.length === 0) {
      Taro.showToast({ title: '请选择取样部位', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认提交',
      content: `见证取样编号：${samplingNo}\n见证人：${form.witnessName}`,
      confirmColor: '#1E6FFF',
      success: res => {
        if (res.confirm) {
          Taro.showLoading({ title: '生成中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '取样任务已创建', icon: 'success' });
            setTimeout(() => Taro.switchTab({ url: '/pages/sampling/index' }), 1500);
          }, 1200);
        }
      }
    });
  };

  const lab = LAB_LIST[form.labIndex];

  return (
    <View className='pageContainer' style={{ paddingBottom: 200 }}>
      <View className={styles.arrivalSelector}>
        <View className={styles.selectorTitle}>
          <Text>📦 关联到货单<Text className={styles.required}>*</Text></Text>
          <Text className={styles.changeBtn} onClick={handleChangeArrival}>更换 ›</Text>
        </View>
        <View className={styles.selectedCard}>
          <View className={styles.selectedBadge} />
          <View className={styles.selectedContent}>
            <Text className={styles.selNo}>{selectedArrival?.id} · 批号 {selectedArrival?.batchNo}</Text>
            <Text className={styles.selName}>{selectedArrival?.materialName}</Text>
            <Text className={styles.selSpec}>{selectedArrival?.spec} · 供应商：{selectedArrival?.supplier?.slice(0, 12)}...</Text>
            <Text className={styles.selQty}>到货数量：{selectedArrival?.quantity}{selectedArrival?.unit}</Text>
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.cardTitle}>📋 取样信息</Text>

        <View className={styles.formRow}>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>取样规格<Text className={styles.required}>*</Text></Text>
            </View>
            <View className={styles.formInput}>
              <Input
                className={styles.inputText}
                placeholder='如Φ25mm×9m'
                value={form.spec}
                onInput={e => setForm({ ...form, spec: e.detail.value })}
              />
            </View>
          </View>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>取样数量</Text>
            </View>
            <View className={styles.formInput}>
              <Input
                className={styles.inputText}
                type='digit'
                placeholder='数量'
                value={form.quantity}
                onInput={e => setForm({ ...form, quantity: e.detail.value })}
              />
            </View>
          </View>
        </View>

        <View className={styles.formRow}>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>取样日期<Text className={styles.required}>*</Text></Text>
            </View>
            <View className={styles.formInput}>
              <Text className={styles.inputText}>{form.samplingDate}</Text>
              <Text style={{ color: '#C9CDD4' }}>▾</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>取样员</Text>
            </View>
            <View className={styles.formInput}>
              <Input
                className={styles.inputText}
                placeholder='取样员姓名'
                value={form.sampler}
                onInput={e => setForm({ ...form, sampler: e.detail.value })}
              />
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>
            <Text>取样部位（已选{form.samplingPoints.length}处）</Text>
          </View>
          <View className={styles.samplingPoints}>
            {SAMPLING_POINTS.map(p => {
              const selected = form.samplingPoints.includes(p.id);
              return (
                <View
                  key={p.id}
                  className={classnames(styles.pointItem, selected && styles.pointSelected)}
                  onClick={() => handleTogglePoint(p.id)}
                >
                  <Text className={styles.pointIcon}>{p.icon}</Text>
                  <Text>{p.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.cardTitle}>👁️ 监理见证人</Text>

        <View className={styles.witnessCard}>
          <View className={styles.witnessAvatar}>
            <Text>{form.witnessName.slice(0, 1)}</Text>
          </View>
          <View className={styles.witnessInfo}>
            <Text className={styles.wName}>{form.witnessName}</Text>
            <Text className={styles.wUnit}>{form.witnessUnit}</Text>
            <Text className={styles.wPhone}>📞 {form.witnessPhone}</Text>
          </View>
          <View
            className={styles.witnessChange}
            onClick={() => Taro.showToast({ title: '切换见证人', icon: 'none' })}
          >
            <Text>更换</Text>
          </View>
        </View>

        <View className={styles.sectionTag}>
          <Text className={styles.tagTitle}>📌 见证要求</Text>
          <Text className={styles.tagContent}>
            {'\n'}• 取样时监理必须全程在场见证
            {'\n'}• 试样封样后由见证人和取样人共同签字
            {'\n'}• 送检时必须携带见证记录和封样标识
          </Text>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.cardTitle}>🔬 送检信息</Text>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>
            <Text>检测机构<Text className={styles.required}>*</Text></Text>
          </View>
          <View className={styles.labCard} onClick={handleSelectLab}>
            <View className={styles.labIcon}>
              <Text>🏛️</Text>
            </View>
            <View className={styles.labInfo}>
              <Text className={styles.lName}>{lab.name}</Text>
              <Text className={styles.lAddr}>📍 {lab.address}</Text>
            </View>
            <Text style={{ color: '#C9CDD4' }}>›</Text>
          </View>
        </View>

        <View className={styles.formRow}>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>封样编号</Text>
            </View>
            <View className={styles.formInput}>
              <Text className={styles.inputText}>{form.sealNo}</Text>
            </View>
          </View>
          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>预计送检</Text>
            </View>
            <View className={styles.formInput}>
              <Text className={styles.inputText}>2日内送达</Text>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <View className={styles.formLabel}>
            <Text>备注说明</Text>
          </View>
          <View className={styles.formInput} style={{ minHeight: 100, paddingTop: 20, alignItems: 'flex-start' }}>
            <Input
              className={styles.inputText}
              placeholder='如有特殊要求请备注...'
              value={form.remarks}
              onInput={e => setForm({ ...form, remarks: e.detail.value })}
            />
          </View>
        </View>

        <View className={styles.previewCode}>
          <View className={styles.qrBox} />
          <View className={styles.codeInfo}>
            <Text className={styles.codeNo}>{samplingNo}</Text>
            <Text className={styles.codeTip}>
              生成后可打印二维码粘贴于试样封样处
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.submitBar}>
        <View
          className={classnames(styles.submitBtn, styles.btnSave)}
          onClick={() => Taro.showToast({ title: '已保存草稿', icon: 'none' })}
        >
          <Text>存草稿</Text>
        </View>
        <View
          className={classnames(styles.submitBtn, styles.btnSubmit)}
          onClick={handleSubmit}
        >
          <Text>✓ 提交见证取样</Text>
        </View>
      </View>
    </View>
  );
}
