import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  count!: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}