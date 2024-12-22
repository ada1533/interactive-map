import { createAsyncThunk } from '@reduxjs/toolkit';
import { setGeoLocation } from './MapSlice';

export const getName = createAsyncThunk(
  'map/getName',
  async function ({ lat, lng }, { rejectWithValue }) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.display_name || 'Не известное место';
    } catch (error) {
      console.error('Ошибка запроса:', error);

      if (error instanceof TypeError) {
        return rejectWithValue('Ошибка сети: Проверьте подключение к интернету');
      }

      // return rejectWithValue(`Произошла ошибка: ${error.message || 'Неизвестная ошибка'}`);
    }
  }
);

export const getGeoLocation = () => async (dispatch) => {
  if ("geolocation" in navigator) { // проверка доступности геолокации
      navigator.geolocation.getCurrentPosition( // запрос на геолокацию
          async (position) => {
              const { latitude, longitude } = position.coords;
              const geoPosition = [latitude, longitude];
              try {
                  const name = await dispatch(getName({ lat: latitude, lng: longitude })).unwrap();
                  dispatch(setGeoLocation({ position: geoPosition, name }));
              } catch (error) {
                  console.error("Ошибка: ", error);
                  dispatch(setGeoLocation({ position: geoPosition, name: '' })); // Сохраняем пустое имя при ошибке
              }
          },
          (error) => {
              console.error("Ошибка в координатах: ", error);
              dispatch(setGeoLocation({ position: null, name: '' })); // При ошибке координаты отсутствуют
          }
      );
  } else {
      console.warn("Браузер не поддерживает геолокацию.");
      dispatch(setGeoLocation({ position: null, name: '' })); // Если геолокация не поддерживается
  }
};