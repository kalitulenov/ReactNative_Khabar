// Импорт необходимых компонентов и библиотек
import Loading from "@/components/Loading"; // Компонент индикатора загрузки
import { Colors } from "@/constants/Colors"; // Цветовая палитра приложения
import { NewsDataType } from "@/types"; // Тип данных новости
import { Ionicons } from "@expo/vector-icons"; // Иконки для интерфейса
import AsyncStorage from "@react-native-async-storage/async-storage"; // Локальное хранилище для закладок
import axios from "axios"; // HTTP-клиент для API запросов
import { router, Stack, useLocalSearchParams } from "expo-router"; // Навигационные утилиты Expo
import Moment from "moment"; // Библиотека для форматирования дат
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Props = {};

// Компонент детального отображения новости
const NewsDetails = (props: Props) => {
  // Получение ID новости из параметров URL (например, /news/123)
  const { id } = useLocalSearchParams<{ id: string }>();

  // Состояние для хранения данных новости (массив, хотя ожидается одна новость)
  const [news, setNews] = useState<NewsDataType[]>([]);

  // Состояние для управления отображением индикатора загрузки
  const [isLoading, setIsLoading] = useState(true);

  // Состояние для отслеживания, добавлена ли новость в закладки
  const [bookmark, setBookmark] = useState(false);

  // Эффект для загрузки данных новости при монтировании компонента
  useEffect(() => {
    getNews();
  }, []); // Пустой массив зависимостей - выполняется один раз

  // Эффект для проверки статуса закладки после загрузки новости
  useEffect(() => {
    if (!isLoading) renderBookmark(news[0].article_id);
  }, [isLoading]); // Зависит от isLoading - выполняется когда данные загружены

  // Функция загрузки данных новости по ID
  const getNews = async () => {
    try {
      // Комментарий: Expo Web не заменяет переменные окружения process.env
      // const URL = "https://newsdata.io/api/1/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}";

      // URL с жестко заданным API ключом (небезопасно для production)
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&id=${id}`;

      const response = await axios.get(URL);

      // Проверка успешного ответа от сервера
      if (response && response.data) {
        setNews(response.data.results); // Сохранение новости в состояние
        setIsLoading(false); // Выключение индикатора загрузки
      }
    } catch (error: any) {
      console.log("Ошибка: ", error.message); // Логирование ошибок
    }
  };

  // Функция добавления новости в закладки
  const saveBookmark = async (newsId: string) => {
    setBookmark(true); // Визуальное обновление состояния закладки
    await AsyncStorage.getItem("bookmark").then((token) => {
      // Безопасный парсинг JSON (рекомендация ChatGPT)
      const res = token ? JSON.parse(token) : [];

      if (res !== null) {
        // Проверяем, есть ли уже эта новость в закладках
        let data = res.find((value: string) => value === newsId);

        if (data == null) {
          // Если новости нет в закладках, добавляем её
          res.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(res));
          // alert("Новость сохранен!"); // Уведомление пользователя
          Toast.show({
            type: "success",
            text1: "Новость сохранена",
            text2: "Вы можете посмотреть её в закладках",
          });
        } else {
          // Этот блок кода, вероятно, содержит ошибку логики:
          // Если новость уже есть в закладках, создаем новый массив только с этой новостью
          // Возможно, должно быть: "News already saved" вместо создания нового массива
          let bookmark = [];
          bookmark.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
          // alert("Новость сохранен!!");
          Toast.show({
            type: "success",
            text1: "Новость сохранена",
            text2: "Вы можете посмотреть её в закладках",
          });
        }
      }
    });
  };

  // Функция удаления новости из закладок
  const removeBookmark = async (newsId: string) => {
    setBookmark(false); // Визуальное обновление состояния закладки
    const bookmark = await AsyncStorage.getItem("bookmark").then((token) => {
      // Безопасный парсинг JSON (рекомендация ChatGPT)
      const res = token ? JSON.parse(token) : [];
      // Фильтруем массив, удаляя ID текущей новости
      return res.filter((id: string) => id !== newsId);
    });
    // Сохраняем обновленный массив закладок
    await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
    // alert("Новость отменен!"); // Уведомление пользователя
    Toast.show({
      type: "success",
      text1: "Новость отменен!",
      text2: "Вы можете посмотреть её в закладках",
    });
  };

  // Функция проверки, добавлена ли текущая новость в закладки
  const renderBookmark = async (newsId: string) => {
    await AsyncStorage.getItem("bookmark").then((token) => {
      // Безопасный парсинг JSON (рекомендация ChatGPT)
      const res = token ? JSON.parse(token) : [];

      if (res !== null) {
        // Ищем ID новости в массиве закладок
        let data = res.find((value: string) => value === newsId);
        // Устанавливаем состояние bookmark в зависимости от наличия новости в закладках
        return data == null ? setBookmark(false) : setBookmark(true);
      }
    });
  };

  // Рендер компонента
  return (
    <>
      {/* Конфигурация заголовка навигационного стека */}
      <Stack.Screen
        options={{
          // Кастомная кнопка "Назад" слева
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          // Кастомная кнопка закладки справа
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                // Переключатель: если новость в закладках - удаляем, если нет - добавляем
                bookmark
                  ? removeBookmark(news[0].article_id)
                  : saveBookmark(news[0].article_id);
              }}
            >
              <Ionicons
                name={bookmark ? "heart" : "heart-outline"} // Иконка: заполненное или пустое сердце
                size={22}
                color={bookmark ? "red" : Colors.black} // Цвет: красный для активной закладки
              />
            </TouchableOpacity>
          ),
          title: "", // Пустой заголовок (скрыт)
        }}
      />
      {/* Условный рендеринг: индикатор загрузки или контент новости */}
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        // ScrollView для прокрутки длинного контента
        <ScrollView
          contentContainerStyle={styles.contentContainer} // Стиль для контейнера контента
          style={styles.container} // Стиль для самого ScrollView
        >
          {/* Заголовок новости */}
          <Text style={styles.title}>{news[0].title}</Text>

          {/* Контейнер для мета-информации о новости */}
          <View style={styles.newsInfoWrapper}>
            {/* Отформатированная дата публикации */}
            <Text style={styles.newsInfo}>
              {Moment(news[0].pubDate).format("MMMM DD, hh:mm a")}
            </Text>
            {/* Название источника новости */}
            <Text style={styles.newsInfo}>{news[0].source_name}</Text>
          </View>

          {/* Изображение новости */}
          <Image source={{ uri: news[0].image_url }} style={styles.newsImg} />

          {/* Основной текст новости: показываем content или description если content пустой */}
          {news[0].content ? (
            <Text style={styles.newsContent}>{news[0].content}</Text>
          ) : (
            <Text style={styles.newsContent}>{news[0].description}</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetails;

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white, // Белый фон
  },
  contentContainer: {
    paddingHorizontal: 20, // Горизонтальные отступы
    paddingBottom: 30, // Нижний отступ
  },
  newsImg: {
    width: "100%", // Полная ширина
    height: 300, // Фиксированная высота
    marginBottom: 30, // Отступ снизу
    borderRadius: 10, // Закругленные углы
  },
  newsInfoWrapper: {
    flexDirection: "row", // Горизонтальное расположение элементов
    justifyContent: "space-between", // Равномерное распределение
    marginBottom: 30, // Отступ снизу
  },
  newsInfo: {
    fontSize: 17,
    color: Colors.darkGrey, // Темно-серый цвет
  },
  title: {
    fontSize: 16,
    fontWeight: "600", // Полужирный шрифт
    color: Colors.black,
    marginVertical: 10, // Вертикальные отступы
    letterSpacing: 0.6, // Межбуквенное расстояние
  },
  newsContent: {
    fontSize: 14,
    fontWeight: "600", // Полужирный шрифт
    color: "#555", // Темно-серый цвет
    letterSpacing: 0.8, // Межбуквенное расстояние
    lineHeight: 22, // Межстрочный интервал
  },
});
