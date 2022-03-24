import { DataSource, DataSourceOptions, EntityTarget } from 'typeorm';

const dataSources: Record<string, DataSource> = {};

export const UseTypeOrm = (
  key = 'default',
  options?: DataSourceOptions,
): DataSource => {
  if (!dataSources[key]) {
    if (options) {
      dataSources[key] = new DataSource(options);

      dataSources[key].initialize();
    } else
      throw new Error(
        `No DataSourceOptions provided, needed for first call of useTypeOrm with key ${key}`,
      );
  }
  return dataSources[key];
};

export const InitializeTypeOrm = async () => {
  await Promise.all(
    Object.keys(dataSources).map((key) => {
      dataSources[key].initialize();
    }),
  );
};

export const UseTypeOrmRepository =
  <Entity>(entity: EntityTarget<Entity>) =>
  (key = 'default') =>
    UseTypeOrm(key).getRepository<Entity>(entity);
