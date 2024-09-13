import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity('broker')
export class Broker {
  @PrimaryGeneratedColumn()
  id:  number;

  @Column({type: "varchar"})
  name: string;
}
