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
import {Customer} from "./customer";
import {Status} from "./status";
import {OrderItem} from "./order_item";
import {IsCustomerExist} from "../validators/exist_customer";
import {IsStatusAllowed} from "../validators/status_constraint";

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamp"})
    dt_add: Date;

    @ManyToOne(type => Customer, customer => customer.orders, { eager: true })
    customer: Customer;

    @ManyToOne(type => Status, status => status.orders, { eager: true })
    @JoinColumn()
    @IsStatusAllowed()
    status: Status;

    @OneToMany(type => OrderItem, orderItem => orderItem.order, { eager: true, cascade: true, onDelete: "CASCADE" })
    items: OrderItem[];

    @Column({nullable: true})
    @IsCustomerExist({
        message: "Unknown customer"
    })
    customerId: number;

    @Column({nullable: true})
    statusId: number;
}
