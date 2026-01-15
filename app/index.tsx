// Импорт необходимых компонентов React Native и библиотек
import { router } from "expo-router"; // Хук для навигации в Expo Router
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

useEffect(() => {
  setTimeout(() => {
    router.replace("./(tabs)");
  }, 3000);
}, []);

// Компонент приветственного/стартового экрана приложения
const Page = () => {
  // Хук useRouter для программной навигации между экранами

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }}
        style={{ flex: 1 }}
      />
      <Text style={styles.title}>News App</Text>
    </View>
  );
};

export default Page;

// Определение стилей компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userImg: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
