/**
 * КОРНЕВОЙ ЛЕЙАУТ ПРИЛОЖЕНИЯ (ROOT LAYOUT)
 *
 * Основное назначение:
 * Определяет основную структуру навигации и оборачивает приложение
 * в необходимые провайдеры глобального состояния.
 *
 * Расположение файла:
 * app/_layout.tsx - корневой layout в структуре Expo Router
 *
 * Особенности:
 * - Определение стека навигации
 * - Интеграция провайдера неактивности пользователя
 * - Настройка модальных экранов
 * - Конфигурация анимаций переходов
 */

import { UserInactivityProvider } from "@/context/UserInactivity";
import { Stack } from "expo-router";
import React from "react";

/**
 * Корневой лейаут приложения
 *
 * Этот компонент является точкой входа для настройки структуры приложения.
 * Он определяет глобальные провайдеры и конфигурацию навигации.
 *
 * @returns JSX элемент с оберткой провайдера и стеком навигации
 */
export default function RootLayout() {
  return (
    /**
     * ОБЕРТКА В ПРОВАЙДЕР НЕАКТИВНОСТИ ПОЛЬЗОВАТЕЛЬА
     *
     * UserInactivityProvider:
     * - Отслеживает состояние приложения (active, background, inactive)
     * - Автоматически показывает экран блокировки при неактивности
     * - Управляет показом оверлея при временной неактивности
     * - Интегрируется с системой аутентификации
     *
     * Расположение: Оборачивает весь стек навигации для глобального мониторинга
     */
    <UserInactivityProvider>
      {/**
       * СТЕК НАВИГАЦИИ (NAVIGATION STACK)
       *
       * Stack:
       * - Базовая навигационная структура Expo Router
       * - Поддерживает вложенные маршруты и модальные экраны
       * - Обеспечивает переходы между экранами с анимацией
       *
       * Примечание: Без явных screenOptions применяются настройки по умолчанию
       */}
      <Stack>
        {/**
         * МОДАЛЬНЫЙ ЭКРАН БЛОКИРОВКИ
         *
         * Stack.Screen name="(auth)/lock":
         * - Экран ввода PIN-кода и биометрической аутентификации
         * - Расположен в папке app/(modal)/lock.tsx
         * - Открывается как модальное окно поверх других экранов
         *
         * Опции:
         * - headerShown: false - скрывает стандартный заголовок навигации
         *   (экран блокировки должен быть полноэкранным без элементов навигации)
         *
         * Использование:
         * - Автоматически открывается провайдером неактивности
         * - Отображается после долгого отсутствия активности
         * - Требует аутентификации для возврата к основному экрану
         */}
        <Stack.Screen
          name="(auth)/lock"
          options={{
            headerShown: false, // Полноэкранный режим без заголовка
          }}
        />

        {/**
         * ГЛАВНЫЙ ЭКРАН ПРИЛОЖЕНИЯ
         *
         * Stack.Screen name="index":
         * - Основной экран приложения (Home Screen)
         * - Соответствует файлу app/index.tsx
         * - Отображается после успешной аутентификации
         * - Использует настройки навигации по умолчанию
         */}
        <Stack.Screen name="index" />

        {/**
         * МОДАЛЬНЫЙ ОВЕРЛЕЙ ЗАГРУЗКИ
         *
         * Stack.Screen name="(modal)/overlay":
         * - Полупрозрачный экран с индикатором загрузки
         * - Расположен в папке app/(modal)/overlay.tsx
         * - Используется для временной блокировки интерфейса
         *
         * Опции:
         * - headerShown: false - скрывает заголовок
         * - animation: "fade" - плавное появление/исчезновение
         * - animationDuration: 500 - длительность анимации в миллисекундах
         *
         * Особенности анимации:
         * - fade: плавное изменение прозрачности
         * - 500ms: оптимальная длительность для восприятия пользователем
         *
         * Использование:
         * - Показывается при кратковременной неактивности
         * - Скрывается при возврате активности
         * - Не блокирует приложение полностью (в отличие от lock экрана)
         */}
        <Stack.Screen
          name="(auth)/overlay"
          options={{
            headerShown: false, // Без заголовка
            animation: "fade", // Анимация появления
            animationDuration: 500, // Плавный переход
          }}
        />
      </Stack>
    </UserInactivityProvider>
  );
}

/**
 * СТРУКТУРА ФАЙЛОВ ПРИЛОЖЕНИЯ:
 *
 * app/
 * ├── _layout.tsx          # Этот файл - корневой layout
 * ├── index.tsx            # Главный экран приложения
 * └── (auth)/             # Группа модальных экранов
 *     ├── lock.tsx         # Экран блокировки с PIN-кодом
 *     └── overlay.tsx      # Оверлей загрузки
 *
 * context/
 * └── UserInactivity.tsx   # Провайдер неактивности пользователя
 *
 * store/
 * └── authStore.ts         # Хранилище состояния аутентификации
 */

/**
 * КОНТЕКСТ ИСПОЛЬЗОВАНИЯ:
 *
 * 1. Сценарий блокировки при неактивности:
 *    Пользователь уходит из приложения (background) → Возвращается через 3+ секунды →
 *    UserInactivityProvider → Показывает lock экран → Аутентификация → Главный экран
 *
 * 2. Сценарий временной неактивности:
 *    Пользователь получает уведомление (inactive) →
 *    UserInactivityProvider → Показывает overlay →
 *    Возвращается в приложение (active) → Скрывает overlay
 *
 * 3. Сценарий аутентификации:
 *    Биометрическая аутентификация → isAuthenticating: true →
 *    Предотвращение показа overlay → Завершение аутентификации → Главный экран
 */

