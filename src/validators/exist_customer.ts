import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {getManager, Repository} from "typeorm";
import {Customer} from "../entity/customer";

@ValidatorConstraint({ async: true })
export class IsLinkedCustomerExist implements ValidatorConstraintInterface {

    validate(property: any, args: ValidationArguments) {
        const customerRep: Repository<Customer> = getManager().getRepository(Customer);

        return customerRep.findOne(property).then(customer => {
            return customer !== undefined;
        });
    }

}

export function IsCustomerExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsLinkedCustomerExist
        });
    };
}
