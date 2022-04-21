import { DataSource, DataSourceOptions, EntityTarget } from 'typeorm';

const dataSources: Record<string, DataSource> = {};

/**
 * Returns an instance of a TypeORM DataSource to the user, optionally taking a
 * key.
 * 
 * @param key The named instance of a DataSource to return
 * @param options Any DataSource options to provide when instantiating the
 * DataSource.
 * @returns An instance of a TypeORM DataSource
 */
export const useTypeOrm = (
  key = 'default',
  options?: DataSourceOptions,
): DataSource => {
  if (!dataSources[key]) {
    if (options) {
      dataSources[key] = new DataSource(options);
    } else
      throw new Error(
        `No DataSourceOptions provided, needed for first call of useTypeOrm with key ${key}`,
      );
  }
  return dataSources[key];
};

/**
 * Initializes all registered TypeORM DataSources.
 */
export const initializeTypeOrm = async () => {
  await Promise.all(
    Object.keys(dataSources).map((key) => {
      dataSources[key].initialize();
    }),
  );
};

/**
 * Returns a TypeORM repository for the user, given an Entity.
 * @param entity The Entity to return a TypeORM repository for.
 * @returns A TypeORM repository.
 */
export const UseTypeOrmRepository =
  <Entity>(entity: EntityTarget<Entity>) =>
  (key = 'default') =>
    useTypeOrm(key).getRepository<Entity>(entity);
