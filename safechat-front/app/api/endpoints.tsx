// src/api/endpoints.ts
import { LoginData } from '../models/LoginData';
import { RegisterData } from '../models/RegisterData';
import instance from './base';


export const safeChatApi = {
  login: function (user: LoginData) {
    return instance.post('auth/login', user, {
      validateStatus: () => true,
    });
  },
  register: function (user: RegisterData) {
    return instance.post('auth/register', user);
  },
};
