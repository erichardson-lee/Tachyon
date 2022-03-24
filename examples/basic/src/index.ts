import { useExpress } from '@tachyon/express';

const express = useExpress();

express.listen(3000, () => {
  console.log('Listening on port 3000');
});
