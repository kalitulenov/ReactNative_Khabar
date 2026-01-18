// Компонент заголовка приложения с пользовательской информацией и уведомлениями
// Обычно располагается в верхней части экрана

import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import { Ionicons } from "@expo/vector-icons"; // Библиотека иконок для React Native
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {}; // Пустые пропсы (компонент не принимает параметров)
// console.log("HEADER-> ");

const Header = (props: Props) => {
  return (
    // Основной контейнер заголовка
    <View style={styles.container}>
      {/* Левая часть: информация о пользователе */}
      <View style={styles.userInfo}>
        {/* Аватар пользователя */}
        <Image
          source={require("@/assets/images/kali.jpeg")} // Локальное изображение
          // Параметр g=male задаёт генерацию только мужских аватаров
          style={styles.userImg}
        />

        {/* Контейнер для текстовой информации о пользователе */}
        <View style={{ gap: 3 }}>
          {" "}
          {/* gap: 3 - расстояние между текстовыми элементами */}
          <Text style={styles.welcomeTxt}>Добро пожаловать!</Text>
          <Text style={styles.userName}>Кали Туленов</Text>
        </View>
      </View>

      {/* Правая часть: иконка уведомлений */}
      <TouchableOpacity
        onPress={() => {}} // Пустой обработчик нажатия (нужно реализовать)
      >
        {/* Иконка уведомлений в контуре (outline версия) */}
        <Ionicons
          name="notifications-outline" // Имя иконки из библиотеки Ionicons
          size={24} // Размер иконки
          color={Colors.black} // Цвет иконки
        />
        {/* Примечание: есть также filled версия "notifications" для активных уведомлений */}
      </TouchableOpacity>
    </View>
  );
};
// console.log("HEADER-> ");

export default Header;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // Горизонтальные внутренние отступы (слева и справа)
    flexDirection: "row", // Горизонтальное расположение дочерних элементов
    justifyContent: "space-between", // Распределение: пользователь слева, иконка справа
    alignItems: "center", // Вертикальное выравнивание по центру
    marginBottom: 1, // Небольшой отступ снизу для разделения с контентом
    marginTop: 5, // Небольшой отступ снизу для разделения с контентом
    // Примечание: не задан paddingVertical, высота определяется содержимым
  },
  userImg: {
    width: 50, // Ширина аватара
    height: 50, // Высота аватара (равна ширине для квадрата)
    borderRadius: 30, // Радиус скругления (больше половины размера = круг)
    // borderRadius: 25 также создаст круг при размере 50x50
  },
  userInfo: {
    flexDirection: "row", // Горизонтальное расположение: аватар и текст
    alignItems: "center", // Вертикальное выравнивание по центру
    gap: 10, // Расстояние между аватаром и текстом (React Native 0.71+)
    // Для старых версий нужно использовать margin
  },
  welcomeTxt: {
    fontSize: 12, // Маленький размер шрифта для вторичного текста
    color: Colors.darkGrey, // Серый цвет для менее важного текста
    // Примечание: нет fontWeight - используется обычное начертание
  },
  userName: {
    fontSize: 14, // Стандартный размер шрифта
    fontWeight: "700", // Жирное начертание для выделения имени
    color: Colors.black, // Чёрный цвет для основного текста
    // Примечание: "700" соответствует bold, можно использовать "bold"
  },
});
