import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import {Pizzatype} from "./pizzatype";
import {pizzatype} from "../controller";
import {Order} from "./order";

enum Sizes {
    Small = 25,
    Medium = 35,
    Large = 40
}

@Entity('orders_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: Number;

    @ManyToOne(type => Pizzatype, pizzatype => pizzatype.orderItems, { eager: true })
    pizzaType: Pizzatype;

    @ManyToOne(type => Order, order => order.items)
    order: Order;

    @Column()
    size: Sizes
}
