import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

export interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  highlight?: boolean;
  divider?: boolean;
  valueColor?: 'primary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, highlight, divider = true, valueColor, onClick }) => {
  return (
    <View
      className={`${styles.row} ${divider ? styles.hasDivider : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <Text className={styles.label}>{label}</Text>
      <View className={styles.valueWrap}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Text className={`${styles.value} ${highlight ? styles.highlight : ''} ${valueColor ? styles[`color${valueColor.charAt(0).toUpperCase() + valueColor.slice(1)}`] : ''}`}>
            {value}
          </Text>
        ) : (
          value
        )}
        {onClick && <Text className={styles.arrow}>›</Text>}
      </View>
    </View>
  );
};

export default InfoRow;
