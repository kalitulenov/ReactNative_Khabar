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
    // console.log("useEffect =Category: ", category); // Логирование выбранной категории
    // console.log("useEffect =searchQuery: ", searchQuery); // Логирование выбранной категории

    getNews(category, queryString);
  }, [searchQuery]);

  // Обработчик изменения категории
  const onCatChanged = (category: string) => {
    // console.log("onCatChanged =Category: ", category); // Логирование выбранной категории
    // console.log("onCatChanged =searchQuery: ", searchQuery); // Логирование выбранной категории
    setNews([]); // Очистка текущих новостей перед загрузкой новых
    setCategory(category);
    queryString = `&q=${searchQuery}`;
    getNews(category, queryString); // Загрузка новостей для выбранной категории
  };

  // Функция для загрузки обычных новостей
  const getNews = async (category: string = "", queryString: string = "") => {
    try {
      let categoryString = ""; // Строка параметра категории для URL

      if (category.length !== 0) {
        // Если категория указана, добавляем её в параметры запроса
        categoryString = `&category=${category}`;
      }

      if (queryString.length < 4) {
        // Если категория указана, добавляем её в параметры запроса
        queryString = "";
      }
      console.log("queryString = ", queryString); // Логирование ошибок

      // Создание URL для запроса с учетом категории ${process.env.EXPO_PUBLIC_API_KEY}
      const URL = `https://newsdata.io/api/1/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}&size=10${categoryString}${queryString}`;
      console.log("URL = ", URL); // Логирование ошибок

      // const response = await axios.get(URL, {
      //   validateStatus: (status) => status === 200 || status === 422,
      // });
      const response = await axios.get(URL);

      // const response = await axios.get(`https://newsdata.io/api/1/latest`, {
      //   params: {
      //     apikey: process.env.EXPO_PUBLIC_API_KEY,
      //     id: categoryString,
      //     queryString,
      //   },
      //   // ✅ говорим axios: 422 — это НЕ ошибка
      //   validateStatus: (status) => status === 200 || status === 422,
      // });

      console.log("response.data: ", response.data);
      console.log("response.status1 = ", response.status); // Логирование ошибок

      // ✅ СЕРВЕР НИЧЕГО НЕ НАШЁЛ
      if (response.status === 422) {
        console.log("Ошибка: СЕРВЕР НИЧЕГО НЕ НАШЁЛ"); // Логирование ошибок
        return;
      }
      console.log("response.data.results = ", response.data.results); // Логирование ошибок

      setNews(response.data.results ?? []);
      console.log("News = ", news); // Логирование ошибок

      // Проверка на наличие данных в ответе
      if (news.length === 0) {
        return;
      }

      if (response && response.data) {
        setNews(response.data.results); // Сохранение новостей в состояние
        setIsLoading(false); // Отключение индикатора загрузки
      } else {
        return;
      }
    } catch (error: any) {
      console.log("Ошибка: ", error.message); // Логирование ошибок
      setNews([]);
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
