import { LoadLinkers } from '@tachyonjs/core';
import { useFastify } from '@tachyonjs/fastify';
import { initializeTypeOrm } from '@tachyonjs/typeorm';
import { join } from 'path';

void main();
async function main() {
  const fastify = useFastify();

  await LoadLinkers(join(__dirname, './linkers'));

  initializeTypeOrm();
  fastify.listen(3003).then(() => console.log('Listening on port 3003'));
}
