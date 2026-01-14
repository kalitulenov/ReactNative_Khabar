// Кастомный хук для управления состоянием стран в фильтрах новостей
// Позволяет выбирать/отменять выбор стран для фильтрации новостей

import CountryList from "@/constants/CountryList"; // Импорт начального списка стран
import { useCallback, useState } from "react"; // React хуки для состояния и мемоизации

// Определение кастомного хука useNewsCountries
export const useNewsCountries = () => {
  // Состояние для хранения списка стран
  const [newsCountries, setNewsCountries] = useState(CountryList);
  // Инициализируем состояние импортированным списком стран
  // Предполагаемая структура CountryList:
  // Array<{ id?: number, code: string, name: string, selected?: boolean }>

  // Отладочный вывод в консоль при каждом рендере компонента, использующего хук
  // ВНИМАНИЕ: Это может привести к множеству лишних логов в продакшене
  // Также неправильное имя - выводит "CountryList" вместо "useNewsCountries"
  console.log("CountryList");

  // Функция для переключения состояния выбранности страны
  // useCallback мемоизирует функцию для предотвращения лишних ререндеров
  const toggleNewsCountry = useCallback((id: number) => {
    setNewsCountries((prevNewsCountries) => {
      // Используем функциональное обновление состояния
      return prevNewsCountries.map((item, index) => {
        // Сравниваем индекс массива с переданным id
        // ВНИМАНИЕ: Ошибка в логике! Используется index вместо item.id
        // Если массив изменится (добавятся/удалятся элементы), логика сломается
        if (index === id) {
          return {
            ...item, // Копируем все существующие свойства
            selected: !item.selected, // Инвертируем значение selected
            // Примечание: предполагается, что у всех стран есть свойство selected
            // Если selected undefined, то !undefined = true
          };
        }
        // Для остальных стран возвращаем без изменений
        return item;
      });
    });
  }, []); // Пустой массив зависимостей - функция создается один раз

  // Возвращаем объект с данными и функциями для использования в компонентах
  return {
    newsCountries, // Текущий список стран
    toggleNewsCountry, // Функция для переключения выбранного состояния
  };
};
