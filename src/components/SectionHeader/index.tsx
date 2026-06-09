import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  onClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, extra, onClick }) => {
  return (
    <View className={styles.container} onClick={onClick}>
      <View className={styles.left}>
        <View className={styles.titleRow}>
          <View className={styles.indicator} />
          <Text className={styles.title}>{title}</Text>
        </View>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View className={styles.right}>
        {extra ?? (onClick && <Text className={styles.more}>查看更多 ›</Text>)}
      </View>
    </View>
  );
};

export default SectionHeader;
