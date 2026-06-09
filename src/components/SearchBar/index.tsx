import React, { useState } from 'react';
import { View, Input, Text } from '@tarojs/components';
import styles from './index.module.scss';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  onScan?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '请输入搜索内容',
  value,
  onChange,
  onSearch,
  onScan
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className={`${styles.container} ${focused ? styles.focused : ''}`}>
      <View className={styles.searchBox}>
        <Text className={styles.icon}>🔍</Text>
        <Input
          className={styles.input}
          placeholder={placeholder}
          placeholderClass={styles.placeholder}
          value={value}
          onInput={(e) => onChange?.(e.detail.value)}
          onConfirm={(e) => onSearch?.(e.detail.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {onScan && (
        <View className={styles.scanBtn} onClick={onScan}>
          <Text className={styles.scanIcon}>📷</Text>
          <Text className={styles.scanText}>扫码</Text>
        </View>
      )}
    </View>
  );
};

export default SearchBar;
