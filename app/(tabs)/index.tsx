// Импорт необходимых компонентов и модулей
import { NewsDataType } from "@/types"; // Типы TypeScript для данных новостей
import axios from "axios"; // HTTP-клиент для запросов к API
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Для учета безопасных зон экрана

// import BreakingNews from "@/components/BreakingNews"; // Компонент для отображения главных новостей
import Categories from "@/components/Categories"; // Компонент категорий новостей (опечатка в названии - Categories)
import Header from "@/components/Header";
import NewsList from "@/components/NewsList"; // Компонент списка новостей
import SearchBar from "@/components/SearchBar"; // Компонент поиска

// Определение типа пропсов компонента (в данном случае пустой объект)
type Props = {};

// Основной компонент страницы
const Page = (props: Props) => {
  // Получение отступов безопасной зоны (для iPhone X+ и подобных устройств)
  const { top: safeTop } = useSafeAreaInsets();

  // Состояние для хранения главных/срочных новостей
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);

  // Состояние для хранения обычных новостей (с фильтрацией по категориям)
  const [news, setNews] = useState<NewsDataType[]>([]);

  // Состояние для отслеживания загрузки данных
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(""); // CHATGPT
  const [category, setCategory] = useState(""); // CHATGPT
  let queryString = "";

  // Хук useEffect для выполнения запросов при монтировании компонента
  useEffect(() => {
    //    getBreakingNews(); // Загрузка главных новостей
    getNews(); // Загрузка обычных новостей
  }, []); // Пустой массив зависимостей - выполняется один раз при монтировании

  useEffect(() => {
    if (searchQuery.length < 4) return;
    setNews([]); // Очистка текущих новостей перед загрузкой новых
    queryString = `&q=${searchQuery}`;
    console.log("useEffect =Category: ", category); // Логирование выбранной категории
    console.log("useEffect =searchQuery: ", searchQuery); // Логирование выбранной категории

    getNews(category, queryString);
  }, [searchQuery]);

  // Обработчик изменения категории
  const onCatChanged = (category: string) => {
    console.log("onCatChanged =Category: ", category); // Логирование выбранной категории
    console.log("onCatChanged =searchQuery: ", searchQuery); // Логирование выбранной категории
    setNews([]); // Очистка текущих новостей перед загрузкой новых
    setCategory(category);
    queryString = `&q=${searchQuery}`;
    getNews(category, queryString); // Загрузка новостей для выбранной категории
  };

  // Функция для загрузки обычных новостей
  const getNews = async (category: string = "", searchQuery: string = "") => {
    try {
      let categoryString = ""; // Строка параметра категории для URL

      // Если категория указана, добавляем её в параметры запроса
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }

      // Создание URL для запроса с учетом категории EXPO_PUBLIC_API_KEY
      // const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=10${categoryString}`;
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=10${categoryString}${queryString}`;

      https: console.log("URL = ", URL); // Логирование ошибок

      const response = await axios.get(URL);

      // console.log("response.data: ", response.data);

      // Проверка на наличие данных в ответе
      if (response && response.data) {
        setNews(response.data.results); // Сохранение новостей в состояние
        setIsLoading(false); // Отключение индикатора загрузки
      }
    } catch (error: any) {
      console.log("Error message: ", error.message); // Логирование ошибок
    }
  };

  // Рендер компонента
  return (
    // Основной контейнер с учетом безопасной зоны
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {/* Компонент заголовка */}
      {/* <Text>Header</Text> */}
      <Header />
      {/* Компонент поиска (передан пустой обработчик) */}
      {/* <Text>SearchBar</Text> */}
      <SearchBar withHorizontalPadding setSearchQuery={setSearchQuery} />

      {/* Компонент категорий с обработчиком изменения категории */}
      {/* <Text>Catgories</Text> */}
      <Categories onCategoryChanged={onCatChanged} />
      {/* Компонент списка новостей (отображается всегда) */}
      {/* <Text>NewsList</Text> */}
      <NewsList newsList={news} />
    </View>
  );
};

export default Page;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1, // Занимает всё доступное пространство
  },
});
