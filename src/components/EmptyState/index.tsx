import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.scss';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description = '当前条件下没有相关记录',
  actionText,
  onAction
}) => {
  return (
    <View className={styles.container}>
      <View className={styles.iconBox}>
        <Text className={styles.icon}>📋</Text>
      </View>
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.desc}>{description}</Text>
      {actionText && onAction && (
        <Button className={styles.actionBtn} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
