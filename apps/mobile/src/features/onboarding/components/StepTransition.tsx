import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const ENTER_MS = 340;
const EXIT_MS = 200;
const SLIDE = 44;

// Whether the screen a component sits on is the live one or the one on its
// way out. Entrance animations check this so a departing screen does not
// replay them while it fades.
const StepPhaseContext = createContext<"active" | "leaving">("active");
export const useStepPhase = () => useContext(StepPhaseContext);

type Snapshot = { key: string; node: ReactNode };

// Moves from one step to the next with the old screen sliding and fading
// out in the travel direction while the new one slides and fades in from
// the other side — forward and back. Driven by shared values rather than
// layout animations so it behaves identically on iOS, Android and web, and
// so the exit can read the direction at the moment the move starts.
//
// The departing screen must be in the same commit as the arriving one, under
// its original key, or React would unmount it and remount a copy a frame
// later (losing its scroll position and pending state). So the snapshot of
// the previous step is taken during render, from a ref, and the keyed
// "leaving" view is rendered from that snapshot in the very render in which
// the key changes; state catches up in the effect that starts the animation.
export function StepTransition({
  stepKey,
  direction,
  children,
}: {
  stepKey: string;
  direction: 1 | -1;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const [leaving, setLeaving] = useState<Snapshot | null>(null);
  const previous = useRef<Snapshot>({ key: stepKey, node: children });
  const enter = useSharedValue(1);
  const exit = useSharedValue(1);
  const travel = useSharedValue<1 | -1>(1);

  // During the render where the key changes, the ref still holds the
  // previous step; after the effect below runs it holds the current one.
  const departingNow = previous.current.key !== stepKey ? previous.current : null;
  const departing = departingNow ?? (leaving && leaving.key !== stepKey ? leaving : null);

  const clearLeaving = (key: string) => {
    setLeaving((current) => (current?.key === key ? null : current));
  };

  // Layout effect: the shared values are reset before the frame paints, so
  // neither screen flashes at the wrong opacity on the transition's first
  // frame.
  useLayoutEffect(() => {
    if (previous.current.key !== stepKey) {
      const snapshot = previous.current;
      setLeaving(snapshot);
      travel.value = direction;
      exit.value = 0;
      enter.value = 0;
      const slide = !reducedMotion;
      exit.value = withTiming(
        1,
        { duration: slide ? EXIT_MS : 120, easing: Easing.in(Easing.quad) },
        (finished) => {
          if (finished) runOnJS(clearLeaving)(snapshot.key);
        },
      );
      enter.value = withDelay(
        slide ? 70 : 0,
        withTiming(1, { duration: slide ? ENTER_MS : 140, easing: Easing.out(Easing.cubic) }),
      );
    }
    previous.current = { key: stepKey, node: children };
  });

  const enterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateX: reducedMotion ? 0 : (1 - enter.value) * SLIDE * travel.value },
      { scale: reducedMotion ? 1 : 0.985 + enter.value * 0.015 },
    ],
  }));
  const exitStyle = useAnimatedStyle(() => ({
    opacity: 1 - exit.value,
    transform: [
      { translateX: reducedMotion ? 0 : -exit.value * SLIDE * travel.value },
      { scale: reducedMotion ? 1 : 1 - exit.value * 0.02 },
    ],
  }));

  return (
    <>
      {departing ? (
        <Animated.View
          key={departing.key}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, exitStyle]}
        >
          <StepPhaseContext.Provider value="leaving">{departing.node}</StepPhaseContext.Provider>
        </Animated.View>
      ) : null}
      <Animated.View key={stepKey} style={[StyleSheet.absoluteFill, enterStyle]}>
        <StepPhaseContext.Provider value="active">{children}</StepPhaseContext.Provider>
      </Animated.View>
    </>
  );
}
