import React, { useState } from 'react';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

const STEPS = [
  { id: 1, name: '扫码登记' },
  { id: 2, name: '拍照验视' },
  { id: 3, name: '规格核对' },
  { id: 4, name: '车辆记录' },
  { id: 5, name: '完成提交' }
];

const MATERIAL_TYPES = ['钢筋', '水泥', '砌体材料', '防水材料', '混凝土', '砂石骨料', '门窗', '管线', '其他'];

export default function ArrivalCreatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    batchNo: '',
    materialType: '',
    materialName: '',
    spec: '',
    contractSpec: 'Φ25mm×9m HRB400E',
    quantity: '',
    unit: '吨',
    supplier: '',
    vehicleNo: '',
    driverName: '',
    driverPhone: '',
    witness: '',
    remarks: ''
  });
  const [nameplatePhoto, setNameplatePhoto] = useState<string | null>(null);
  const [appearancePhotos, setAppearancePhotos] = useState<string[]>([]);

  const handleScan = () => {
    Taro.scanCode({
      success: res => {
        setForm({ ...form, batchNo: res.result });
        Taro.showToast({ title: '扫码成功', icon: 'success' });
      },
      fail: () => {
        setForm({ ...form, batchNo: 'HC2026' + Date.now().toString().slice(-8) });
      }
    });
  };

  const handleChooseImage = (type: 'nameplate' | 'appearance') => {
    Taro.chooseImage({
      count: type === 'nameplate' ? 1 : 5,
      success: res => {
        if (type === 'nameplate') {
          setNameplatePhoto(res.tempFilePaths[0]);
        } else {
          setAppearancePhotos([...appearancePhotos, ...res.tempFilePaths.slice(0, 5 - appearancePhotos.length)]);
        }
      },
      fail: () => {
        const mock = type === 'nameplate'
          ? 'https://picsum.photos/id/3/750/500'
          : 'https://picsum.photos/id/1/750/500';
        if (type === 'nameplate') {
          setNameplatePhoto(mock);
        } else {
          setAppearancePhotos([...appearancePhotos, mock].slice(0, 5));
        }
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = appearancePhotos.filter((_, i) => i !== index);
    setAppearancePhotos(newPhotos);
  };

  const handleSelect = (key: string, options: string[], title: string) => {
    Taro.showActionSheet({
      itemList: options,
      success: res => {
        setForm({ ...form, [key]: options[res.tapIndex] });
      }
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && !form.batchNo) {
      Taro.showToast({ title: '请先扫码或输入批号', icon: 'none' });
      return;
    }
    if (currentStep === 2 && !nameplatePhoto) {
      Taro.showToast({ title: '请上传铭牌照片', icon: 'none' });
      return;
    }
    if (currentStep === 3 && !form.spec) {
      Taro.showToast({ title: '请填写实际规格', icon: 'none' });
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    Taro.showModal({
      title: '确认提交',
      content: '到货信息提交后将自动生成取样任务提醒',
      confirmColor: '#1E6FFF',
      success: res => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '登记成功', icon: 'success' });
            setTimeout(() => Taro.navigateBack(), 1500);
          }, 1200);
        }
      }
    });
  };

  const specMatch = form.spec && form.contractSpec &&
    (form.spec.replace(/\s/g, '').toLowerCase() === form.contractSpec.replace(/\s/g, '').toLowerCase());

  return (
    <View className='pageContainer' style={{ paddingBottom: 200 }}>
      <View className={styles.stepBar}>
        {STEPS.map(s => {
          const isActive = s.id === currentStep;
          const isDone = s.id < currentStep;
          return (
            <View key={s.id} className={styles.stepItem}>
              <View className={classnames(
                styles.stepDot,
                isActive ? styles.dotActive : isDone ? styles.dotDone : styles.dotPending
              )}>
                <Text>{isDone ? '✓' : s.id}</Text>
              </View>
              <Text className={classnames(
                styles.stepLabel,
                isActive ? styles.labelActive : isDone ? styles.labelDone : ''
              )}>
                {s.name}
              </Text>
            </View>
          );
        })}
      </View>

      {currentStep === 1 && (
        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>📱 扫码登记批号</Text>

          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>材料批号<Text className={styles.required}>*</Text></Text>
              <Text style={{ fontSize: 20, color: '#86909C' }}>扫码自动录入</Text>
            </View>
            <View className={styles.formInput}>
              <Input
                className={styles.inputText}
                placeholder='请扫描材料包装二维码'
                value={form.batchNo}
                onInput={e => setForm({ ...form, batchNo: e.detail.value })}
              />
              <View className={styles.scanBtn} onClick={handleScan}>
                <Text>📷 扫码</Text>
              </View>
            </View>
          </View>

          <View className={styles.formRow}>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>材料类型<Text className={styles.required}>*</Text></Text>
              </View>
              <View className={styles.formInput} onClick={() => handleSelect('materialType', MATERIAL_TYPES, '选择材料类型')}>
                <Text className={classnames(styles.inputText, !form.materialType && styles.placeholder)}>
                  {form.materialType || '请选择'}
                </Text>
                <Text style={{ color: '#C9CDD4' }}>›</Text>
              </View>
            </View>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>材料名称<Text className={styles.required}>*</Text></Text>
              </View>
              <View className={styles.formInput}>
                <Input
                  className={styles.inputText}
                  placeholder='如HRB400E钢筋'
                  value={form.materialName}
                  onInput={e => setForm({ ...form, materialName: e.detail.value })}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {currentStep === 2 && (
        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>📷 拍照留存</Text>

          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>铭牌照片<Text className={styles.required}>*</Text></Text>
              <Text className={styles.photoTip}>清晰显示品牌/型号/批号</Text>
            </View>
            <View className={styles.photoGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {nameplatePhoto ? (
                <View className={classnames(styles.photoItem, styles.photoUploaded)}>
                  <Image className={styles.photoImg} src={nameplatePhoto} mode='aspectFill' />
                  <View className={styles.photoDelete} onClick={() => setNameplatePhoto(null)}>
                    <Text>×</Text>
                  </View>
                </View>
              ) : (
                <View
                  className={classnames(styles.photoItem, styles.photoAdd)}
                  onClick={() => handleChooseImage('nameplate')}
                >
                  <Text className={styles.plus}>+</Text>
                  <Text className={styles.text}>拍铭牌</Text>
                </View>
              )}
            </View>
          </View>

          <View className={styles.photoSection}>
            <View className={styles.formLabel}>
              <Text>外观照片</Text>
              <Text className={styles.photoTip}>最多5张 {appearancePhotos.length}/5</Text>
            </View>
            <View className={styles.photoGrid}>
              {appearancePhotos.map((p, i) => (
                <View key={i} className={classnames(styles.photoItem, styles.photoUploaded)}>
                  <Image className={styles.photoImg} src={p} mode='aspectFill' />
                  <View className={styles.photoDelete} onClick={() => handleDeletePhoto(i)}>
                    <Text>×</Text>
                  </View>
                </View>
              ))}
              {appearancePhotos.length < 5 && (
                <View
                  className={classnames(styles.photoItem, styles.photoAdd)}
                  onClick={() => handleChooseImage('appearance')}
                >
                  <Text className={styles.plus}>+</Text>
                  <Text className={styles.text}>拍外观</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {currentStep === 3 && (
        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>📐 规格核对</Text>

          <View className={styles.formRow}>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>实际规格<Text className={styles.required}>*</Text></Text>
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
                <Text>单位</Text>
              </View>
              <View className={styles.formInput} onClick={() => handleSelect('unit', ['吨', 'kg', '立方米', '块', '米', '件'], '选择单位')}>
                <Text className={styles.inputText}>{form.unit}</Text>
                <Text style={{ color: '#C9CDD4' }}>›</Text>
              </View>
            </View>
          </View>

          <View className={styles.formRow}>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>到货数量<Text className={styles.required}>*</Text></Text>
              </View>
              <View className={styles.formInput}>
                <Input
                  className={styles.inputText}
                  type='digit'
                  placeholder='请输入数量'
                  value={form.quantity}
                  onInput={e => setForm({ ...form, quantity: e.detail.value })}
                />
              </View>
            </View>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>见证人</Text>
              </View>
              <View className={styles.formInput}>
                <Input
                  className={styles.inputText}
                  placeholder='监理姓名'
                  value={form.witness}
                  onInput={e => setForm({ ...form, witness: e.detail.value })}
                />
              </View>
            </View>
          </View>

          <View className={styles.specCompare}>
            <Text className={styles.specTitle}>📋 合同规格对照表</Text>
            <View className={styles.specRow}>
              <Text className={styles.specLabel}>合同规格</Text>
              <Text className={styles.specValue}>{form.contractSpec}</Text>
              <Text className={styles.specIcon}>📄</Text>
            </View>
            <View className={styles.specRow}>
              <Text className={styles.specLabel}>实际到货</Text>
              <Text className={styles.specValue} style={{ color: form.spec ? '#1D2129' : '#C9CDD4' }}>
                {form.spec || '待填写'}
              </Text>
              <Text className={styles.specIcon}>
                {form.spec ? (specMatch ? '✅' : '⚠️') : '—'}
              </Text>
            </View>
            {form.spec && (
              <View
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: specMatch ? 'rgba(0,180,42,0.08)' : 'rgba(245,63,63,0.08)'
                }}
              >
                <Text style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: specMatch ? '#00B42A' : '#F53F3F'
                }}>
                  {specMatch ? '✅ 规格与合同一致' : '⚠️ 规格与合同存在差异，请确认'}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {currentStep === 4 && (
        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>🚚 供应商与车辆</Text>

          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>供应商<Text className={styles.required}>*</Text></Text>
            </View>
            <View className={styles.formInput}>
              <Input
                className={styles.inputText}
                placeholder='选择或输入供应商'
                value={form.supplier}
                onInput={e => setForm({ ...form, supplier: e.detail.value })}
              />
            </View>
          </View>

          <View className={styles.formRow}>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>车牌号码<Text className={styles.required}>*</Text></Text>
              </View>
              <View className={styles.formInput}>
                <Input
                  className={styles.inputText}
                  placeholder='如沪A·B2345'
                  value={form.vehicleNo}
                  onInput={e => setForm({ ...form, vehicleNo: e.detail.value })}
                />
              </View>
            </View>
            <View className={styles.formItem}>
              <View className={styles.formLabel}>
                <Text>司机姓名</Text>
              </View>
              <View className={styles.formInput}>
                <Input
                  className={styles.inputText}
                  placeholder='司机姓名'
                  value={form.driverName}
                  onInput={e => setForm({ ...form, driverName: e.detail.value })}
                />
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>联系电话</Text>
            </View>
            <View className={styles.formInput}>
              <Input
                className={styles.inputText}
                type='number'
                placeholder='手机号码'
                value={form.driverPhone}
                onInput={e => setForm({ ...form, driverPhone: e.detail.value })}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <View className={styles.formLabel}>
              <Text>验收备注</Text>
            </View>
            <Textarea
              className={styles.formTextarea}
              placeholder='如有特殊情况请备注说明...'
              value={form.remarks}
              onInput={e => setForm({ ...form, remarks: e.detail.value })}
              maxlength={200}
            />
          </View>
        </View>
      )}

      {currentStep === 5 && (
        <View className={styles.formCard}>
          <Text className={styles.cardTitle}>📋 确认信息</Text>
          <View style={{
            padding: 24,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(30,111,255,0.08), rgba(77,146,255,0.04))'
          }}>
            <View style={{ padding: '8px 0' }}>
              <Text style={{ fontSize: 22, color: '#86909C' }}>批号：{form.batchNo}</Text>
            </View>
            <View style={{ padding: '8px 0' }}>
              <Text style={{ fontSize: 24, fontWeight: 600, color: '#1D2129' }}>
                {form.materialName || '未填写名称'} · {form.spec || '未填写规格'}
              </Text>
            </View>
            <View style={{ padding: '8px 0', fontSize: 22, color: '#4E5969', lineHeight: 1.8 }}>
              <Text>数量：{form.quantity || '—'} {form.unit}{'\n'}</Text>
              <Text>供应商：{form.supplier || '—'}{'\n'}</Text>
              <Text>车辆：{form.vehicleNo || '—'}</Text>
            </View>
          </View>
          <View style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(255,125,0,0.06)'
          }}>
            <Text style={{ fontSize: 22, color: '#AD4E00', lineHeight: 1.6 }}>
              💡 提交后系统将自动：
              {'\n'}① 生成到货验收记录
              {'\n'}② 触发取样任务提醒
              {'\n'}③ 同步通知监理人员
            </Text>
          </View>
        </View>
      )}

      <View className={styles.submitBar}>
        {currentStep > 1 ? (
          <View
            className={classnames(styles.submitBtn, styles.btnSave)}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            <Text>上一步</Text>
          </View>
        ) : (
          <View
            className={classnames(styles.submitBtn, styles.btnSave)}
            onClick={() => Taro.showToast({ title: '已保存草稿', icon: 'none' })}
          >
            <Text>存草稿</Text>
          </View>
        )}
        <View
          className={classnames(styles.submitBtn, styles.btnSubmit, currentStep === 1 ? styles.btnFull : '')}
          onClick={currentStep === 5 ? handleSubmit : handleNext}
        >
          <Text>{currentStep === 5 ? '✓ 提交验收' : '下一步 →'}</Text>
        </View>
      </View>
    </View>
  );
}
