// src/api/base.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://localhost:8084/v1/';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar token al header
instance.interceptors.request.use(
  async (request) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error obteniendo token de AsyncStorage:', error);
    }
    return request;
  },
  (error) => Promise.reject(error)
);

export default instance;
