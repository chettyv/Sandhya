import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { ComponentProps, ReactNode } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, layout, shadows } from "@/theme/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

export function Page({
  children,
  scroll = true,
  onScroll,
}: {
  children: ReactNode;
  scroll?: boolean;
  // Optional scroll observer (e.g. reading progress). Throttled: ~6 events/s
  // keeps the JS thread free.
  onScroll?: ComponentProps<typeof ScrollView>["onScroll"];
}) {
  const { width } = useWindowDimensions();
  const contentStyle = [
    styles.pageContent,
    Platform.OS === "web" && styles.pageContentWeb,
    width > 760 && styles.pageContentWide,
  ];

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-parchment">
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          scrollEventThrottle={onScroll ? 160 : undefined}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle} className="flex-1">
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

export function TopBar({
  eyebrow,
  title,
  onProfile,
  leading,
}: {
  eyebrow?: string;
  title: string;
  onProfile?: () => void;
  leading?: ReactNode;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between gap-3">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        {leading}
        <View className="min-w-0 flex-1">
          {eyebrow ? (
            <Text className="mb-0.5 text-[11px] font-semibold uppercase text-saffron">
              {eyebrow}
            </Text>
          ) : null}
          <Text numberOfLines={1} className="text-[22px] font-semibold leading-7 text-ink">
            {title}
          </Text>
        </View>
      </View>
      {onProfile ? (
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          onPress={onProfile}
          className="h-10 w-10 items-center justify-center rounded-full border border-[#3B372F] bg-surface2"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Ionicons name="person-outline" size={19} color={colors.plum} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({
  children,
  className = "",
  onPress,
}: {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}) {
  const content = (
    <View
      className={`rounded-card border border-[#302C25] bg-surface p-4 ${className}`}
      style={shadows.card}
    >
      {children}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mb-2.5 mt-6 flex-row items-center justify-between">
      <Text className="text-[17px] font-semibold text-ink">{title}</Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10}>
          <Text className="text-sm font-semibold text-saffron">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Pill({
  label,
  icon,
  tone = "neutral",
}: {
  label: string;
  icon?: IconName;
  tone?: "neutral" | "warm" | "sage";
}) {
  const style =
    tone === "warm" ? "bg-[#4A3514]" : tone === "sage" ? "bg-[#1F332B]" : "bg-[#24211D]";
  const color = tone === "sage" ? colors.sage : tone === "warm" ? colors.saffron : colors.muted;
  return (
    <View className={`self-start flex-row items-center gap-1.5 rounded-md px-2.5 py-1 ${style}`}>
      {icon ? <Ionicons name={icon} size={13} color={color} /> : null}
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  disabled = false,
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded-lg px-5 py-3 ${disabled ? "bg-[#3C3934]" : "bg-saffron"}`}
      style={({ pressed }) => pressed && !disabled && styles.pressed}
    >
      <Text className="text-base font-semibold text-black">{label}</Text>
      {icon ? <Ionicons name={icon} size={18} color={colors.black} /> : null}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  icon,
  onPress,
  disabled = false,
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded-lg border border-[#3B372F] bg-surface px-5 py-3 ${disabled ? "opacity-60" : ""}`}
      style={({ pressed }) => pressed && !disabled && styles.pressed}
    >
      {icon ? (
        <Ionicons name={icon} size={18} color={disabled ? colors.muted : colors.plum} />
      ) : null}
      <Text className={`text-base font-semibold ${disabled ? "text-muted" : "text-plum"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function IconCircle({
  icon,
  label,
  onPress,
  filled = false,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  filled?: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className={`h-10 w-10 items-center justify-center rounded-full ${filled ? "bg-saffron" : "border border-[#3B372F] bg-surface2"}`}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Ionicons name={icon} size={20} color={filled ? colors.black : colors.plum} />
    </Pressable>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
  trailing,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-3 border-b border-[#302C25] py-3 last:border-b-0"
      style={({ pressed }) => (pressed && onPress ? styles.pressed : undefined)}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-lg ${danger ? "bg-[#351C1A]" : "bg-[#24211D]"}`}
      >
        <Ionicons name={icon} size={19} color={danger ? colors.rose : colors.plum} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className={`text-[15px] font-semibold ${danger ? "text-rose" : "text-ink"}`}>
          {title}
        </Text>
        {subtitle ? <Text className="mt-0.5 text-sm leading-5 text-muted">{subtitle}</Text> : null}
      </View>
      {trailing ??
        (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : null)}
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center rounded-card border border-dashed border-[#3B372F] bg-surface px-6 py-9">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-[#4A3514]">
        <Ionicons name={icon} size={25} color={colors.saffron} />
      </View>
      <Text className="text-center text-xl font-semibold text-ink">{title}</Text>
      <Text className="mb-5 mt-2 max-w-sm text-center text-[15px] leading-6 text-muted">
        {body}
      </Text>
      {action && onAction ? <PrimaryButton label={action} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 104,
    paddingTop: 8,
  },
  pageContentWeb: {
    minHeight: "100%",
  },
  pageContentWide: {
    width: "100%",
    maxWidth: layout.maxWidth,
    alignSelf: "center",
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
});
