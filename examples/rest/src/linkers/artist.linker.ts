import { LinkerModule } from '@tachyon/core';
import { useExpress } from '@tachyon/express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { useArtistRepository } from '../entities/artist.entity';

export default {
  name: 'Artists Module',
  install() {
    const app = useExpress();
    const artistRepository = useArtistRepository();

    app.get('/artists', async (req, res) => {
      const artists = await artistRepository.find();

      res.json(artists);
    });

    app.post('/artists', async (req, res) => {
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

    app.get('/artists/:id', async (req, res) => {
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

    app.put('/artists/:id', async (req, res) => {
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

    app.delete('/artists/:id', async (req, res) => {
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
  },
} as LinkerModule;
