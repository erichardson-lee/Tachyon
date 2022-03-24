import App, { Express } from 'express';

const apps: Record<string, Express> = {};

export const useExpress = (key = 'default'): Express => {
  if (!apps[key]) {
    apps[key] = App();
  }
  return apps[key];
};
