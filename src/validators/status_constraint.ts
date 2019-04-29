import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {getManager, Repository} from "typeorm";
import {Pizzatype} from "../entity/pizzatype";
import {Status} from "../entity/status";
import {Order} from "../entity/order";
import {StatusResolver} from "../helpers/status_resolver";

@ValidatorConstraint()
export class IsNextStatusAllowedConstraint implements ValidatorConstraintInterface {

    validate(property: any, args: ValidationArguments) {
        let newStatus:Status = property;
        let oldOrder:Order = (<Order>args.object);
        let allowedNextStatuses:Array<number> = StatusResolver.getAllowedNextSteps(oldOrder.statusId);

        return allowedNextStatuses.indexOf(newStatus.id) !== -1;
    }

}

export function IsStatusAllowed(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNextStatusAllowedConstraint
        });
    };
}
