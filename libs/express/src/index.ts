import App, { Express, Router } from 'express';
export { Router } from 'express';

const apps: Record<string, Express> = {};

/**
 * Returns an instance of Express to the user, optionally taking a key.
 * @param key The named instance of Express to return
 * @returns An instance of Express
 */
export const useExpress = (key = 'default'): Express => {
  if (!apps[key]) {
    apps[key] = App();
  }
  return apps[key];
};

/**
 * Applies an Express Router to a named instance of Express.
 * @param router The instance of an Express router to apply to the Express
 * instance
 * @param key The named instance of Express to apply the router to
 */
export const registerRouter = (router: Router, key = 'default') => {
  useExpress(key).use(router);
};
