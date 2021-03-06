import 'reflect-metadata';
import { LoadLinkers } from '@tachyonjs/core';
import { useExpress } from '@tachyonjs/express';
import { initializeTypeOrm, useTypeOrm } from '@tachyonjs/typeorm';
import { join } from 'path';
import bodyParser from 'body-parser';

const setup = async () => {
  const express = useExpress();

  express.use(bodyParser.json());

  useTypeOrm('default', {
    type: 'sqlite',
    synchronize: true,
    database: join(__dirname, '../db/default.sqlite'),
    entities: [join(__dirname, './entities/*.entity.{js,ts}')],
  });
  await initializeTypeOrm();

  await LoadLinkers(join(__dirname, 'linkers'));

  express.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

void setup();
