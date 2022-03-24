import { LinkerModule } from '@tachyon/core';
import { useExpress } from '@tachyon/express';

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
