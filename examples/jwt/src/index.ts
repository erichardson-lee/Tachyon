import { LoadLinkers } from '@tachyonjs/core';
import { useFastify } from '@tachyonjs/fastify';
import { join } from 'path';

void main();
async function main() {
  const fastify = useFastify();

  await LoadLinkers(join(__dirname, './linkers'));

  fastify.listen(3002).then(() => console.log('Listening on port 3002'));
}
