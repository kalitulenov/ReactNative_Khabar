// Компонент индикатора загрузки (лоадера) для отображения во время выполнения асинхронных операций
// Обёртка над стандартным ActivityIndicator с центрированием на экране

import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps, // Типы пропсов для ActivityIndicator
  StyleSheet,
  View,
} from "react-native";

console.log("LOADING-> ");

// Определение типа пропсов компонента Loading
// Используется сложный тип, который включает все пропсы ActivityIndicator
// Это позволяет передавать любые свойства ActivityIndicator (size, color и т.д.) напрямую
const Loading = (
  props: React.JSX.IntrinsicAttributes & // Базовые атрибуты JSX
    React.JSX.IntrinsicClassAttributes<ActivityIndicator> & // Атрибуты класса ActivityIndicator
    Readonly<ActivityIndicatorProps> // Пропсы только для чтения ActivityIndicator
) => {
  return (
    // Контейнер, который центрирует индикатор загрузки на экране
    <View style={styles.container}>
      {/* 
          ActivityIndicator - стандартный компонент React Native для отображения индикатора загрузки
          {...props} - spread оператор передаёт все полученные пропсы напрямую в ActivityIndicator
          Это позволяет кастомизировать индикатор: размер, цвет и другие параметры
        */}
      <ActivityIndicator {...props}></ActivityIndicator>

      {/* 
          Закомментированный текст "Loading" - можно раскомментировать для отображения текста рядом с индикатором
          Полезно, если нужно показать пользователю, что именно загружается
          Например: <Text>Загрузка новостей...</Text>
        */}
      {/* <Text>Loading</Text> */}
    </View>
  );
};
console.log("<-LOADING");

export default Loading;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1, // Занимает всё доступное пространство родительского контейнера
    justifyContent: "center", // Вертикальное центрирование содержимого
    alignItems: "center", // Горизонтальное центрирование содержимого
    // Примечание: отсутствует backgroundColor, поэтому фон прозрачный/унаследованный
    // Часто добавляют полупрозрачный фон: backgroundColor: 'rgba(0,0,0,0.1)'
  },
});
