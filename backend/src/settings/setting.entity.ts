import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })  // ← ADD unique: true
  key!: string;

  @Column('text')
  value!: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}