import * as Faker from 'faker'
import {Customer} from "../../entity/customer";
import {define} from "typeorm-seeding";

define(Customer, (faker: typeof Faker, settings: { roles: string[] }) => {
    let addr = faker.address.city();
    let phone = "+49" + faker.random.alphaNumeric(10);
    let name = faker.name.firstName();

    const customer = new Customer();
    customer.name = name;
    customer.phone = phone;
    customer.address = addr;

    return customer;
});
