/**
 * ПРОВАЙДЕР ОБНАРУЖЕНИЯ НЕАКТИВНОСТИ ПОЛЬЗОВАТЕЛЯ
 *
 * Основное назначение:
 * Мониторинг активности пользователя и состояния приложения для:
 * 1. Автоматической блокировки приложения при неактивности
 * 2. Обработки переходов между состояниями приложения (active, background, inactive)
 * 3. Защиты конфиденциальных данных при фоновой работе приложения
 *
 * Особенности реализации:
 * - Отслеживание изменений состояния приложения (AppState)
 * - Запись времени ухода в фон для определения длительности неактивности
 * - Интеграция с системой аутентификации и навигацией
 * - Использование AsyncStorage для сохранения временных меток
 */

import { useAuthStore } from "@/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * КОНСТАНТЫ КОНФИГУРАЦИИ
 */
const STORAGE_KEY = "UserInactivity_startTime"; // Ключ для хранения времени ухода в фон
const LOCK_TIME = 3000; // Время в миллисекундах до блокировки (3 секунды для демо)

/**
 * Тип пропсов для компонента провайдера
 */
interface UserInactivityProviderProps {
  children: React.ReactNode;
}

/**
 * Провайдер неактивности пользователя
 *
 * Компонент высшего порядка (HOC), который оборачивает дочерние компоненты
 * и добавляет функционал отслеживания неактивности пользователя.
 *
 * @param children - Дочерние компоненты приложения
 * @returns JSX элемент с провайдером неактивности
 */
export const UserInactivityProvider: React.FC<UserInactivityProviderProps> = ({
  children,
}) => {
  /**
   * REF ДЛЯ ХРАНЕНИЯ ТЕКУЩЕГО СОСТОЯНИЯ ПРИЛОЖЕНИЯ
   *
   * Используется useRef для сохранения значения между рендерами
   * без триггера повторных рендеров при изменении.
   */
  const appState = useRef(AppState.currentState);

  /**
   * ЭФФЕКТ ДЛЯ ПОДПИСКИ НА ИЗМЕНЕНИЯ СОСТОЯНИЯ ПРИЛОЖЕНИЯ
   *
   * Выполняется один раз при монтировании компонента:
   * 1. Подписывается на изменения AppState
   * 2. Возвращает функцию очистки для отписки при размонтировании
   */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove(); // Очистка подписки при размонтировании
    };
  }, []);

  /**
   * ОБРАБОТЧИК ИЗМЕНЕНИЯ СОСТОЯНИЯ ПРИЛОЖЕНИЯ
   *
   * Обрабатывает переходы между состояниями приложения:
   * - active: приложение работает на переднем плане
   * - inactive: приложение на переднем плане, но неактивно (например, уведомление)
   * - background: приложение в фоновом режиме
   *
   * @param nextAppState - Новое состояние приложения
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // Получение текущего состояния аутентификации из хранилища
    const isAuthenticating = useAuthStore.getState().isAuthenticating;

    // console.log("appState--->", appState.current, nextAppState);
    // console.log("isAuthenticating in appState", isAuthenticating);

    /**
     * ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ОВЕРЛЕЙ/ЭКРАН БЛОКИРОВКИ
     *
     * Если пользователь не находится в процессе аутентификации:
     * 1. При переходе в inactive - показываем оверлей
     * 2. При возврате из inactive - скрываем оверлей (если он открыт)
     */
    if (!isAuthenticating) {
      if (nextAppState === "inactive") {
        // Показываем оверлей при неактивности
        router.push("/(auth)/overlay");
      } else {
        // Возвращаемся назад, если оверлей открыт
        if (router.canGoBack()) {
          // console.log("canGoBack:", appState.current, nextAppState);
          router.back();
        }
      }
    }

    /**
     * ЛОГИКА АВТОМАТИЧЕСКОЙ БЛОКИРОВКИ ПРИ ДОЛГОЙ НЕАКТИВНОСТИ
     *
     * 1. При уходе в background - записываем время
     * 2. При возврате из background - проверяем время неактивности
     * 3. Если время превышает LOCK_TIME - показываем экран блокировки
     */
    if (nextAppState === "background") {
      // Запись времени ухода в фон
      await recordStartTime();
    } else if (appState.current === "background" && nextAppState === "active") {
      // Проверка времени неактивности при возврате
      const startTime = await getStartTime();
      if (startTime && Date.now() - startTime > LOCK_TIME) {
        // Показ экрана блокировки при долгой неактивности
        router.push("/(auth)/lock");
      }
    }

    // Обновление текущего состояния приложения
    appState.current = nextAppState;
  };

  /**
   * ЗАПИСЬ ВРЕМЕНИ УХОДА В ФОНОВЫЙ РЕЖИМ
   *
   * Сохраняет текущую временную метку в AsyncStorage
   * для последующей проверки длительности неактивности.
   */
  const recordStartTime = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch (error) {
      // console.error("Error saving start time:", error);
    }
  };

  /**
   * ПОЛУЧЕНИЕ ВРЕМЕНИ УХОДА В ФОН
   *
   * Извлекает сохраненную временную метку из AsyncStorage.
   *
   * @returns Числовое значение временной метки или null, если значение отсутствует
   */
  const getStartTime = async (): Promise<number | null> => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      return value ? parseInt(value, 10) : null;
    } catch (error) {
      // console.error("Error reading start time:", error);
      return null;
    }
  };

  /**
   * РЕНДЕРИНГ ДОЧЕРНИХ КОМПОНЕНТОВ
   *
   * Провайдер не добавляет дополнительной разметки,
   * только оборачивает дочерние компоненты.
   */
  return <>{children}</>;
};

