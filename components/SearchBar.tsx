// Компонент поисковой строки для фильтрации контента
// Включает иконку поиска и текстовое поле для ввода запроса

import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import { Ionicons } from "@expo/vector-icons"; // Иконки для UI
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

console.log("SEARCHBAR-> ");

// Определение типа пропсов компонента
type Props = {
  withHorizontalPadding: boolean; // Флаг: добавлять ли горизонтальные отступы
  setSearchQuery: Function; // Callback функция для обновления поискового запроса
  // Примечание: тип Function слишком общий, лучше указать конкретную сигнатуру
};

// Дублирование строки (возможно, ошибка копирования)
setSearchQuery: Function;

// Основной компонент SearchBar
const SearchBar = ({ withHorizontalPadding, setSearchQuery }: Props) => {
  return (
    // Основной контейнер с условным стилем отступов
    <View
      style={[
        styles.container, // Базовый стиль
        withHorizontalPadding && { paddingHorizontal: 20 }, // Условное добавление отступов
        // Альтернатива: withHorizontalPadding ? { paddingHorizontal: 20 } : {}
      ]}
    >
      {/* Внутренний контейнер поисковой строки */}
      <View style={styles.searchBar}>
        {/* Иконка поиска (лупа) */}
        <Ionicons
          name="search-outline" // Контурная иконка поиска
          size={30} // Размер иконки (довольно большой)
          color={Colors.lightGrey} // Светло-серый цвет иконки
        ></Ionicons>

        {/* Поле ввода текста для поиска */}
        <TextInput
          placeholder="Search" // Подсказка при пустом поле
          placeholderTextColor={Colors.lightGrey} // Цвет подсказки (совпадает с иконкой)
          style={styles.searchTxt} // Стили текстового поля
          autoCapitalize="none" // Отключить авто-капитализацию (важно для поиска)
          onChangeText={(query) => setSearchQuery(query)} // Обработчик изменения текста
          // Примечание: нет debounce/throttle - запросы будут на каждый символ
        ></TextInput>
      </View>
    </View>
  );
};
console.log("<-SEARCHBAR");

export default SearchBar;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 20, // Закомментировано - используется условный paddingHorizontal
    marginBottom: 20, // Отступ снизу для разделения с последующим контентом
    // Примечание: нет marginTop - может слипаться с предыдущими элементами
  },
  searchBar: {
    backgroundColor: "#E4E4E4", // Светло-серый фон поля поиска
    // Примечание: лучше использовать Colors.lightGrey для консистентности
    paddingHorizontal: 10, // Горизонтальные внутренние отступы
    paddingVertical: 1, // Вертикальные внутренние отступы
    borderRadius: 10, // Закругленные углы
    flexDirection: "row", // Горизонтальное расположение: иконка слева, поле справа
    gap: 5, // Расстояние между иконкой и полем ввода (React Native 0.71+)
    // Для старых версий: marginLeft: 5 у TextInput
  },
  searchTxt: {
    fontSize: 16, // Размер шрифта для текста поиска
    flex: 1, // Растягивается на всё доступное пространство
    color: Colors.darkGrey, // Цвет текста (темно-серый)
    // Примечание: отсутствуют важные свойства:
    // - outlineStyle: "none" (для веба)
    // - padding: 0 (для контроля внутренних отступов)
    // - lineHeight (для вертикального центрирования)
  },
});
