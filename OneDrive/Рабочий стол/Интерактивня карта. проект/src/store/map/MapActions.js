import { createAsyncThunk } from '@reduxjs/toolkit';
import { setGeoLocation } from './MapSlice';

export const getName = createAsyncThunk(
  'map/getName',
  async function ({ lat, lng }) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    if (!response.ok) {
      throw new Error(`ошибка сервера: ${response.status}`);
    }
    const data = await response.json();
    return data.display_name || 'Не известное место';
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
              } catch {
                  dispatch(setGeoLocation({ position: geoPosition, name: '' })); // сохраняем пустое имя при ошибке
              }
          },
          () => {
              dispatch(setGeoLocation({ position: null, name: '' })); // При ошибке координаты отсутствуют
          }
      );
  } else {
      dispatch(setGeoLocation({ position: null, name: '' })); // Если геолокация не поддерживается
  }
};

