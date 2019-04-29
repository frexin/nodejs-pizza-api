import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {getManager, Repository} from "typeorm";
import {Customer} from "../entity/customer";

@ValidatorConstraint({ async: true })
export class IsCustomerAlreadyExistConstraint implements ValidatorConstraintInterface {

    validate(property: any, args: ValidationArguments) {
        const customerRep: Repository<Customer> = getManager().getRepository(Customer);

        return customerRep.findOne({"phone": property}).then(customer => {
            return !customer;
        });
    }

}

export function IsCustomerAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCustomerAlreadyExistConstraint
        });
    };
}
