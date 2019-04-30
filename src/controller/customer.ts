import {BaseContext} from 'koa';
import {getManager, Repository, Not, Equal} from 'typeorm';
import {validate, ValidationError} from 'class-validator';
import {Customer} from '../entity/customer';
import {Order} from "../entity/order";

export default class CustomerController {

    public static async getCustomers(ctx: BaseContext) {

        const customerRep: Repository<Customer> = getManager().getRepository("customers");
        const customers: Customer[] = await customerRep.find();

        ctx.status = 200;
        ctx.body = customers;
    }

    public static async getCustomer(ctx: BaseContext) {
        let customerId = +ctx.params.id || 0;

        const ordersRep: Repository<Customer> = getManager().getRepository("customers");
        const customer: Customer = await ordersRep.findOne(customerId);

        if (!customer) {
            ctx.status = 404;
        }

        ctx.status = 200;
        ctx.body = customer;
    }

    public static async createCustomer(ctx: BaseContext) {

        const customerRep: Repository<Customer> = getManager().getRepository("customers");

        const customerToSave: Customer = new Customer();
        let customerObject = ctx.request.body;

        customerToSave.name = customerObject.name;
        customerToSave.address = customerObject.address;
        customerToSave.phone = customerObject.phone;

        const errors: ValidationError[] = await validate(customerToSave);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
        } else {
            const user = await customerRep.save(customerToSave);
            ctx.status = 201;
            ctx.body = user;
        }
    }
}
