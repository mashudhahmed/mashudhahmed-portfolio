import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  company!: string;

  @Column({ length: 150 })
  position!: string;

  @Column({ nullable: true })
  companyLogo?: string;

  @Column({ nullable: true })
  companyUrl?: string;

  @Column({ length: 50, default: 'Full-time' })
  employmentType!: string;

  @Column({ length: 100, default: 'Dhaka, Bangladesh' })
  location!: string;

  @Column({ length: 50 })
  startDate!: string;

  @Column({ length: 50, nullable: true })
  endDate?: string;

  @Column({ default: false })
  isCurrent!: boolean;

  @Column('text')
  description!: string;

  @Column('simple-array', { nullable: true })
  technologies!: string[];

  @Column({ default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
