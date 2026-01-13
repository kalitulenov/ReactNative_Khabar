// Компонент кнопки для кастомной панели вкладок (TabBar)
// Включает анимированную иконку и текст с эффектом исчезновения/появления

import { Colors } from "@/constants/Colors"; // Цветовая палитра
import { icon } from "@/constants/Icons"; // Объект с иконками для разных маршрутов
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate, // Функция для интерполяции значений
  useAnimatedStyle, // Хук для создания анимированных стилей
  useSharedValue, // Хук для разделяемых значений (работают в UI потоке)
  withSpring, // Функция для пружинной анимации
} from "react-native-reanimated"; // Библиотека для производительных анимаций

// Определение пропсов компонента
const TabBarButton = ({
  onPress, // Обработчик нажатия
  onLongPress, // Обработчик долгого нажатия
  isFocused, // Флаг: активна ли текущая вкладка
  routeName, // Имя маршрута (используется для выбора иконки)
  label, // Текстовая метка вкладки
}: {
  onPress: Function; // Примечание: лучше использовать конкретный тип () => void
  onLongPress: Function; // Примечание: лучше использовать конкретный тип () => void
  isFocused: boolean; // Булево значение активности
  routeName: string; // Строка с именем маршрута (например: "Home", "Search")
  label: string; // Отображаемый текст
}) => {
  // SharedValue для управления анимацией прозрачности
  const opacity = useSharedValue(0);
  // Используется для создания обратной анимации: текст исчезает при активации

  // Эффект для обновления анимации при изменении isFocused
  useEffect(() => {
    // Анимируем изменение opacity с пружинным эффектом
    opacity.value = withSpring(
      // Обработка разных типов isFocused (для совместимости)
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 50 } // Очень быстрая анимация (50ms)
      // Примечание: withSpring обычно не использует duration, лучше withTiming
    );
  }, [opacity, isFocused]); // Зависимости: обновляем при изменении isFocused

  // Создание анимированных стилей для текста
  const animatedTextStyle = useAnimatedStyle(() => {
    // Интерполяция: при opacity.value = 0 → opacityValue = 1 (видимый)
    //               при opacity.value = 1 → opacityValue = 0 (невидимый)
    const opacityValue = interpolate(opacity.value, [0, 1], [1, 0]);
    // Таким образом, текст исчезает когда вкладка активна

    return {
      opacity: opacityValue, // Анимированная прозрачность текста
    };
  });

  return (
    // Pressable - современная альтернатива TouchableOpacity
    <Pressable
      onPress={onPress} // Обработчик обычного нажатия
      onLongPress={onLongPress} // Обработчик долгого нажатия
      style={styles.tabbarBtn} // Базовые стили
      // Примечание: можно добавить hitSlop для увеличения области нажатия
    >
      {/* 
        Динамическое получение иконки для текущего маршрута
        Предполагаемая структура объекта icon:
        {
          "Home": (params) => <IconComponent ... />,
          "Search": (params) => <IconComponent ... />,
          ...
        }
      */}
      {icon[routeName]({
        color: isFocused ? Colors.tabIconSelected : Colors.tabIconDefault,
        focused: isFocused,
        // Иконка получает цвет и фокус для изменения внешнего вида
      })}

      {/* Анимированный текст метки */}
      <Animated.Text
        style={[
          {
            // Цвет текста меняется в зависимости от активности
            color: isFocused ? Colors.tabIconSelected : Colors.tabIconDefault,
            fontSize: 12, // Маленький шрифт для экономии места
            // Примечание: можно добавить fontWeight для лучшей читаемости
          },
          animatedTextStyle, // Анимированная прозрачность
        ]}
        numberOfLines={1} // Ограничение текста одной строкой
        ellipsizeMode="tail" // Троеточие в конце при обрезке
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

// Стили компонента
const styles = StyleSheet.create({
  tabbarBtn: {
    flex: 1, // Каждая кнопка занимает равную долю ширины TabBar
    justifyContent: "center", // Вертикальное центрирование содержимого
    alignItems: "center", // Горизонтальное центрирование содержимого
    gap: 5, // Расстояние между иконкой и текстом (React Native 0.71+)
    // Для старых версий: marginTop: 5 у Text
    paddingVertical: 8, // Вертикальные внутренние отступы для увеличения hit area
  },
});
