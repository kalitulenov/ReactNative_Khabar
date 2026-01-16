import { TabBar } from "@/components/TabBar";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ДОМ",
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "ПОИСК",
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "ИЗБРАННЫЕ",
        }}
      />
      {/* <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      /> */}
    </Tabs>
  );
};

export default TabLayout;
