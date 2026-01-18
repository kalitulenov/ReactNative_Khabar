// Компонент горизонтального скроллируемого списка категорий новостей
// Название содержит опечатку: "Catgories" вместо "Categories"

import newsCategoryList from "@/constants/Categories"; // Массив категорий новостей
import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Определение пропсов компонента
type Props = {
  onCategoryChanged: (category: string) => void; // Callback при изменении выбранной категории
};

const Categories = ({ onCategoryChanged }: Props) => {
  // console.log("CATEGORIES-> ");

  // Ref для управления горизонтальным ScrollView (для программного скролла)
  const scrollRef = useRef<ScrollView>(null);

  // Ref-массив для хранения ссылок на все элементы TouchableOpacity (категории)
  // Используется для измерения позиций элементов
  //const itemRef = useRef<(TouchableOpacity)[] | null[]>([]);
  const itemRef = useRef<View[]>([]); // CHATGPT
  // Состояние для отслеживания активной (выбранной) категории
  const [activeIndex, setActiveIndex] = useState(0);

  // Функция обработки выбора категории
  const handleSelectCategory = (index: number) => {
    // Получаем ссылку на выбранный элемент
    const selected = itemRef.current[index];

    // Обновляем состояние активного индекса
    setActiveIndex(index);

    // Измеряем позицию выбранного элемента на экране
    // measure() возвращает координаты элемента относительно экрана
    selected?.measure((x, y, width, height, pageX, pageY) => {
      // Вычисляем смещение так, чтобы элемент был по центру экрана
      const screenWidth = Dimensions.get("window").width; // Получаем ширину экрана устройства

      // Формула центрирования:
      // x - текущая позиция элемента
      // - screenWidth/2 + width/2 - смещение для центрирования элемента
      const scrollToX = x - screenWidth / 2 + width / 2;

      // Выполняем программный скролл к вычисленной позиции
      scrollRef.current?.scrollTo({
        x: Math.max(0, scrollToX), // Защита от отрицательных значений
        animated: true, // Плавная анимация скролла
      });
    });

    // Вызываем callback родительского компонента с slug выбранной категории
    onCategoryChanged(newsCategoryList[index].slug);
  };
  // console.log("<-CATEGORIES");

  return (
    <View>
      {/* Заголовок раздела категорий */}
      <Text style={styles.title}>Новости дня</Text>

      {/* Горизонтальный ScrollView для списка категорий */}
      <ScrollView
        ref={scrollRef} // Ref для программного управления скроллом
        horizontal // Горизонтальное направление скролла
        showsHorizontalScrollIndicator={false} // Скрыть индикатор скролла
        contentContainerStyle={styles.itemsWrapper} // Стили контейнера элементов
      >
        {/* Маппинг массива категорий в элементы интерфейса */}
        {newsCategoryList.map((item, index) => (
          <TouchableOpacity
            // Сохраняем ref элемента в массив по индексу
            //   ref={(el) => (itemRef.current[index] = el!)}
            // DeepSeek
            ref={(el) => {
              if (el) {
                itemRef.current[index] = el!;
              }
            }}
            // key={index} // Ключ для React (используется индекс, что не идеально)
            key={item.id || index} // DeepSeek
            // Условные стили: добавляем активный стиль если это текущая категория
            style={[styles.item, activeIndex === index && styles.itemActive]}
            // Обработчик нажатия на категорию
            onPress={() => handleSelectCategory(index)}
          >
            {/* Текст категории с условным стилем для активного состояния */}
            <Text
              style={[
                styles.itemText,
                activeIndex === index && styles.itemTextActive,
              ]}
            >
              {item.title} {/* Отображаемое название категории */}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;

// Стили компонента
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "500", // Полужирный
    color: Colors.black,
    marginBottom: 1, // Отступ снизу перед списком категорий
    marginLeft: 20, // Отступ слева для выравнивания
    marginTop: -20, // Отрицательный отступ сверху (возможно для перекрытия других элементов)
    textAlign: "center",
  },
  itemsWrapper: {
    gap: 10, // Расстояние между элементами категорий
    paddingVertical: 5, // Вертикальные внутренние отступы
    paddingHorizontal: 20, // Горизонтальные внутренние отступы
    marginBottom: 10, // Отступ снизу для отделения от следующего контента
  },
  item: {
    borderWidth: 1, // Граница элемента
    borderColor: Colors.darkGrey, // Цвет неактивной границы
    paddingVertical: 5, // Вертикальные внутренние отступы
    paddingHorizontal: 16, // Горизонтальные внутренние отступы
    borderRadius: 10, // Закругленные углы
  },
  itemText: {
    fontSize: 14,
    color: Colors.darkGrey, // Цвет текста неактивной категории
    letterSpacing: 0.5, // Межбуквенное расстояние
  },
  itemActive: {
    backgroundColor: Colors.tint, // Цвет фона активной категории
    borderColor: Colors.tint, // Цвет границы активной категории
    fontSize: 14, // Дублирование (не нужно)
    color: Colors.darkGrey, // Дублирование (не нужно)
    letterSpacing: 0.5, // Дублирование (не нужно)
  },
  itemTextActive: {
    fontWeight: "600", // Полужирный текст для активной категории
    // Не хватает: color: Colors.white - для контраста на цветном фоне
  },
});