/**
 * РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:
 *
 * 1. Добавить глобальные провайдеры:
 *    <UserInactivityProvider>
 *      <ThemeProvider>           // Управление темой (светлая/темная)
 *        <NotificationProvider>  // Управление уведомлениями
 *          <Stack>...</Stack>
 *        </NotificationProvider>
 *      </ThemeProvider>
 *    </UserInactivityProvider>
 *
 * 2. Добавить глобальные стили навигации:
 *    <Stack
 *      screenOptions={{
 *        headerStyle: { backgroundColor: '#3D38ED' },
 *        headerTintColor: '#fff',
 *        headerTitleStyle: { fontWeight: 'bold' },
 *        contentStyle: { backgroundColor: '#f5f5f5' },
 *      }}
 *    >
 *
 * 3. Добавить обработку глубоких ссылок:
 *    import { Linking } from 'react-native';
 *    useEffect(() => {
 *      const handleDeepLink = (url) => { /* обработка ссылки *\/ };
 *      Linking.addEventListener('url', handleDeepLink);
 *      return () => Linking.removeEventListener('url', handleDeepLink);
 *    }, []);
 *
 * 4. Добавить обработку ошибок границ:
 *    import ErrorBoundary from '@/components/ErrorBoundary';
 *    <ErrorBoundary>
 *      <UserInactivityProvider>...</UserInactivityProvider>
 *    </ErrorBoundary>
 */

/**
 * ТЕХНИЧЕСКИЕ ПРИМЕЧАНИЯ:
 *
 * 1. Expo Router:
 *    - File-based routing (маршрутизация на основе файловой структуры)
 *    - (modal)/ - специальная папка для модальных экранов
 *    - Динамические сегменты: [id].tsx, [...slug].tsx
 *    - Вложенные layouts для организации сложной навигации
 *
 * 2. Навигационные опции:
 *    - presentation: 'modal' | 'transparentModal' | 'formSheet' | 'card'
 *    - animation: 'default' | 'fade' | 'slide_from_bottom' | 'slide_from_right'
 *    - gestureEnabled: true/false для свайпа назад
 *    - contentStyle: стилизация содержимого экрана
 *
 * 3. Производительность:
 *    - Модальные экраны рендерятся только при необходимости
 *    - Анимации оптимизированы для плавности
 *    - Lazy loading для тяжелых экранов
 */

/**
 * БЕЗОПАСНОСТЬ И ДОСТУПНОСТЬ:
 *
 * 1. Защита экранов:
 *    - Главный экран должен быть защищен аутентификацией
 *    - Автоматический redirect на lock экран при истечении сессии
 *    - Очистка чувствительных данных при блокировке
 *
 * 2. Доступность:
 *    - Добавить accessibilityLabel для навигационных элементов
 *    - Поддержка увеличения шрифта системы
 *    - Контрастные цвета для слабовидящих
 *
 * 3. Оффлайн работа:
 *    - Кэширование критичных данных
 *    - Очередь запросов для отправки при восстановлении соединения
 *    - Локальное хранение состояния приложения
 */

/**
 * ТЕСТИРОВАНИЕ:
 *
 * 1. Навигационные тесты:
 *    - Проверка корректности открытия экранов
 *    - Тестирование переходов между состояниями
 *    - Проверка работы модальных окон
 *
 * 2. Интеграционные тесты:
 *    - Взаимодействие UserInactivityProvider с навигацией
 *    - Проверка анимаций и длительностей
 *    - Тестирование разных сценариев неактивности
 *
 * 3. Производительность:
 *    - Время загрузки layout
 *    - Потребление памяти
 *    - Плавность анимаций на разных устройствах
 */

/**
 * ПРИМЕР РАСШИРЕННОЙ ВЕРСИИ:
 *
 * import { UserInactivityProvider } from "@/context/UserInactivity";
 * import { ThemeProvider } from "@/context/ThemeContext";
 * import { AuthProvider } from "@/context/AuthContext";
 * import { Stack } from "expo-router";
 * import { GestureHandlerRootView } from "react-native-gesture-handler";
 * import { SafeAreaProvider } from "react-native-safe-area-context";
 *
 * export default function RootLayout() {
 *   return (
 *     <GestureHandlerRootView style={{ flex: 1 }}>
 *       <SafeAreaProvider>
 *         <ThemeProvider>
 *           <AuthProvider>
 *             <UserInactivityProvider>
 *               <Stack
 *                 screenOptions={{
 *                   headerShown: false,
 *                   contentStyle: { backgroundColor: '#FFFFFF' },
 *                   animation: 'slide_from_right',
 *                 }}
 *               >
 *                 <Stack.Screen name="index" />
 *                 <Stack.Screen
 *                   name="(modal)/lock"
 *                   options={{
 *                     presentation: 'modal',
 *                     gestureEnabled: false,
 *                   }}
 *                 />
 *                 <Stack.Screen
 *                   name="(modal)/overlay"
 *                   options={{
 *                     presentation: 'transparentModal',
 *                     animation: 'fade',
 *                     animationDuration: 300,
 *                   }}
 *                 />
 *                 <Stack.Screen name="(auth)/login" />
 *                 <Stack.Screen name="(tabs)" />
 *                 <Stack.Screen name="settings" />
 *               </Stack>
 *             </UserInactivityProvider>
 *           </AuthProvider>
 *         </ThemeProvider>
 *       </SafeAreaProvider>
 *     </GestureHandlerRootView>
 *   );
 * }
 */
