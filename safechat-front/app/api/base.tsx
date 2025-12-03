// src/api/base.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants";
import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;
console.log("API URL:", BASE_URL);

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

// Interceptor para agregar token al header
instance.interceptors.request.use(
  async (request) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded: JwtPayload = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          // Token expirado
          await AsyncStorage.removeItem('token');
          console.warn('Token expirado. Redirigiendo al login...');
          // Opcional: lanzar un error para que la request no se haga
          throw new axios.Cancel('Token expirado');
        }

        request.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error con el token', error);
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
      // Aquí podrías redirigir al login usando Expo Router
      // const router = useRouter();
      // router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default instance;
