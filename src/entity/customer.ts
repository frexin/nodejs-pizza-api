import {Entity, Column, PrimaryGeneratedColumn, OneToMany, Index} from 'typeorm';
import {Length, IsEmail, IsNotEmpty, IsPhoneNumber} from 'class-validator';
import {Order} from "./order";
import {IsCustomerAlreadyExist} from "../validators/exist_property";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    address: string;

    @Column({length: 16})
    @Index({unique: true})
    @IsNotEmpty()
    @IsPhoneNumber("DE")
    @IsCustomerAlreadyExist({
        message: "This phone number is already exists"
    })
    phone: string;

    @OneToMany(type => Order, order => order.customer)
    orders: Order[];
}