/**
 * КОНТЕКСТ ИСПОЛЬЗОВАНИЯ:
 *
 * 1. Оборачивание приложения в корневом компоненте:
 *    <UserInactivityProvider>
 *      <RootComponent />
 *    </UserInactivityProvider>
 *
 * 2. Интеграция с другими системами:
 *    - Навигация (Expo Router)
 *    - Глобальное состояние (Zustand)
 *    - Локальное хранилище (AsyncStorage)
 */

/**
 * ЖИЗНЕННЫЙ ЦИКЛ СОБЫТИЙ:
 *
 * 1. Пользователь сворачивает приложение (active → background):
 *    - Записывается время ухода
 *
 * 2. Пользователь получает уведомление (active → inactive):
 *    - Показывается оверлей (если не в процессе аутентификации)
 *
 * 3. Пользователь возвращается (background → active):
 *    - Проверяется время неактивности
 *    - Если > LOCK_TIME → экран блокировки
 *
 * 4. Пользователь возвращается (inactive → active):
 *    - Скрывается оверлей (если открыт)
 */

/**
 * РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:
 *
 * 1. Безопасность:
 *    - Использовать SecureStore вместо AsyncStorage для временных меток
 *    - Добавить шифрование сохраненных данных
 *    - Реализовать очистку чувствительных данных при блокировке
 *
 * 2. Производительность:
 *    - Оптимизировать частоту проверок состояния
 *    - Использовать debounce для обработки быстрых изменений состояния
 *    - Кэшировать результаты проверки времени
 *
 * 3. Пользовательский опыт:
 *    - Добавить настройку времени блокировки
 *    - Реализовать предупреждение перед блокировкой
 *    - Добавить возможность отключения функции
 *
 * 4. Тестирование:
 *    - Тестирование разных сценариев переключения состояния
 *    - Проверка работы на разных платформах (iOS/Android)
 *    - Тестирование с разными настройками времени блокировки
 */

/**
 * ТЕХНИЧЕСКИЕ ПРИМЕЧАНИЯ:
 *
 * 1. AppState:
 *    - Кроссплатформенный API для отслеживания состояния приложения
 *    - Поддерживает три основных состояния: active, inactive, background
 *    - Требует правильной обработки подписок и отписок
 *
 * 2. AsyncStorage:
 *    - Асинхронное ключ-значение хранилище
 *    - Сохраняет данные в виде строк
 *    - Ограничения по объему хранимых данных
 *
 * 3. Expo Router:
 *    - Метод router.push для навигации к модальным экранам
 *    - router.canGoBack() проверяет возможность возврата
 *    - router.back() возвращает на предыдущий экран
 *
 * 4. Zustand:
 *    - useAuthStore.getState() получает текущее состояние без подписки
 *    - Не вызывает ререндер при изменении состояния
 *    - Позволяет работать со store вне React компонентов
 */

/**
 * ПРЕДУПРЕЖДЕНИЯ И ОГРАНИЧЕНИЯ:
 *
 * 1. Точность времени:
 *    - Время может расходиться на разных устройствах
 *    - Рекомендуется использовать серверное время для критичных операций
 *
 * 2. Батарея:
 *    - Частые проверки состояния могут влиять на расход батареи
 *    - Рекомендуется оптимизировать интервалы проверок
 *
 * 3. Платформенные различия:
 *    - Поведение AppState может отличаться на iOS и Android
 *    - Необходимо тестировать на обеих платформах
 */

/**
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ В _LAYOUT.TSX:
 *
 * import { UserInactivityProvider } from "@/components/UserInactivityProvider";
 *
 * export default function RootLayout() {
 *   return (
 *     <UserInactivityProvider>
 *       <Stack screenOptions={{ headerShown: false }}>
 *         <Stack.Screen name="index" />
 *         <Stack.Screen name="(modal)/lock" options={{ presentation: 'modal' }} />
 *         <Stack.Screen name="(modal)/overlay" options={{ presentation: 'transparentModal' }} />
 *       </Stack>
 *     </UserInactivityProvider>
 *   );
 * }
 */
