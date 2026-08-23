import { Easing } from "react-native-reanimated";

// Easing curves for entrance/exit (layout) animations. Reanimated's web
// build only honours named curves or explicit beziers here, so these are
// beziers: the same ease-out-cubic / ease-in-cubic shapes the timing
// animations use, expressed in a form every platform accepts.
export const EASE_OUT = Easing.bezier(0.33, 1, 0.68, 1);
export const EASE_IN = Easing.bezier(0.32, 0, 0.67, 0);
