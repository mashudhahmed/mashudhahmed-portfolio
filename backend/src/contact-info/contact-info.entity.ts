import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('contact_info')
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  location!: string;

  @Column()
  timezone!: string;

  @Column()
  workingHours!: string;

  @Column()
  responseTime!: string;

  @Column({ default: true })
  availableForWork!: boolean;

  @UpdateDateColumn()
  updatedAt!: Date;
}