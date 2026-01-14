// Анимированный компонент чекбокса (галочки) с плавными переходами
// Использует react-native-reanimated для производительных анимаций 60fps

import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import { AntDesign } from "@expo/vector-icons"; // Иконки Expo (используется иконка галочки)
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn, // Анимация появления (fade in)
  FadeOut, // Анимация исчезновения (fade out)
  LinearTransition, // Анимация перехода для изменения лэйаута
  useAnimatedStyle, // Хук для создания анимированных стилей
  withTiming, // Функция для плавного анимированного изменения значений
} from "react-native-reanimated"; // Анимированная версия View/Text

// Определение пропсов компонента
type Props = {
  label: string; // Текст метки чекбокса
  checked: boolean; // Состояние: выбран/не выбран
  onPress: () => void; // Callback при нажатии на чекбокс
};

// Основной компонент CheckBox
const CheckBox = ({ label, checked, onPress }: Props) => {
  // Создание анимированных стилей для контейнера чекбокса
  const rnAnimatedContainerStyle = useAnimatedStyle(() => {
    return {
      // Анимированное изменение фона
      backgroundColor: withTiming(
        checked ? "rgba(239,142,82,0.1)" : "transparent", // Полупрозрачный оранжевый или прозрачный
        { duration: 150 } // Длительность анимации 150ms
      ),

      // Анимированное изменение цвета границы
      borderColor: withTiming(
        checked ? Colors.tint : Colors.black, // Акцентный цвет или чёрный
        { duration: 150 }
      ),

      // Статические стили (не анимируются)
      paddingLeft: 16, // Фиксированный отступ слева
      paddingRight: checked ? 10 : 16, // Условный отступ справа (меньше когда есть иконка)
    };
  }, [checked]); // Зависимость от checked - стили пересчитываются при изменении состояния

  // Создание анимированных стилей для текста метки
  const rnTextStyle = useAnimatedStyle(() => {
    return {
      // Анимированное изменение цвета текста
      color: withTiming(
        checked ? Colors.tint : Colors.black, // Акцентный цвет или чёрный
        { duration: 150 }
      ),
    };
  }, [checked]); // Зависимость от checked

  return (
    // Анимированный контейнер чекбокса
    <Animated.View
      style={[styles.container, rnAnimatedContainerStyle]} // Комбинируем базовые и анимированные стили
      onTouchEnd={onPress} // Обработчик нажатия (onTouchEnd вместо onPress для лучшего контроля)
      // Анимация изменения лэйаута (размера/положения)
      layout={LinearTransition.springify().mass(0.8)}
      // springify() - преобразует в пружинную анимацию
      // mass(0.8) - уменьшает массу пружины для более быстрой реакции
    >
      {/* Анимированный текст метки */}
      <Animated.Text style={[styles.label, rnTextStyle]}>{label}</Animated.Text>

      {/* 
        Условный рендеринг иконки галочки (только когда checked = true)
        Иконка имеет отдельные анимации появления и исчезновения
      */}
      {checked && (
        <Animated.View
          style={styles.iconWrapper}
          // Анимация появления с fade-in эффектом
          entering={FadeIn.duration(350)} // Более длительная анимация (350ms)
          // Анимация исчезновения с fade-out эффектом
          exiting={FadeOut} // Стандартная длительность
        >
          {/* Иконка галочки из библиотеки AntDesign */}
          <AntDesign
            name={"checkcircle" as any} // Круглая галочка
            size={14} // Маленький размер
            color={Colors.tint} // Акцентный цвет
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default CheckBox;

// Базовые (неанимированные) стили компонента
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Горизонтальное расположение элементов
    justifyContent: "center", // Центрирование по горизонтали
    alignItems: "center", // Центрирование по вертикали
    borderWidth: 1, // Толщина границы
    borderColor: Colors.black, // Цвет границы по умолчанию
    borderRadius: 32, // Сильно закруглённые углы (почти капсула)
    paddingVertical: 8, // Вертикальные внутренние отступы
  },
  label: {
    fontSize: 14, // Размер шрифта
    color: Colors.black, // Цвет текста по умолчанию
  },
  iconWrapper: {
    marginLeft: 8, // Отступ слева от текста
    height: 14, // Фиксированная высота (совпадает с размером иконки)
    width: 14, // Фиксированная ширина (совпадает с размером иконки)
  },
});
