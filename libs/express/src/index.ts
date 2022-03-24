import App, { Express, Router } from 'express';
export { Router } from 'express';

const apps: Record<string, Express> = {};

export const useExpress = (key = 'default'): Express => {
  if (!apps[key]) {
    apps[key] = App();
  }
  return apps[key];
};

export const registerRouter = (router: Router, key = 'default') => {
  useExpress(key).use(router);
};
