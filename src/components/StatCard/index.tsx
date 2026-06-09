import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'trace';
  subLabel?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color = 'primary', subLabel, onClick }) => {
  return (
    <View className={`${styles.card} ${styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`]}`} onClick={onClick}>
      <View className={styles.valueRow}>
        <Text className={styles.value}>{value}</Text>
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </View>
      <Text className={styles.label}>{label}</Text>
      {subLabel && <Text className={styles.subLabel}>{subLabel}</Text>}
    </View>
  );
};

export default StatCard;
