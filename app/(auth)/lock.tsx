/**
 * КОМПОНЕНТ БЛОКИРОВКИ ЭКРАНА С PIN-КОДОМ И БИОМЕТРИЕСКОЙ АУТЕНТИФИКАЦИЕЙ
 *
 * Основное назначение:
 * Экран аутентификации пользователя с двумя методами входа:
 * 1. Ввод 6-значного PIN-кода
 * 2. Биометрическая аутентификация (распознавание лица/отпечаток пальца)
 *
 * Особенности реализации:
 * - Анимация при неверном вводе PIN-кода
 * - Тактильная отдача (Haptic Feedback)
 * - Интеграция с навигацией Expo Router
 * - Управление состоянием аутентификации через Zustand Store
 */

import { useAuthStore } from "@/store/authStore"; // Глобальное состояние аутентификации
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Иконки Material Design
import * as Haptics from "expo-haptics"; // Библиотека для тактильной обратной связи
import * as LocalAuthentication from "expo-local-authentication"; // Биометрическая аутентификация
import { router } from "expo-router"; // Навигация Expo Router
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"; // Анимации
import { SafeAreaView } from "react-native-safe-area-context";

const lock = () => {
  // ==========================================================================
  // СОСТОЯНИЕ КОМПОНЕНТА
  // ==========================================================================

  /**
   * code: массив введенных цифр PIN-кода
   * codeLength: массив из 6 элементов для отображения индикаторов ввода
   */
  const [code, setCode] = useState<number[]>([]);
  const codeLength = Array(6).fill(0); // Создание массива для 6-значного кода

  // Получение функции установки состояния аутентификации из глобального хранилища
  const { setIsAuthenticating } = useAuthStore();

  // ==========================================================================
  // АНИМАЦИИ ДЛЯ ОШИБОЧНОГО ВВОДА
  // ==========================================================================

  /**
   * offset: разделяемое анимируемое значение для горизонтального смещения
   * style: анимированный стиль, применяемый к контейнеру индикаторов кода
   * OFFSET: величина смещения в пикселях
   * TIME: длительность анимации в миллисекундах
   */
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }], // Горизонтальное смещение
    };
  });

  const OFFSET = 20; // Пиксели смещения при ошибке
  const TIME = 80; // Длительность анимации

  // ==========================================================================
  // ЭФФЕКТ ДЛЯ ПРОВЕРКИ ВВЕДЕННОГО КОДА
  // ==========================================================================

  /**
   * useEffect без зависимостей выполняется после каждого рендера
   * Проверяет, когда введены все 6 цифр:
   * 1. Если код равен "123456" (хардкод для демо) - перенаправление на главный экран
   * 2. Если код неверный - запуск анимации ошибки и сброс введенного кода
   */
  useEffect(() => {
    if (code.length === 6) {
      if (code.join("") === "123456") {
        // Сравнение с демо-кодом
        // router.replace("/"); // Успешная навигация на главный экран
        router.back();
        setCode([]); // Очистка кода
      } else {
        // Анимация ошибки: последовательность смещений
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME / 2 }), 4, true), // 4 колебания
          withTiming(OFFSET, { duration: TIME / 2 }),
        );
        // Вибрация ошибки
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode([]); // Сброс введенного кода
      }
    }
  });

  // ==========================================================================
  // ОБРАБОТЧИКИ ВЗАИМОДЕЙСТВИЯ
  // ==========================================================================

  /**
   * onNumberPress: обработчик нажатия на цифровую кнопку
   * param number - нажатая цифра (0-9)
   * Добавляет цифру в массив кода, если длина меньше 6
   */
  const onNumberPress = (number: number) => {
    if (code.length < 6) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Легкая вибрация
      setCode([...code, number]); // Добавление цифры в массив
    }
  };

  /**
   * onBackspacePress: обработчик удаления последней цифры
   * Удаляет последний элемент массива кода
   */
  const onBackspacePress = () => {
    if (code.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Легкая вибрация
      setCode(code.slice(0, -1)); // Удаление последней цифры
    }
  };

  /**
   * onBiometricPress: обработчик биометрической аутентификации
   * Запускает процесс распознавания лица/отпечатка
   * При успехе - перенаправление на главный экран
   * При ошибке - вибрация ошибки
   */
  const onBiometricPress = async () => {
    setIsAuthenticating(true); // Установка состояния аутентификации
    try {
      // Запрос биометрической аутентификации
      const { success } = await LocalAuthentication.authenticateAsync();
      if (success) {
        // router.replace("/"); // Успешная навигация
        router.replace("/(tabs)");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Вибрация ошибки
      }
    } finally {
      // Сброс состояния аутентификации с задержкой
      setTimeout(() => {
        setIsAuthenticating(false);
      }, 4000);
    }
  };

  // ==========================================================================
  // РЕНДЕРИНГ ИНТЕРФЕЙСА
  // ==========================================================================

  return (
    <SafeAreaView>
      {/* Приветствие пользователя */}
      <Text style={styles.greeting}>Welcome back, John</Text>

      {/* Анимированный контейнер индикаторов ввода кода */}
      <Animated.View style={[styles.codeView, style]}>
        {codeLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeEmpty,
              {
                // Заполнение индикатора при вводе цифры
                backgroundColor: code[index] ? "#3D38ED" : "transparent",
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Цифровая клавиатура */}
      <View style={styles.numbersView}>
        {/* Первый ряд: 1, 2, 3 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[1, 2, 3].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Второй ряд: 4, 5, 6 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[4, 5, 6].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Третий ряд: 7, 8, 9 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[7, 8, 9].map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => onNumberPress(number)}
            >
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Четвертый ряд: биометрия, 0, удаление */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Кнопка биометрической аутентификации */}
          <TouchableOpacity onPress={onBiometricPress}>
            <MaterialCommunityIcons
              name="face-recognition" // Иконка распознавания лица
              size={30}
              color="#000"
            />
          </TouchableOpacity>

          {/* Кнопка нуля */}
          <TouchableOpacity onPress={() => onNumberPress(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>

          {/* Кнопка удаления (отображается только при введенных символах) */}
          <View style={{ minWidth: 30 }}>
            {code.length > 0 && (
              <TouchableOpacity onPress={onBackspacePress}>
                <MaterialCommunityIcons
                  name="backspace-outline" // Иконка удаления
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default lock;

// ==========================================================================
// СТИЛИ КОМПОНЕНТА
// ==========================================================================

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    alignSelf: "center",
  },
  codeView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20, // Расстояние между индикаторами
    marginVertical: 30,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10, // Круглая форма
    borderWidth: 1,
    borderColor: "#3D38ED", // Синий цвет границы
  },
  numbersView: {
    marginHorizontal: 80, // Горизонтальные отступы
    gap: 60, // Расстояние между рядами кнопок
  },
  number: {
    fontSize: 32, // Размер цифр
  },
});

// ==========================================================================
// ЗАМЕЧАНИЯ ПО БЕЗОПАСНОСТИ И ПРОИЗВОДИТЕЛЬНОСТИ
// ==========================================================================

/**
 * ВНИМАНИЕ ПО БЕЗОПАСНОСТИ:
 * 1. PIN-код "123456" захардкожен и используется только для демонстрации
 *    В реальном приложении используйте безопасное хранение и проверку
 *    Например: Keychain (iOS), SecureStore (Expo), Encrypted Storage
 *
 * 2. Биометрическая аутентификация использует системные API безопасности
 *    Не храните секретные данные в локальном хранилище без шифрования
 *
 * РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:
 *
 * 1. Безопасность:
 *    - Хранить хэш PIN-кода с использованием bcrypt или аналогичного
 *    - Добавить ограничение попыток ввода
 *    - Использовать SecureStore для хранения токенов
 *
 * 2. Пользовательский опыт:
 *    - Добавить опцию "Забыли код"
 *    - Реализовать блокировку после нескольких неудачных попыток
 *    - Добавить звуковое сопровождение при вводе
 *
 * 3. Производительность:
 *    - Мемоизировать обработчики нажатий с помощью useCallback
 *    - Оптимизировать анимации для старых устройств
 *    - Использовать FlatList для больших списков
 *
 * 4. Доступность:
 *    - Добавить accessibilityLabel для всех TouchableOpacity
 *    - Поддержка VoiceOver и TalkBack
 *    - Контрастные цвета для слабовидящих
 */

/**
 * ТЕХНИЧЕСКИЕ ДЕТАЛИ:
 *
 * 1. Expo Haptics: работает только на реальных устройствах
 *    В симуляторах вибрация не воспроизводится
 *
 * 2. Биометрическая аутентификация:
 *    - iOS: Face ID / Touch ID
 *    - Android: Fingerprint / Face Recognition
 *    - Требует настройки в app.json и разрешений
 *
 * 3. Навигация:
 *    - router.replace("/") заменяет текущий экран в стеке
 *    - Для возврата используйте router.back()
 *
 * 4. Анимации:
 *    - useSharedValue: разделяемое анимируемое значение
 *    - withSequence: последовательность анимаций
 *    - withRepeat: повторение анимации
 *    - withTiming: плавная анимация с длительностью
 */
