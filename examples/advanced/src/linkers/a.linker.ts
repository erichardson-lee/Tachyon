import { defineLinker } from '@tachyonjs/core';

export default defineLinker({
  name: 'Test Linker',
  install() {
    console.log('Test Linker installed');
  },
});
