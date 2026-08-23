import Ionicons from "@expo/vector-icons/Ionicons";
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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Backdrop, type BackdropMood } from "./Backdrop";
import { EASE_OUT } from "./motion";
import { ProgressBar } from "./ProgressBar";
import { RisingText } from "./RisingText";
import { useStepPhase } from "./StepTransition";

import { colors, fonts, layout } from "@/theme/tokens";

const HEADER_HEIGHT = 56;
const BACK_SPRING = { damping: 16, stiffness: 300 };

// The frame every step shares: the ambient backdrop, a 56pt header with
// back and progress (balanced by an empty slot on the right), then a
// full-bleed stage the step transition fills. The header never moves
// between steps so the eye always knows where the bar and the back control
// are.
export function OnboardingShell({
  progress,
  position,
  total,
  showProgress,
  canGoBack,
  onBack,
  mood,
  seed,
  children,
}: {
  progress: number;
  position: number;
  total: number;
  showProgress: boolean;
  canGoBack: boolean;
  onBack: () => void;
  mood: BackdropMood;
  seed: number;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const backScale = useSharedValue(1);
  const backStyle = useAnimatedStyle(() => ({ transform: [{ scale: backScale.value }] }));

  return (
    <View style={styles.root}>
      <Backdrop mood={mood} seed={seed} />
      <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.headerSlot}>
            {canGoBack ? (
              <Animated.View entering={reducedMotion ? FadeIn.duration(120) : FadeIn.duration(220)}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back"
                  hitSlop={8}
                  onPressIn={() => {
                    if (!reducedMotion) backScale.value = withSpring(0.9, BACK_SPRING);
                  }}
                  onPressOut={() => {
                    backScale.value = withSpring(1, BACK_SPRING);
                  }}
                  onPress={onBack}
                >
                  <Animated.View style={[styles.backButton, backStyle]}>
                    <Ionicons name="arrow-back" size={20} color={colors.ink} />
                  </Animated.View>
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
          {showProgress ? (
            <ProgressBar
              progress={progress}
              position={position}
              total={total}
              label="Setup progress"
            />
          ) : (
            <View style={styles.flex} />
          )}
          <View style={styles.headerSlot} />
        </View>
        <View style={styles.stage}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

// A step's body: the question pinned in the upper band, its answers below,
// and a footer that stays put at the bottom regardless of option count — so
// a three-option screen and a six-option screen put Continue in the same
// place. The heading rises in word by word; the subtitle follows. Scrolls
// only when the content genuinely needs it.
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
  const reducedMotion = useReducedMotion();
  const phase = useStepPhase();
  const wide = width > 760;
  const animate = !reducedMotion && phase === "active";
  const centered = align === "center";
  const wordCount = title.split(" ").length;
  const subtitleDelay = 120 + wordCount * 38;

  const body = (
    <>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, wide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={centered ? styles.centered : undefined}>
          {eyebrow ? (
            <Animated.View
              entering={animate ? FadeInDown.duration(300).easing(EASE_OUT) : undefined}
              style={[styles.eyebrowRow, centered && styles.centeredRow]}
            >
              <View style={styles.eyebrowDot} />
              <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-saffron">
                {eyebrow}
              </Text>
            </Animated.View>
          ) : null}
          <RisingText
            accessibilityRole="header"
            text={title}
            delay={eyebrow ? 80 : 0}
            align={align}
            className={`text-[31px] font-semibold leading-[39px] text-ink ${centered ? "text-center" : ""}`}
            style={styles.display}
          />
          {subtitle ? (
            <Animated.View
              entering={
                animate ? FadeInUp.delay(subtitleDelay).duration(360).easing(EASE_OUT) : undefined
              }
            >
              <Text
                className={`mt-3 text-[16px] leading-6 text-muted ${centered ? "text-center" : ""}`}
              >
                {subtitle}
              </Text>
            </Animated.View>
          ) : null}
        </View>
        {children ? <View style={styles.children}>{children}</View> : null}
      </ScrollView>
      {footer ? (
        <Animated.View
          entering={animate ? FadeInUp.delay(260).duration(360) : undefined}
          style={[styles.footer, wide && styles.contentWide]}
        >
          {footer}
        </Animated.View>
      ) : null}
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
  safe: {
    flex: 1,
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  stage: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 26,
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
  centeredRow: {
    justifyContent: "center",
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.saffron,
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
    fontFamily: fonts.display,
  },
});
