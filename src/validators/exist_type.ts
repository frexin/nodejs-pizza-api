import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {getManager, Repository} from "typeorm";
import {PizzaType} from "../entity/pizza_type";

@ValidatorConstraint({ async: true })
export class IsPizzaTypeExistConstraint implements ValidatorConstraintInterface {

    validate(property: any, args: ValidationArguments) {
        const ptypeRep: Repository<PizzaType> = getManager().getRepository(PizzaType);

        return ptypeRep.findOne(property).then(ptype => {
            return ptype !== undefined;
        });
    }

}

export function IsPizzaTypeExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPizzaTypeExistConstraint
        });
    };
}
