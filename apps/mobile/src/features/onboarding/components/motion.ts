import { Easing } from "react-native-reanimated";

// Easing curve for entrance (layout) animations. Reanimated's web build only
// honours named curves or explicit beziers here, so this is a bezier: the
// same ease-out-cubic shape the timing animations use, expressed in a form
// every platform accepts.
export const EASE_OUT = Easing.bezier(0.33, 1, 0.68, 1);
