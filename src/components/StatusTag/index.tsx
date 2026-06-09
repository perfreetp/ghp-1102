import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

export interface StatusTagProps {
  type?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'trace';
  text: string;
  size?: 'sm' | 'md';
}

const StatusTag: React.FC<StatusTagProps> = ({ type = 'info', text, size = 'md' }) => {
  return (
    <View className={classnames(
      styles.tag,
      styles[`type${type.charAt(0).toUpperCase() + type.slice(1)}`],
      styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`]
    )}>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default StatusTag;
