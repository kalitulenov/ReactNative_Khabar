// Компонент элемента слайдера для BreakingNews (карусели новостей)
// Отображает одну новость с изображением, градиентом и информацией об источнике

import { Colors } from "@/constants/Colors"; // Цветовая палитра
import { NewsDataType } from "@/types"; // Тип данных новости
import { LinearGradient } from "expo-linear-gradient"; // Градиентный фон
import { Link } from "expo-router"; // Навигация
import React from "react";
import {
  Animated, // Анимированная версия View из старого API (не используется)
  Dimensions, // Для получения размеров экрана
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SharedValue } from "react-native-reanimated"; // Новый API анимаций (не используется)

// Отладочный вывод в консоль (может замедлять производительность)
console.log("SliderItem:");

// Определение пропсов компонента
type Props = {
  slideItem: NewsDataType; // Данные одной новости
  index: number; // Индекс в слайдере (не используется)
  scrollX: SharedValue<number>; // Позиция скролла для анимаций (не используется)
  // Примечание: scrollX импортирован, но не используется в компоненте
};

// Получаем ширину экрана устройства для адаптивного дизайна
const { width } = Dimensions.get("screen");
// Примечание: лучше использовать useWindowDimensions() для реактивности на изменение ориентации

const SliderItem = ({ slideItem, index, scrollX }: Props) => {
  // Примечание: scrollX и index не используются, но объявлены в пропсах
  // Вероятно, предполагалось использовать для параллакс или zoom анимаций

  return (
    // Link для навигации на детальную страницу новости
    <Link href={`./news/${slideItem.article_id}`} asChild>
      {/* TouchableOpacity для анимации при нажатии */}
      <TouchableOpacity activeOpacity={0.9}>
        {" "}
        {/* Добавить activeOpacity для контроля */}
        {/* 
            Animated.View из старого API (не reanimated)
            Для анимаций лучше использовать Animated.View из react-native-reanimated
          */}
        <Animated.View style={styles.itemWrapper} key={slideItem.article_id}>
          {/* Основное изображение новости */}
          <Image
            source={{ uri: slideItem.image_url }}
            style={styles.image}
            resizeMode="cover" // Добавить для правильного отображения
          />

          {/* Градиентный оверлей поверх изображения для улучшения читаемости текста */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]} // Вертикальный градиент от прозрачного к темному
            // transparent = rgba(0,0,0,0)
            // rgba(0,0,0,0.8) = черный с 80% непрозрачности
            style={styles.background}
            // locations={[0.6, 1]} можно добавить для контроля точек градиента
          >
            {/* Контейнер с информацией об источнике новости */}
            <View style={styles.sourceInfo}>
              {/* Условный рендеринг иконки источника (если есть) */}
              {slideItem.source_icon && (
                <Image
                  source={{ uri: slideItem.source_icon }}
                  style={styles.sourceIcon}
                />
              )}
              {/* Название источника новости */}
              <Text style={styles.sourceName}>{slideItem.source_name}</Text>
            </View>

            {/* Заголовок новости (максимум 2 строки) */}
            <Text style={styles.title} numberOfLines={2}>
              {slideItem.title}
            </Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default SliderItem;

// Стили компонента
const styles = StyleSheet.create({
  itemWrapper: {
    position: "relative", // Позволяет абсолютное позиционирование дочерних элементов
    width: width, // Занимает всю ширину экрана
    justifyContent: "center", // Центрирование по вертикали (не нужно при position: relative)
    alignItems: "center", // Центрирование по горизонтали
    // Примечание: лучше добавить высоту для предотвращения склеивания слайдов
  },
  image: {
    width: width - 60, // Ширина экрана минус 60px (отступы по 30px с каждой стороны)
    height: 180, // Фиксированная высота
    borderRadius: 20, // Закругленные углы
    // Примечание: нет resizeMode - изображение может искажаться
  },
  background: {
    position: "absolute", // Накладывается поверх изображения
    left: 30, // Отступ слева для выравнивания с изображением
    right: 0, // Выравнивание по правому краю (конфликт с left/width)
    top: 0, // Верхний край совпадает с изображением
    width: width - 60, // Такая же ширина как у изображения
    height: 180, // Такая же высота как у изображения
    borderRadius: 20, // Такие же скругленные углы
    padding: 20, // Внутренние отступы для контента
    // Примечание: right: 0 конфликтует с width, можно удалить
  },
  sourceIcon: {
    width: 25, // Размер иконки источника
    height: 25, // Квадратная иконка
    borderRadius: 20, // Очень скругленные углы (почти круг)
    // Примечание: borderRadius: 12.5 создаст идеальный круг
  },
  sourceInfo: {
    flexDirection: "row", // Горизонтальное расположение: иконка и текст
    position: "absolute", // Абсолютное позиционирование внутри градиента
    top: 85, // Фиксированная позиция сверху (магическое число)
    paddingHorizontal: 20, // Горизонтальные отступы (дублирование с background)
    alignItems: "center", // Вертикальное выравнивание по центру
    gap: 5, // Расстояние между иконкой и текстом
    // Примечание: top: 85 эмпирическое значение, зависит от высоты изображения
  },
  sourceName: {
    color: Colors.white, // Белый текст для контраста на темном фоне
    fontSize: 12, // Маленький шрифт
    fontWeight: "600", // Полужирное начертание
    // Примечание: нет textShadow для лучшей читаемости
  },
  title: {
    fontSize: 14, // Размер шрифта заголовка
    color: Colors.white, // Белый текст
    position: "absolute", // Абсолютное позиционирование
    top: 120, // Фиксированная позиция (магическое число)
    paddingHorizontal: 20, // Горизонтальные отступы
    fontWeight: "600", // Полужирное начертание
    // Примечание: проблемы:
    // 1. top: 120 может конфликтовать с sourceInfo при длинных названиях источников
    // 2. Нет lineHeight для межстрочного интервала
    // 3. Нет textShadow для лучшей читаемости
  },
});
