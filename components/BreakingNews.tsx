// Компонент для отображения "горячих/важных новостей" с горизонтальным скроллом (слайдер)
// tsrnfc - вероятно, означает "TypeScript React Native Functional Component" (сниппет)

import SliderItem from "@/components/SliderItem"; // Компонент отдельного слайда/новости
import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import { NewsDataType } from "@/types"; // Тип данных для новостей
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedRef, // Хук для получения анимированной ссылки на компонент
  useAnimatedScrollHandler, // Хук для создания обработчика скролла с поддержкой анимаций
  useSharedValue, // Хук для создания разделяемого значения между JS и UI потоками
} from "react-native-reanimated"; // Библиотека для производительных анимаций
import Pagination from "./Pagination"; // Компонент индикатора пагинации (точки слайдера)

// Определение пропсов компонента
type Props = {
  newsList: Array<NewsDataType>; // Массив новостей для отображения в слайдере
};

// Основной компонент BreakingNews
const BreakingNews = ({ newsList }: Props) => {
  // Состояние для хранения данных слайдера (может быть полезно для обновления данных)
  const [data, setData] = useState(newsList);

  // Состояние для отслеживания текущего индекса пагинации (не используется с Animated)
  const [paginationIndex, setPaginationIndex] = useState(0);

  // SharedValue для горизонтальной позиции скролла
  // Используется в анимациях и передается в дочерние компоненты
  const scrollX = useSharedValue(0);

  // Анимированная ссылка на FlatList для управления из анимаций
  const ref = useAnimatedRef<Animated.FlatList<any>>();

  // Создание анимированного обработчика скролла
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      // Обновляем значение scrollX при каждом скролле
      // e.contentOffset.x - текущая горизонтальная позиция скролла
      scrollX.value = e.contentOffset.x;

      // Примечание: здесь можно рассчитать текущий индекс слайда:
      // const index = Math.round(e.contentOffset.x / SCREEN_WIDTH);
      // setPaginationIndex(index);
    },
  });

  return (
    <View style={styles.container}>
      {/* Заголовок раздела "Важные новости" */}
      <Text style={styles.title}>BreakingNews</Text>

      {/* Обертка для слайдера */}
      <View style={styles.slideWrapper}>
        {/* 
          Animated.FlatList - анимированная версия FlatList для плавных анимаций
          Альтернатива: обычный <FlatList> без анимаций
        */}
        <Animated.FlatList
          ref={ref} // Ссылка для управления из анимаций
          data={data} // Массив данных для рендеринга
          // Функция для генерации уникальных ключей элементов
          // ВНИМАНИЕ: используется кавычки вместо бэктиков - ошибка шаблонной строки
          keyExtractor={(_, index) => "list_item${index}"}
          // Правильный вариант: keyExtractor={(_, index) => `list_item${index}`}

          // Рендер отдельного элемента слайдера
          renderItem={({ item, index }) => (
            // Передаем данные новости, её индекс и значение скролла для анимаций
            <SliderItem slideItem={item} index={index} scrollX={scrollX} />
          )}
          horizontal // Горизонтальный скролл вместо вертикального
          showsHorizontalScrollIndicator={false} // Скрыть горизонтальный индикатор скролла
          pagingEnabled // Постраничный скролл (как ViewPager)
          onScroll={onScrollHandler} // Обработчик скролла для обновления анимаций
          scrollEventThrottle={16} // Частота вызова onScroll (в миллисекундах)
          // 16ms ≈ 60 FPS, оптимально для плавных анимаций

          onEndReachedThreshold={0.5} // Порог для срабатывания onEndReached (не используется здесь)
        />

        {/* Компонент пагинации (индикатор текущего слайда) */}
        {/* Примечание: scrollX не передается в Pagination, хотя вероятно должно */}
        <Pagination />
        {/* Вероятно должно быть: <Pagination data={data} scrollX={scrollX} /> */}
      </View>
    </View>
  );
};

export default BreakingNews;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    marginBottom: 40, // Отступ снизу для отделения от следующего контента
    marginTop: -10, // Отрицательный отступ сверху (возможно для перекрытия других элементов)
  },
  title: {
    fontSize: 18,
    fontWeight: "600", // Полужирный шрифт
    color: Colors.black, // Черный цвет текста
    marginBottom: 5, // Небольшой отступ снизу перед слайдером
    marginLeft: 20, // Отступ слева для выравнивания с другим контентом
  },
  slideWrapper: {
    // width: "100%", // Закомментировано - занимает ширину родителя по умолчанию
    // flex: 1, // Закомментировано - не растягивается на весь экран
    justifyContent: "center", // Центрирование содержимого по вертикали
  },
});
