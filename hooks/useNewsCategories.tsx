// Кастомный хук для управления состоянием категорий новостей
// Предоставляет данные категорий и функцию для переключения их выбранного состояния

import newsCategoryList from "@/constants/Categories"; // Импорт начального списка категорий
import { useCallback, useState } from "react"; // React хуки для состояния и мемоизации

// Определение кастомного хука useNewsCategories
export const useNewsCategories = () => {
  // Состояние для хранения списка категорий новостей
  const [newsCategories, setNewsCategories] = useState(newsCategoryList);
  // Инициализируем состояние импортированным списком категорий
  // Предполагаемая структура newsCategoryList:
  // Array<{ id: number, title: string, slug: string, selected?: boolean }>

  // Отладочный вывод в консоль при каждом рендере компонента, использующего хук
  // ВНИМАНИЕ: Это может привести к множеству лишних логов в продакшене
  console.log("useNewsCategories");

  // Функция для переключения состояния выбранности категории по её ID
  // useCallback мемоизирует функцию для предотвращения лишних ререндеров
  const toggleNewsCategory = useCallback((id: number) => {
    setNewsCategories((prevNewsCategories) => {
      // Используем функциональное обновление состояния для корректной работы
      // с предыдущим состоянием
      return prevNewsCategories.map((item) => {
        // Если нашли категорию с нужным ID
        if (item.id === id) {
          // Возвращаем обновлённый объект категории
          return {
            ...item, // Копируем все существующие свойства
            selected: !item.selected, // Инвертируем значение selected
            // Примечание: предполагается, что у всех категорий есть свойство selected
            // Если selected undefined, то !undefined = true
          };
        }
        // Для остальных категорий возвращаем без изменений
        return item;
      });
    });
  }, []); // Пустой массив зависимостей - функция создается один раз

  // Возвращаем объект с данными и функциями для использования в компонентах
  return {
    newsCategories, // Текущий список категорий
    toggleNewsCategory, // Функция для переключения выбранного состояния
  };
};
