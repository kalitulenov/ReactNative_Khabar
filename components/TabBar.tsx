// Кастомная панель вкладок (TabBar) для навигации в приложении
// Анимированный индикатор текущей вкладки с плавными переходами

import TabBarButton from "@/components/TabBarButton"; // Пользовательский компонент кнопки вкладки
import { Colors } from "@/constants/Colors"; // Цветовая палитра
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"; // Типы для кастомного TabBar
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle, // Хук для создания анимированных стилей
  useSharedValue, // Хук для создания разделяемого значения между потоками
  withTiming, // Функция для плавной анимации
} from "react-native-reanimated"; // Библиотека для производительных анимаций

// Основной компонент кастомного TabBar
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  console.log("TABBAR->");

  // Состояние для хранения размеров TabBar (измеряются динамически)
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  // Начальные значения (20x100) будут заменены после измерения

  // Вычисляем ширину одной кнопки на основе общей ширины TabBar и количества вкладок
  const buttonWidth = dimensions.width / state.routes.length;
  // console.log("state1=", state);

  console.log("dimensions.width=", dimensions.width);
  console.log("state.routes.length=", state.routes.length);
  console.log("buttonWidth=", buttonWidth);

  // Обработчик измерения размеров TabBar
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
    // Вызывается при первом рендере TabBar, когда React Native вычисляет его размеры
  };

  // SharedValue для анимированной позиции индикатора по оси X
  const tabPositionX = useSharedValue(0);
  // Значение обновляется в UI потоке для плавной анимации 60fps

  // Создание анимированных стилей для индикатора вкладки
  const animatedStyle = useAnimatedStyle(() => {
    return {
      // Анимированное перемещение по горизонтали
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    // Основной контейнер TabBar
    <View onLayout={onTabbarLayout} style={styles.tabbar}>
      {/* 
        Анимированный индикатор текущей вкладки 
        Перемещается под активной кнопкой
      */}
      <Animated.View
        style={[
          animatedStyle, // Анимированная позиция
          {
            position: "absolute", // Абсолютное позиционирование относительно TabBar
            backgroundColor: Colors.tint, // Акцентный цвет индикатора
            top: 52, // Фиксированная позиция сверху (магическое число)
            left: 34, // Начальная позиция слева (магическое число)
            height: 8, // Высота индикатора
            width: 40, // Ширина индикатора
            // Примечание: жестко заданные значения могут не работать на всех устройствах
          },
        ]}
      />

      {/* 
        Рендерим кнопки для каждой вкладки из навигационного состояния
        state.routes - массив маршрутов (вкладок) из навигатора
      */}
      {state.routes.map((route, index) => {
        // Получаем опции для текущего маршрута из дескрипторов
        const { options } = descriptors[route.key];

        // Определяем label (текст) для вкладки в порядке приоритета:
        // 1. options.tabBarLabel (специальный label для TabBar)
        // 2. options.title (общий заголовок экрана)
        // 3. route.name (имя маршрута как fallback)
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        // Проверяем, является ли текущая вкладка активной
        const isFocused = state.index === index;

        // Обработчик нажатия на вкладку
        const onPress = () => {
          // Анимируем перемещение индикатора к новой позиции
          tabPositionX.value = withTiming(buttonWidth * index, {
            duration: 200, // Длительность анимации 200ms
          });

          // Эмитируем событие нажатия на вкладку (для навигационной системы)
          const event = navigation.emit({
            type: "tabPress", // Тип события
            target: route.key, // Целевой маршрут
            canPreventDefault: true, // Разрешаем предотвращение действия
          });

          // Навигация на выбранный маршрут, если:
          // 1. Вкладка еще не активна (isFocused = false)
          // 2. Событие не было предотвращено (например, другими обработчиками)
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        // Обработчик долгого нажатия (обычно для дополнительных действий)
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Рендерим кастомную кнопку вкладки
        return (
          <TabBarButton
            key={route.name} // Уникальный ключ (имя маршрута)
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            label={String(label)}
          />
        );
      })}
    </View>
  );
}

// Стили TabBar
const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row", // Горизонтальное расположение кнопок
    paddingTop: 5, // Верхний внутренний отступ
    paddingBottom: 5, // Нижний внутренний отступ (больше для "человеческого" большого пальца)
    backgroundColor: Colors.white, // Белый фон TabBar
    // Примечание: отсутствуют важные свойства:
    // - borderTopWidth/borderTopColor (для разделителя)
    // - shadow для iOS elevation для Android
  },
});
