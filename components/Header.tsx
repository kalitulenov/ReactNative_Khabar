// Компонент заголовка приложения с пользовательской информацией и уведомлениями
// Обычно располагается в верхней части экрана

import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Библиотека иконок для React Native
import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения

type Props = {}; // Пустые пропсы (компонент не принимает параметров)

const Header = (props: Props) => {
  return (
    // Основной контейнер заголовка
    <View style={styles.container}>
      {/* Левая часть: информация о пользователе */}
      <View style={styles.userInfo}>
        {/* Аватар пользователя */}
        <Image
          // Используется случайное изображение пользователя с внешнего API
          // "xsgames.co" предоставляет случайные аватары
          source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }}
          // Параметр g=male задаёт генерацию только мужских аватаров
          style={styles.userImg}
          // Примечание: для production лучше использовать локальные изображения
          // или загруженные аватары пользователя
        />

        {/* Контейнер для текстовой информации о пользователе */}
        <View style={{ gap: 3 }}>
          {" "}
          {/* gap: 3 - расстояние между текстовыми элементами */}
          {/* Текст приветствия */}
          <Text style={styles.welcomeTxt}>Welcome</Text>
          {/* Имя пользователя (захардкожено) */}
          <Text style={styles.userName}>Jhon Doe</Text>
          // Примечание: "Jhon Doe" содержит опечатку (правильно "John Doe") //
          В реальном приложении имя должно приходить из данных пользователя
        </View>
      </View>

      {/* Правая часть: иконка уведомлений */}
      <TouchableOpacity
        onPress={() => {}} // Пустой обработчик нажатия (нужно реализовать)
        // Примечание: для лучшего UX стоит добавить минимальную реализацию
        // или хотя бы console.log для отладки
      >
        {/* Иконка уведомлений в контуре (outline версия) */}
        <Ionicons
          name="notifications-outline" // Имя иконки из библиотеки Ionicons
          size={24} // Размер иконки
          color={Colors.black} // Цвет иконки
        />
        // Примечание: есть также filled версия "notifications" для активных
        уведомлений
      </TouchableOpacity>
    </View>
  );
};

export default Header;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // Горизонтальные внутренние отступы (слева и справа)
    flexDirection: "row", // Горизонтальное расположение дочерних элементов
    justifyContent: "space-between", // Распределение: пользователь слева, иконка справа
    alignItems: "center", // Вертикальное выравнивание по центру
    marginBottom: 5, // Небольшой отступ снизу для разделения с контентом
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
