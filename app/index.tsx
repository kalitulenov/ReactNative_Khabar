// Импорт необходимых компонентов React Native и библиотек
import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import { useRouter } from "expo-router"; // Хук для навигации в Expo Router
import { StatusBar } from "expo-status-bar"; // Компонент для управления статус-баром
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"; // Анимационные компоненты и эффекты

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

      {/* 
        ImageBackground - фоновое изображение, растянутое на весь экран
        Оборачивает весь контент, создавая визуальный фон
      */}
      <ImageBackground
        source={require("@/assets/images/getting-started.jpg")} // Локальное изображение
        style={{ flex: 1 }} // Занимает всё доступное пространство
        resizeMode="cover" // Обрезает изображение для заполнения экрана без искажений
      >
        {/* 
          Обёртка для контента поверх фонового изображения
          Имеет полупрозрачный тёмный оверлей для улучшения читаемости текста
        */}
        <View style={styles.wrapper}>
          {/* 
            Анимированный заголовок с эффектом появления справа
            FadeInRight - анимация появления с движением справа
            .delay(300) - задержка 300ms перед началом анимации
            .duration(500) - длительность анимации 500ms
          */}
          <Animated.Text
            style={styles.title}
            entering={FadeInRight.delay(300).duration(500)}
          >
            Stay Update!!! {/* Основной заголовок экрана */}
          </Animated.Text>

          {/* 
            Анимированный подзаголовок с таким же эффектом
            Синхронизирован с заголовком для последовательного появления
          */}
          <Animated.Text
            style={styles.description}
            entering={FadeInRight.delay(300).duration(500)}
          >
            Get breaking news. {/* Описание или слоган приложения */}
          </Animated.Text>

          {/* 
            Анимированная обёртка для кнопки с эффектом появления сверху
            FadeInDown - анимация появления с движением сверху
            .delay(1200) - большая задержка (1200ms) для появления после текста
            .duration(500) - длительность анимации 500ms
          */}
          <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
            {/* 
              Кнопка "Get started" - основной интерактивный элемент
              При нажатии переводит пользователя на основной экран приложения
            */}
            <TouchableOpacity
              style={styles.btn}
              // router.replace заменяет текущий экран в стеке навигации на (tabs)
              // В отличие от router.push, нельзя вернуться назад к стартовому экрану
              onPress={() => router.replace("./(tabs)")}
            >
              {/* Текст на кнопке */}
              <Text style={styles.btnTxt}>Get started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Page;

// Определение стилей компонента
const styles = StyleSheet.create({
  container: {
    flex: 1, // Занимает весь доступный экран
  },
  wrapper: {
    flex: 1, // Растягивается на весь контейнер
    justifyContent: "flex-end", // Выравнивает содержимое по нижнему краю
    paddingBottom: 50, // Отступ снизу для отступа от края экрана
    paddingHorizontal: 30, // Горизонтальные отступы
    gap: 10, // Расстояние между дочерними элементами (React Native 0.71+)
    // Полупрозрачный чёрный оверлей для улучшения читаемости текста на фоне
    backgroundColor: "rgba(0,0,0,0.5)", // 50% прозрачности
  },
  title: {
    color: Colors.white, // Белый текст (из цветовой палитры)
    fontSize: 24, // Крупный размер шрифта для заголовка
    fontWeight: "600", // Полужирное начертание
    letterSpacing: 1.5, // Увеличенное межбуквенное расстояние
    lineHeight: 30, // Высота строки для лучшей читаемости
    textAlign: "center", // Выравнивание по центру
  },
  description: {
    color: Colors.white, // Белый текст
    fontSize: 16, // Средний размер шрифта
    fontWeight: "500", // Среднее начертание
    letterSpacing: 1.2, // Умеренное межбуквенное расстояние
    lineHeight: 22, // Высота строки
    textAlign: "center", // Выравнивание по центру
  },
  btn: {
    backgroundColor: Colors.tint, // Цвет фона кнопки (вероятно, акцентный цвет)
    paddingVertical: 15, // Вертикальные внутренние отступы
    paddingHorizontal: 20, // Горизонтальные внутренние отступы
    alignContent: "center", // Выравнивание содержимого по центру
    borderRadius: 10, // Закруглённые углы для современного вида
  },
  btnTxt: {
    color: Colors.white, // Белый текст на кнопке
    fontSize: 16, // Размер шрифта
    fontWeight: "700", // Жирное начертание для выделения
    textAlign: "center", // Выравнивание текста по центру
  },
});
