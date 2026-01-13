// Компонент для отображения списка новостей с поддержкой навигации к детальной странице
// Состоит из двух частей: NewsList (контейнер списка) и NewsItem (элемент списка)

import { Colors } from "@/constants/Colors"; // Цветовая палитра
import { NewsDataType } from "@/types"; // Тип данных новости
import { Link } from "expo-router"; // Компонент навигации Expo Router
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "./Loading"; // Компонент индикатора загрузки

console.log("NEWSLIST-> ");

// Пропсы для основного компонента NewsList
type Props = {
  newsList: NewsDataType[]; // Массив новостей для отображения
};

// Основной компонент - список новостей
const NewsList = ({ newsList }: Props) => {
  return (
    // ScrollView для возможности прокрутки длинного списка
    <ScrollView style={styles.container}>
      {newsList.length == 0 ? ( // Проверка на пустой массив
        // Если новостей нет, показываем индикатор загрузки
        <Loading size={"large"} />
      ) : (
        // Если есть новости, рендерим список
        newsList.map((item, index) => (
          // Link для навигации на страницу деталей новости
          // asChild позволяет использовать TouchableOpacity как триггер навигации
          <Link href={`./news/${item.article_id}`} asChild key={index}>
            {/* TouchableOpacity для анимации при нажатии */}
            <TouchableOpacity>
              {/* Компонент отдельной новости */}
              <NewsItem item={item}></NewsItem>
            </TouchableOpacity>
          </Link>
        ))
      )}
    </ScrollView>
  );
};
console.log("<-NEWSLIST");

export default NewsList;

// Компонент отдельного элемента новости (экспортируется для использования в других местах)
export const NewsItem = ({ item }: { item: NewsDataType }) => {
  return (
    // Контейнер элемента новости (горизонтальный ряд)
    <View style={styles.itemContainer}>
      {/* Изображение новости (превью) */}
      <Image source={{ uri: item.image_url }} style={styles.itemImg} />

      {/* Контейнер с текстовой информацией */}
      <View style={styles.itemInfo}>
        {/* Категория новости (верхний регистр преобразуется) */}
        <Text style={styles.itemCategory}>{item.category}</Text>

        {/* Заголовок новости (основной текст) */}
        <Text style={styles.itemTitle}>{item.title}</Text>

        {/* Информация об источнике (горизонтальный ряд) */}
        <View style={styles.itemSourceInfo}>
          {/* Иконка источника новости */}
          <Image
            source={{ uri: item.source_icon }}
            style={styles.itemSourceImg}
          />
          {/* Название источника новости */}
          <Text style={styles.itemSourceName}>{item.source_name}</Text>
        </View>
      </View>
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20, // Горизонтальные отступы контейнера списка
    marginBottom: 5, // Небольшой отступ снизу
    // Примечание: нет paddingTop, может слипаться с предыдущими элементами
  },
  itemContainer: {
    flexDirection: "row", // Горизонтальное расположение: картинка слева, текст справа
    alignItems: "center", // Вертикальное выравнивание по центру
    marginBottom: 20, // Отступ между элементами списка
    flex: 1, // Занимает всю доступную ширину
    gap: 10, // Расстояние между дочерними элементами (React Native 0.71+)
    // marginRight: 10 перенесен в стиль itemImg
  },
  itemImg: {
    width: 70, // Фиксированная ширина изображения
    height: 70, // Фиксированная высота изображения (квадрат)
    borderRadius: 20, // Закругленные углы изображения
    marginRight: 10, // Отступ справа от изображения (устаревший способ, лучше gap)
  },
  itemInfo: {
    flex: 1, // Занимает всё оставшееся пространство
    gap: 10, // Расстояние между элементами информации
    justifyContent: "space-between", // Распределение пространства между элементами
    // Примечание: с gap и space-between может быть конфликт
  },
  itemCategory: {
    fontSize: 12, // Маленький шрифт для категории
    color: Colors.darkGrey, // Серый цвет для вторичной информации
    textTransform: "capitalize", // Первая буква заглавная, остальные строчные
    // Примечание: capitalize преобразует "TECHNOLOGY" в "Technology"
  },
  itemTitle: {
    fontSize: 12, // Маленький шрифт для заголовка (может быть недостаточно)
    fontWeight: "600", // Полужирное начертание для выделения
    color: Colors.black, // Черный цвет для основного текста
    // Примечание: нет lineHeight и numberOfLines - текст может обрезаться
  },
  itemSourceInfo: {
    flexDirection: "row", // Горизонтальное расположение: иконка и название
    gap: 6, // Расстояние между иконкой и текстом
    alignItems: "center", // Вертикальное выравнивание по центру
  },
  itemSourceImg: {
    width: 20, // Маленькая иконка источника
    height: 20, // Квадратная иконка
    borderRadius: 20, // Полностью круглая иконка (borderRadius = width/2)
  },
  itemSourceName: {
    fontSize: 10, // Очень маленький шрифт
    fontWeight: "400", // Обычное начертание
    color: Colors.darkGrey, // Серый цвет для вторичной информации
  },
});
