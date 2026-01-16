// Импорт необходимых компонентов React Native и библиотек
import { useRouter } from "expo-router"; // Хук для навигации в Expo Router
import { StatusBar } from "expo-status-bar"; // Компонент для управления статус-баром
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

const router = useRouter();

useEffect(() => {
  setTimeout(() => {
    router.replace("/(tabs)");
  }, 5000);
}, []);

// Компонент приветственного/стартового экрана приложения
const Page = () => {
  // Хук useRouter для программной навигации между экранами
  const router = useRouter();

  // Рендер компонента
  return (
    // Основной контейнер - занимает весь экран
    <View style={styles.container}>
      {/* 
        Настройка статус-бара (верхней полоски на iOS/Android)
        style="light" - белый текст на тёмном фоне
      */}
      <StatusBar style="light" />

      <Image
        source={require("@/assets/images/khabar.jpg")} // Локальное изображение
        style={styles.userImg}
      />
    </View>
  );
};

export default Page;

// Определение стилей компонента
const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    paddingTop: 200,
    paddingLeft: 80,
  },
  userImg: {
    width: 200,
    height: 100,
  },
});
