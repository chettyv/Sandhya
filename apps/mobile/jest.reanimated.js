// Reanimated's shipped jest mock predates a few hooks the app uses; fill them
// in with motion-off behaviour so screens render the way they do for a user
// who has Reduce Motion enabled.
//
// jest.config.js maps BOTH `react-native-reanimated` and
// `react-native-reanimated/mock` here, because expo-router/testing-library
// re-mocks the package with a factory that requires the latter and then sets
// `Reanimated.default.call`. Loading the shipped mock re-enters the package
// root mid-load, which runs that factory against THIS module's half-built
// exports: `default` must already exist (or the factory throws and caches an
// empty mock), and the exports object must be filled in place, never
// reassigned. The `.js` suffix dodges the mapping.
const exportsObject = module.exports;
exportsObject.default = {};
const mock = require("react-native-reanimated/mock.js");
Object.assign(exportsObject.default, mock.default);
Object.assign(exportsObject, mock, {
  default: exportsObject.default,
  useReducedMotion: () => true,
  ReduceMotion: mock.ReduceMotion ?? { System: "system", Always: "always", Never: "never" },
});
