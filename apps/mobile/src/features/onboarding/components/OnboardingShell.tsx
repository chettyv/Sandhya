import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressBar } from "./ProgressBar";

const HEADER_HEIGHT = 56;

import { colors, layout } from "@/theme/tokens";

// The frame every step shares: a 56pt header with back, progress and an
// optional right-hand action, then a full-bleed stage the step transition
// fills. The header never moves between steps so the eye always knows where
// the bar and the back control are.
export function OnboardingShell({
  progress,
  showProgress,
  canGoBack,
  onBack,
  rightAction,
  children,
}: {
  progress: number;
  showProgress: boolean;
  canGoBack: boolean;
  onBack: () => void;
  rightAction?: { label: string; onPress: () => void };
  children: ReactNode;
}) {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerSlot}>
          {canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              onPress={onBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.ink} />
            </Pressable>
          ) : null}
        </View>
        {showProgress ? (
          <ProgressBar progress={progress} label="Setup progress" />
        ) : (
          <View style={styles.flex} />
        )}
        <View style={[styles.headerSlot, styles.headerSlotEnd]}>
          {rightAction ? (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={rightAction.onPress}>
              <Text className="text-sm font-semibold text-plum">{rightAction.label}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={styles.stage}>{children}</View>
    </SafeAreaView>
  );
}

// A step's body: the question pinned in the upper band, its answers below,
// and a footer that stays put at the bottom regardless of option count — so
// a three-option screen and a six-option screen put Continue in the same
// place. Scrolls only when the content genuinely needs it.
export function StepLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  align = "left",
  keyboard = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  align?: "left" | "center";
  keyboard?: boolean;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width > 760;
  const body = (
    <>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, wide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={align === "center" ? styles.centered : undefined}>
          {eyebrow ? (
            <Text
              className={`mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-saffron ${align === "center" ? "text-center" : ""}`}
            >
              {eyebrow}
            </Text>
          ) : null}
          <Text
            accessibilityRole="header"
            className={`text-[30px] font-semibold leading-[38px] text-ink ${align === "center" ? "text-center" : ""}`}
            style={styles.display}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className={`mt-3 text-[16px] leading-6 text-muted ${align === "center" ? "text-center" : ""}`}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {children ? <View style={styles.children}>{children}</View> : null}
      </ScrollView>
      {footer ? <View style={[styles.footer, wide && styles.contentWide]}>{footer}</View> : null}
    </>
  );
  if (!keyboard) return <View style={styles.flex}>{body}</View>;
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + HEADER_HEIGHT : 0}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  flex: { flex: 1 },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: layout.screenPadding,
  },
  headerSlot: {
    width: 48,
    alignItems: "flex-start",
  },
  headerSlotEnd: {
    alignItems: "flex-end",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  stage: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 24,
    paddingBottom: 24,
  },
  contentWide: {
    width: "100%",
    maxWidth: layout.maxWidth,
    alignSelf: "center",
  },
  centered: {
    alignItems: "center",
  },
  children: {
    marginTop: 28,
  },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 12,
  },
  display: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }),
  },
});
