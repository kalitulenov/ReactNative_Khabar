// Импорт необходимых компонентов React Native и сторонних библиотек
import Loading from "@/components/Loading"; // Компонент индикатора загрузки
import { NewsItem } from "@/components/NewsList"; // Компонент отображения отдельной новости
import { NewsDataType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Для хранения данных локально на устройстве
import { useIsFocused } from "@react-navigation/native"; // Хук для определения, находится ли экран в фокусе
import axios from "axios"; // HTTP-клиент для выполнения API запросов
import { Link, Stack } from "expo-router"; // Навигация в Expo: Link для навигации, Stack для конфигурации заголовка
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// Тип пропсов компонента (пустой, так как компонент не принимает внешних пропсов)
type Props = {};

// Основной компонент страницы закладок
const Page = (props: Props) => {
  // Состояние для хранения списка новостей из закладок
  const [bookmarkNews, setBookmarkNews] = useState<NewsDataType[]>([]);

  // Состояние для управления отображением индикатора загрузки
  const [isLoading, setIsLoading] = useState(true);

  // Хук useIsFocused возвращает true, когда экран находится в фокусе навигации
  const isFocused = useIsFocused();

  // Эффект для загрузки закладок при монтировании и при каждом попадании экрана в фокус
  useEffect(() => {
    fetchBookmark();
  }, [isFocused]); // Зависимость от isFocused - загрузка происходит при каждом фокусировании на экране

  // Функция для получения и загрузки новостей из закладок
  const fetchBookmark = async () => {
    // Получаем строку с ID новостей из локального хранилища
    await AsyncStorage.getItem("bookmark").then(async (token) => {
      // Парсим строку JSON. Если token null, используем пустой массив (рекомендация ChatGPT)
      const res = token ? JSON.parse(token) : [];

      setIsLoading(true); // Начинаем загрузку - показываем индикатор

      if (res) {
        console.log("Bookmark", res);

        // Преобразуем массив ID новостей в строку, разделенную запятыми для API запроса
        let query_string = res.join(",");
        console.log("query_string", query_string);

        // Делаем запрос к API новостей, передавая все ID закладок
        const response = await axios.get(
          `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&id=${query_string}`
          // API ключ встроен в URL (небезопасно для production)
          // Параметр id= принимает строку с ID через запятую
        );

        const news = response.data.results; // Извлекаем массив новостей из ответа
        setBookmarkNews(news); // Сохраняем новости в состоянии
        setIsLoading(false); // Завершаем загрузку - скрываем индикатор
      } else {
        // Если нет закладок, очищаем список и скрываем индикатор
        setBookmarkNews([]);
        setIsLoading(false);
      }
    });
  };

  // Рендер компонента
  return (
    <>
      {/* Конфигурация заголовка навигационного стека */}
      <Stack.Screen
        options={{
          headerShown: true, // Показываем стандартный заголовок навигации
        }}
      />

      {/* Основной контейнер страницы */}
      <View style={styles.container}>
        {/* Условный рендеринг: индикатор загрузки или список новостей */}
        {isLoading ? (
          <Loading size="large" /> // Показываем индикатор загрузки
        ) : (
          // FlatList для эффективного отображения длинных списков
          <FlatList
            data={bookmarkNews} // Массив данных для отображения
            keyExtractor={(_, index) => `list_item${index}`} // Генерация ключей для элементов списка
            // Примечание: строка использует кавычки вместо бэктиков - вероятно ошибка шаблонной строки
            showsVerticalScrollIndicator={false} // Скрываем вертикальный индикатор прокрутки
            renderItem={({ index, item }) => {
              // Функция рендеринга каждого элемента списка
              return (
                // Link для навигации на детальную страницу новости
                <Link href={`/news/${item.article_id}`} asChild key={index}>
                  {/* <Link href={`./news/${item.article_id}`} asChild key={index}> */}

                  {/* TouchableOpacity делает элемент кликабельным с анимацией нажатия */}
                  <TouchableOpacity>
                    {/* Компонент NewsItem для отображения отдельной новости */}
                    <NewsItem item={item}></NewsItem>
                  </TouchableOpacity>
                </Link>
                // Альтернативный простой вариант (закомментирован):
                // <Text>{item.title}</Text>
              );
            }}
          />
        )}
      </View>
    </>
  );
};

export default Page;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1, // Занимает всё доступное пространство
    margin: 20, // Внешние отступы со всех сторон
  },
});
