import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  useReducedMotion,
} from "react-native-reanimated";

const ENTER_MS = 260;
const EXIT_MS = 170;

// Cross-fades one step into the next: the old content fades in place while
// the new one fades and slides in from the side it is travelling from. Both
// are absolutely positioned so neither pushes the other around during the
// overlap.
//
// Two constraints shape this. Reanimated's web build only runs predefined
// entering/exiting animations, and the app ships to web. And an exiting
// view animates with the `exiting` prop it last rendered, so a directional
// exit would be stale on a back-step; a plain fade out is always right.
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
  const entering = reducedMotion
    ? FadeIn.duration(120)
    : (direction > 0 ? FadeInRight : FadeInLeft)
        .delay(50)
        .duration(ENTER_MS)
        .easing(Easing.out(Easing.cubic));
  const exiting = FadeOut.duration(reducedMotion ? 100 : EXIT_MS);

  return (
    <Animated.View
      key={stepKey}
      entering={entering}
      exiting={exiting}
      style={StyleSheet.absoluteFill}
    >
      {children}
    </Animated.View>
  );
}
