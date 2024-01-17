import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const TtnService = axios.create({
  baseURL: process.env.TTN_HOST,
});

// JWT interceptor
TtnService.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${process.env.TTN_TOKEN}`;

  return config;
});

// Response interceptor
TtnService.interceptors.response.use(
  (response) => response,
  function (error) {
    // Se ocorrer um erro ao buscar o status do gateway, retorna nulo
    if (
      error?.config?.url.includes('gs/gateways/') &&
      error?.config?.url.includes('/connection/stats')
    ) {
      return error.response;
    }
    return Promise.reject(error);
  },
);
