import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {Length, IsEmail, ArrayContains, IsIn} from 'class-validator';
import {PizzaType} from "./pizza_type";
import {Order} from "./order";
import {IsPizzaTypeExist, IsPizzaTypeExistConstraint} from "../validators/exist_type";

enum Sizes {
    Small = 25,
    Medium = 30,
    Large = 35
}

@Entity('orders_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: Number;

    @ManyToOne(type => PizzaType, pizzatype => pizzatype.orderItems, { eager: true })
    pizzaType: PizzaType;

    @ManyToOne(type => Order, order => order.items, {onDelete: "CASCADE"})
    order: Order;

    @Column()
    @IsIn([Sizes.Small, Sizes.Medium, Sizes.Large])
    size: Sizes;

    @Column()
    @IsPizzaTypeExist({
        message: "Unknown pizza type"
    })
    pizzaTypeId: number;
}
