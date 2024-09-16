import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Broker } from "./Broker";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar',unique: true })
  username: string;

  @Column({type: 'varchar'})
  password: string;

  @Column({type: 'varchar'})
  name: string;

  @Column({ type: 'varchar', unique: true })
  emailId: string;

  @Column({type: 'int'})
  brokerId!: number; // Foreign key to Broker
}
