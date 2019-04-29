import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import {Order} from "./order";

export enum StatusList {
    New = 1, InProgress, Canceled, Completed
}

@Entity('status_list')
export class Status {

    constructor(id: number) {
        this.id = id;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Order, order => order.status)
    orders: Order[]
}
