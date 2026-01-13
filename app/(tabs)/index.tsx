// Импорт необходимых компонентов и модулей
import Header from "@/components/Header"; // Пользовательский компонент заголовка
import { NewsDataType } from "@/types"; // Типы TypeScript для данных новостей
import axios from "axios"; // HTTP-клиент для запросов к API
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Для учета безопасных зон экрана

// import BreakingNews from "@/components/BreakingNews"; // Компонент для отображения главных новостей
import Catgories from "@/components/Categories"; // Компонент категорий новостей (опечатка в названии - Categories)
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

  // Хук useEffect для выполнения запросов при монтировании компонента
  useEffect(() => {
    getBreakingNews(); // Загрузка главных новостей
    getNews(); // Загрузка обычных новостей
  }, []); // Пустой массив зависимостей - выполняется один раз при монтировании

  // Функция для загрузки главных новостей
  const getBreakingNews = async () => {
    try {
      // Комментарий: Expo Web не заменяет переменные process.env
      // const URL = "https://newsdata.io/api/1/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}";

      // URL для API новостей с жестко заданным API ключом (небезопасно!)
      const URL =
        "https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=5";
      // size=5 - ограничение на 5 записей для главных новостей

      const response = await axios.get(URL);

      // Проверка на наличие данных в ответе
      if (response && response.data) {
        setBreakingNews(response.data.results); // Сохранение главных новостей в состояние
      }
    } catch (error: any) {
      console.log("Error message: ", error.message); // Логирование ошибок
    }
  };

  // Обработчик изменения категории
  const onCatChanged = (category: string) => {
    console.log("Category: ", category); // Логирование выбранной категории
    setNews([]); // Очистка текущих новостей перед загрузкой новых
    getNews(category); // Загрузка новостей для выбранной категории
  };

  // Функция для загрузки обычных новостей
  const getNews = async (category: string = "") => {
    try {
      let categoryString = ""; // Строка параметра категории для URL

      // Если категория указана, добавляем её в параметры запроса
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }

      // Создание URL для запроса с учетом категории
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=10${categoryString}`;
      // size=10 - ограничение на 10 записей для обычных новостей

      const response = await axios.get(URL);

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
      <SearchBar withHorizontalPadding={true} setSearchQuery={() => {}} />
      {/* Условный рендеринг: показываем индикатор загрузки или главные новости */}
      {/* {isLoading ? (
        <Loading size={"large"} /> // Компонент загрузки
      ) : (
        // <Text>BreakingNews</Text>
        <BreakingNews newsList={breakingNews} /> // Компонент главных новостей
      )} */}
      {/* Компонент категорий с обработчиком изменения категории */}
      {/* <Text>Catgories</Text> */}
      <Catgories onCategoryChanged={onCatChanged} />
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
