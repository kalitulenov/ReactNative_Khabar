// Импорт необходимых компонентов React Native и библиотек
import Loading from "@/components/Loading"; // Компонент индикатора загрузки
import { NewsItem } from "@/components/NewsList"; // Компонент отображения одной новости
import { NewsDataType } from "@/types"; // Тип данных для новостей
import { Ionicons } from "@expo/vector-icons"; // Иконки для интерфейса
import axios from "axios"; // HTTP-клиент для запросов к API
import { Link, router, Stack, useLocalSearchParams } from "expo-router"; // Навигация и параметры URL
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// Определение типа пропсов (в данном случае пустой)
type Props = {};

// Основной компонент страницы поиска/фильтрации новостей
const Page = (props: Props) => {
  // Получение параметров поиска из URL с использованием useLocalSearchParams
  // Параметры могут быть переданы при навигации на эту страницу
  const { query, category, country } = useLocalSearchParams<{
    query: string; // Поисковый запрос (текст для поиска)
    category: string; // Категория новостей (например: technology, sports)
    country: string; // Страна (например: us, ru, fr)
  }>();

  // Состояние для хранения списка новостей, полученных по запросу
  const [news, setNews] = useState<NewsDataType[]>([]);

  // Состояние для управления индикатором загрузки
  const [isLoading, setIsLoading] = useState(true);

  // Эффект для загрузки новостей при монтировании компонента
  useEffect(() => {
    getNews();
  }, []); // Пустой массив зависимостей - выполняется один раз

  // Основная функция для получения новостей с фильтрацией
  const getNews = async (category: string = "") => {
    try {
      // Инициализация строк параметров для URL
      let categoryString = ""; // Параметр категории
      let countryString = ""; // Параметр страны
      let queryString = ""; // Параметр поискового запроса

      // Формирование параметра категории, если он передан
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }

      // Формирование параметра страны, если он передан
      if (country.length !== 0) {
        countryString = `&country=${country}`;
      }

      // Формирование параметра поискового запроса, если он передан
      if (query.length !== 0) {
        queryString = `&q=${query}`;
      }

      // Формирование полного URL для запроса к API новостей
      // Примечание: API ключ жестко закодирован (небезопасно)
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=10${categoryString}${countryString}${queryString}`;
      // size=10 - ограничение на 10 новостей в ответе

      // Выполнение GET-запроса к API
      const response = await axios.get(URL);

      // Проверка успешного ответа от сервера
      if (response && response.data) {
        setNews(response.data.results); // Сохранение новостей в состояние
        setIsLoading(false); // Выключение индикатора загрузки
      }
    } catch (error: any) {
      // Обработка ошибок при запросе
      console.log("Error message: ", error.message);
    }
  };

  // Рендер компонента
  return (
    <>
      {/* Конфигурация заголовка навигационного стека */}
      <Stack.Screen
        options={{
          // Кастомная кнопка "Назад" в заголовке
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          title: "Search2", // Заголовок страницы (возможно, должно быть более описательное название)
        }}
      />

      {/* Основной контейнер страницы */}
      <View style={styles.container}>
        {/* Условный рендеринг: индикатор загрузки или список новостей */}
        {isLoading ? (
          <Loading size={"large"} /> // Показываем индикатор загрузки
        ) : (
          // FlatList для эффективного отображения списка новостей
          <FlatList
            data={news} // Массив данных для отображения
            keyExtractor={(_, index) => "list_item${index}"} // Генерация уникальных ключей
            // ВНИМАНИЕ: используется кавычки вместо бэктиков - ошибка шаблонной строки
            showsVerticalScrollIndicator={false} // Скрываем вертикальный индикатор прокрутки
            renderItem={({ index, item }) => {
              // Функция рендеринга каждого элемента списка
              return (
                // Link для навигации на детальную страницу новости
                <Link href={`./news/${item.article_id}`} asChild key={index}>
                  {/* TouchableOpacity делает элемент кликабельным */}
                  <TouchableOpacity>
                    {/* Компонент для отображения отдельной новости */}
                    <NewsItem item={item}></NewsItem>
                  </TouchableOpacity>
                </Link>
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
    flex: 1, // Занимает все доступное пространство
    marginHorizontal: 20, // Горизонтальные отступы (левый и правый)
    marginVertical: 20, // Вертикальные отступы (верхний и нижний)
  },
});
