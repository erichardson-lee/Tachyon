import { LinkerModule } from '@tachyonjs/core';
import { Router, useExpress } from '@tachyonjs/express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { useArtistRepository } from '../entities/artist.entity';

const setupRoutes = () => {
  const router = Router();
  const artistRepository = useArtistRepository();

  router.get('/', async (req, res) => {
    const artists = await artistRepository.find();

    res.json(artists);
  });

  router.post('/', async (req, res) => {
    const data = req.body;
    try {
      const artist = artistRepository.create(data);

      await artistRepository.save(artist);

      res.json(artist);
    } catch (e) {
      console.error('Error Adding artist', e);

      process.env.NODE_ENV === 'production'
        ? res.status(500).send('Server Error')
        : res.status(500).json(e);
    }
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const artist = await artistRepository.findOneOrFail({ where: { id } });

      res.json(artist);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        res.status(404).send('Artist not found');
      } else {
        console.error('Error getting artist', e);

        process.env.NODE_ENV === 'production'
          ? res.status(500).send('Server Error')
          : res.status(500).json(e);
      }
    }
  });

  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    data.id = id;

    try {
      const artist = artistRepository.create(data);

      await artistRepository.save(artist);

      res.json(artist);
    } catch (e) {
      console.error('Error updating artist', e);

      process.env.NODE_ENV === 'production'
        ? res.status(500).send('Server Error')
        : res.status(500).json(e);
    }
  });

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const artist = await artistRepository.findOneOrFail({ where: { id } });

      await artistRepository.remove(artist);

      res.json(artist);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        res.status(404).send('Artist not found');
      } else {
        console.error('Error deleting artist', e);

        process.env.NODE_ENV === 'production'
          ? res.status(500).send('Server Error')
          : res.status(500).json(e);
      }
    }
  });

  return router;
};

export default {
  name: 'Artists Module',
  install() {
    const app = useExpress();

    const router = setupRoutes();
    app.use('/api/artists', router);
  },
} as LinkerModule;
