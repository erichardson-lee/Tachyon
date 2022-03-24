import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UseTypeOrmRepository } from '@tachyonjs/typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}

export const useArtistRepository = UseTypeOrmRepository(Artist);
