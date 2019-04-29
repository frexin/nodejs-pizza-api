import {BaseContext} from 'koa';
import {getManager, Repository, Not, Equal} from 'typeorm';
import {validate, ValidationError} from 'class-validator';
import {User} from '../entity/user';
import {Customer} from "../entity/customer";

export default class CustomerController {

    public static async getCustomers(ctx: BaseContext) {

        const customerRep: Repository<Customer> = getManager().getRepository(Customer);
        const customers: Customer[] = await customerRep.find();

        ctx.status = 200;
        ctx.body = customers;
    }

    public static async createCustomer(ctx: BaseContext) {

        const customerRep: Repository<Customer> = getManager().getRepository(Customer);

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
