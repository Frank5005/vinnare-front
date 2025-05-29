let interceptorFn: any = null;

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      defaults: { baseURL: 'https://5586-3-147-45-32.ngrok-free.app', withCredentials: true },
      interceptors: {
        request: {
          use: jest.fn((fn) => { interceptorFn = fn; })
        }
      }
    }))
  };
});

import api from './api';

describe('api instance', () => {
  beforeEach(() => {
    localStorage.clear();
    interceptorFn = null;
    jest.resetModules();
    require('./api');
  });

  it('should have the correct baseURL and withCredentials', () => {
    expect(api.defaults.baseURL).toBe('https://5586-3-147-45-32.ngrok-free.app');
    expect(api.defaults.withCredentials).toBe(true);
  });

  it('should add Authorization header if token exists', async () => {
    localStorage.setItem('token', 'test-token');
    const config: any = { headers: {} };
    const newConfig = await interceptorFn(config);
    expect(newConfig.headers.Authorization).toBe('Bearer test-token');
  });

  it('should not add Authorization header if token does not exist', async () => {
    const config: any = { headers: {} };
    const newConfig = await interceptorFn(config);
    expect(newConfig.headers.Authorization).toBeUndefined();
  });

  it('should always add ngrok-skip-browser-warning header', async () => {
    const config: any = { headers: {} };
    const newConfig = await interceptorFn(config);
    expect(newConfig.headers['ngrok-skip-browser-warning']).toBe('true');
  });
});