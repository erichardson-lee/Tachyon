import { LinkerModule } from '@tachyon/core';
import { useExpress } from '@tachyon/express';

export default {
  name: 'testLinker',
  install() {
    const express = useExpress();

    express.get('/:name', (req, res) => {
      res.json(req.params);
    });
  },
} as LinkerModule;
