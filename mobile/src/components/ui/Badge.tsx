/**
 * Badge component for THOTH mobile app
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../theme';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },

  // Variants
  default: {
    backgroundColor: colors.gray[100],
  },
  primary: {
    backgroundColor: colors.primary[100],
  },
  success: {
    backgroundColor: colors.success.light,
  },
  warning: {
    backgroundColor: colors.warning.light,
  },
  error: {
    backgroundColor: colors.error.light,
  },
  info: {
    backgroundColor: colors.info.light,
  },

  // Text styles
  text: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  defaultText: {
    color: colors.gray[700],
  },
  primaryText: {
    color: colors.primary[700],
  },
  successText: {
    color: colors.success.dark,
  },
  warningText: {
    color: colors.warning.dark,
  },
  errorText: {
    color: colors.error.dark,
  },
  infoText: {
    color: colors.info.dark,
  },
});

export default Badge;
