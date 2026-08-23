// Native libraries the screens depend on, replaced with their shipped jest
// mocks. Anything Expo-specific is mocked by the jest-expo preset itself.
require("react-native-gesture-handler/jestSetup");
// react-native-reanimated/mock is mapped to jest.reanimated.js (jest.config.js),
// which extends the shipped mock; the package root resolves to it here and in
// expo-router/testing-library's own re-mock.
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));
jest.mock("react-native-safe-area-context", () => {
  // Bound as `mockReact`, not `React`: the NativeWind Babel plugin rewrites
  // `React.createElement` to its interop runtime, which jest forbids inside a
  // hoisted mock factory.
  const mockReact = require("react");
  const mockRN = require("react-native");
  const metrics = {
    insets: { top: 47, right: 0, bottom: 34, left: 0 },
    frame: { x: 0, y: 0, width: 390, height: 844 },
  };
  const SafeAreaProvider = ({ children }) =>
    mockReact.createElement(mockRN.View, { style: { flex: 1 } }, children);
  const SafeAreaView = ({ children, style }) =>
    mockReact.createElement(mockRN.View, { style }, children);
  return {
    SafeAreaProvider,
    SafeAreaView,
    SafeAreaInsetsContext: mockReact.createContext(metrics.insets),
    SafeAreaFrameContext: mockReact.createContext(metrics.frame),
    useSafeAreaInsets: () => metrics.insets,
    useSafeAreaFrame: () => metrics.frame,
    initialWindowMetrics: metrics,
  };
});

// Persisted state: an in-memory SecureStore so hydration completes and the
// index route can redirect into the tabs.
const memoryStore = new Map();
global.__memorySecureStore = memoryStore;
jest.mock("@/lib/secureStorage", () => ({
  getItemAsync: async (key) => global.__memorySecureStore.get(key) ?? null,
  setItemAsync: async (key, value) => {
    global.__memorySecureStore.set(key, value);
  },
  deleteItemAsync: async (key) => {
    global.__memorySecureStore.delete(key);
  },
}));

// No backend in the smoke run: the app must render from its bundled library.
delete process.env.EXPO_PUBLIC_SUPABASE_URL;
delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
