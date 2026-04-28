import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column('text')
  description!: string;

  @Column('simple-array')
  technologies!: string[];

  @Column()
  imageUrl!: string;

  @Column()
  githubUrl!: string;

  @Column({ nullable: true })
  liveUrl!: string;

  @Column({ default: 0 })
  views!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}