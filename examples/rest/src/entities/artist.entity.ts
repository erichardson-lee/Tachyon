import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UseTypeOrmRepository } from '@tachyon/typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}

export const useArtistRepository = UseTypeOrmRepository(Artist);
