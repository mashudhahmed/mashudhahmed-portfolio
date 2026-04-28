import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('about')
export class About {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  bio!: string;

  @Column({ nullable: true })
  photoUrl!: string;

  @Column()
  education!: string;

  @Column()
  university!: string;

  @Column()
  major!: string;

  @Column()
  yearStart!: string;

  @Column()
  yearEnd!: string;

  @Column('text')
  coursework!: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}