// Импорт необходимых модулей
import { UserInactivityProvider } from "@/context/UserInactivity";
import { useFonts } from "expo-font"; // Хук для загрузки пользовательских шрифтов
import { Stack } from "expo-router"; // Компонент для навигации в Expo Router
import * as SplashScreen from "expo-splash-screen"; // Модуль для управления экраном загрузки
import { useEffect } from "react"; // React хук для побочных эффектов
import "react-native-reanimated"; // Поддержка анимаций для Reanimated (если используется)

// Предотвращаем автоматическое скрытие splash screen до полной загрузки ресурсов
// Это важно, чтобы пользователь не видел пустой экран во время загрузки
SplashScreen.preventAutoHideAsync();

// Основной компонент RootLayout - корневой макет приложения
export default function RootLayout() {
  // Хук useFonts загружает пользовательские шрифты
  // loaded - булево значение, указывающее на завершение загрузки
  const [loaded] = useFonts({
    // Загрузка кастомного шрифта SpaceMono из файла в проекте
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Можно добавить больше шрифтов:
    // InterBold: require("../assets/fonts/Inter-Bold.ttf"),
    // InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
  });

  // useEffect для управления splash screen
  useEffect(() => {
    // Когда шрифты загружены, скрываем splash screen
    if (loaded) {
      SplashScreen.hideAsync();
    }
    // Зависимость от loaded - эффект выполнится при изменении loaded
  }, [loaded]);

  // Если шрифты ещё не загружены, возвращаем null
  // Это предотвращает рендеринг основного интерфейса до загрузки ресурсов
  if (!loaded) {
    return null;
  }

  // Возвращаем навигационный стек после успешной загрузки шрифтов
  return (
    <UserInactivityProvider>
      // Stack - контейнер для навигации на основе стека
      <Stack>
        {/* 
        Экран с именем "index" - начальный/основной экран приложения
        headerShown: false - скрываем заголовок на этом экране
      */}
        {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="./(tabs)" options={{ headerShown: false }} /> */}

        {/* 
        Экран с именем "(tabs)" - экран с табами (нижней панелью навигации)
        headerShown: false - скрываем заголовок, так как навигация через табы
      */}

        <Stack.Screen
          // Полноэкранный режим без заголовка
          name="(auth)/lock"
          options={{ headerShown: false }}
        />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 
        Примечание: остальные экраны (например, /news/[id]) 
        будут автоматически добавлены в стек при навигации
        без явного объявления здесь
      */}
      </Stack>
    </UserInactivityProvider>
  );
}
