import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key!: string;

  @Column('text')
  value!: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}