import { createAsyncThunk } from '@reduxjs/toolkit';
import { setGeoLocation } from './MapSlice';

export const getName = createAsyncThunk(
  'map/getName', // название среза и название функции
  async function ({ lat, lng }, { rejectWithValue }) {
     // отправляем запрос к API
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );

      // проверяем успешность ответа от сервера
      if (!response.ok) {
        throw new Error(`ошибка сервера: ${response.status} ${response.statusText}`);
      }

      // если запрос успешен, парсим данные
      const data = await response.json();

      // возвращаем название места или строку по умолчанию
      return data.display_name || 'Не известное место';
    } catch (error) {
      console.error('Ошибка запроса:', error);

      // ошибка сети
      if (error instanceof TypeError) {
        return rejectWithValue('ошибка сети: Проверьте интернет');
      }
    }
  }
);

export const getGeoLocation = () => async (dispatch) => {
  if ("geolocation" in navigator) { // проверка доступности геолокации в браузере
      navigator.geolocation.getCurrentPosition( // запрос на геолокацию
          async (position) => {
              const { latitude, longitude } = position.coords; // деструктуризация
              const geoPosition = [latitude, longitude];
              try {
                  // асинхронный запрос данных переданных данных и использование getName
                  const name = await dispatch(getName({ lat: latitude, lng: longitude })).unwrap();
                  dispatch(setGeoLocation({ position: geoPosition, name })); // сохранение в глобальный хранилище
              } catch (error) {
                  console.error("ошибка: ", error);
                  dispatch(setGeoLocation({ position: geoPosition, name: '' })); // сохраняем пустое имя при ошибке
              }
          },
          (error) => {
              console.error("ошибка в координатах: ", error);
              dispatch(setGeoLocation({ position: null, name: '' })); // при ошибке координаты отсутствуют
          }
      );
  } else {
      console.warn("браузер не поддерживает геолокацию.");
      dispatch(setGeoLocation({ position: null, name: '' })); // если геолокация не поддерживается
  }
};