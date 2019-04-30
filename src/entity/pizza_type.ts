import {Entity, Column, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import {OrderItem} from "./order_item";

@Entity('pizza_types')
export class PizzaType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @OneToOne(type => OrderItem, orderItem => orderItem.pizzaType)
    orderItems: OrderItem[];
}
