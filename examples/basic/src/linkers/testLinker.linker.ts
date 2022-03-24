import { LinkerModule } from '@tachyonjs/core';
import { useExpress } from '@tachyonjs/express';

export default {
  name: 'testLinker',
  install() {
    const express = useExpress();

    express.get('/', (req, res) => {
      res.send('Hello World!');
    });

    express.get('/:name', (req, res) => {
      res.send(`Hello ${req.params.name}`);
    });
  },
} as LinkerModule;
