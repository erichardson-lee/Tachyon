import { LoadLinkers } from '@tachyon/core';
import { useExpress } from '@tachyon/express';
import { join } from 'path';

const setup = async () => {
  const express = useExpress();

  await LoadLinkers(join(__dirname, 'linkers'));

  express.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

void setup();
