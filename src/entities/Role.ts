import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', array: true })
  roles: string[];
}