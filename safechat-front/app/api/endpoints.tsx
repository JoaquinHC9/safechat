// src/api/endpoints.ts
import { LoginData } from '../../src/models/LoginData';
import { RegisterData } from '../../src/models/RegisterData';
import instance from './base';


export const safeChatApi = {
  login: function (user: LoginData) {
    return instance.post('auth/login', user, {
      validateStatus: () => true,
    });
  },
  register: function (user: RegisterData) {
    return instance.post('auth/register', user);
  }
};

export default safeChatApi;