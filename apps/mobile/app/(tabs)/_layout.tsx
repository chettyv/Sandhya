import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Platform, StyleSheet } from "react-native";

import { useCopy } from "@/lib/i18n";
import { colors } from "@/theme/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: ComponentProps<typeof Ionicons>["color"];
  focused: boolean;
}) {
  return <Ionicons name={name} size={focused ? 23 : 22} color={color} />;
}

export default function TabLayout() {
  const t = useCopy();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.item,
        sceneStyle: { backgroundColor: colors.parchment },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("today"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "heart" : "heart-outline"}
              color={focused ? colors.saffron : color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t("calendar"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ask"
        options={{
          title: t("chat"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t("explore"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? "compass" : "compass-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t("journey"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "leaf" : "leaf-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: Platform.select({ ios: 86, android: 70, default: 70 }),
    paddingTop: 6,
    paddingBottom: Platform.select({ ios: 20, android: 8, default: 8 }),
    backgroundColor: "#191916FA",
    borderTopColor: "#302C25",
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 6,
    shadowColor: colors.aubergine,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  item: { paddingTop: 2 },
  label: { fontSize: 10.5, fontWeight: "600", marginTop: 1 },
});
