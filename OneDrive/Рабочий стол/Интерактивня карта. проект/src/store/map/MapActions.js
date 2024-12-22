import { createAsyncThunk } from '@reduxjs/toolkit';
import { setGeoLocation } from './MapSlice';

export const getName = createAsyncThunk(
  'map/getName',
  async function ({ lat, lng }, { rejectWithValue }) {
    try {
      // запрос на сервер
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      // проблема в сервере
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }
      // успешно
      const data = await response.json();
      return data.display_name || 'Не известное место';
    } catch (error) {
      // не успешно
      console.error('ошибка запроса:', error);

      // интернет
      if (error instanceof TypeError) {
        return rejectWithValue('ошибка сети: Проверьте интернет');
      }
    }
  }
);

export const getGeoLocation = () => async (dispatch) => {
  if ("geolocation" in navigator) { // проверка доступности геолокации
      navigator.geolocation.getCurrentPosition( // запрос на геолокацию
          async (position) => {
              const { latitude, longitude } = position.coords; // деструкторизация
              const geoPosition = [latitude, longitude];
              try {
                  const name = await dispatch(getName({ lat: latitude, lng: longitude })).unwrap();
                  dispatch(setGeoLocation({ position: geoPosition, name }));
              } catch (error) {
                  console.error("ошибка: ", error);
                  dispatch(setGeoLocation({ position: geoPosition, name: '' })); // сохраняем пустое имя при ошибке
              }
          },
          (error) => {
              console.error("ошибка в координатах: ", error);
              dispatch(setGeoLocation({ position: null, name: '' })); // При ошибке координаты отсутствуют
          }
      );
  } else {
      console.warn("браузер не поддерживает геолокацию.");
      dispatch(setGeoLocation({ position: null, name: '' })); // Если геолокация не поддерживается
  }
};