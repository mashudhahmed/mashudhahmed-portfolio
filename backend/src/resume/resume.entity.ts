import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('resume')
export class Resume {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  fileName!: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}