import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import {Length, IsEmail, ValidateNested} from 'class-validator';
import {Pizzatype} from "./customer";
import {Status} from "./status";
import {OrderItem} from "./order_item";
import {IsCustomerAlreadyExistConstraint} from "../validators/exist_property";
import {IsCustomerExist} from "../validators/exist_customer";

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamp"})
    dt_add: Date;

    @ManyToOne(type => Pizzatype, customer => customer.orders, { eager: true })
    customer: Pizzatype;

    @ManyToOne(type => Status, status => status.orders, { eager: true })
    @JoinColumn()
    status: Status;

    @OneToMany(type => OrderItem, orderItem => orderItem.order, { eager: true })
    @ValidateNested()
    items: OrderItem[];

    @Column({nullable: true})
    @IsCustomerExist({
        message: "Unknown customer"
    })
    customerId: number;

    @Column({nullable: true})
    statusId: number;
}
