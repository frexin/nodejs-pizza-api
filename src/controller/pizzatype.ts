import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { PizzaType } from '../entity/pizza_type';

export default class PizzatypeController {

    public static async getPizzatypes (ctx: BaseContext) {

        const ptypeRepository: Repository<PizzaType> = getManager().getRepository(PizzaType);
        const ptypes: PizzaType[] = await ptypeRepository.find();

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = ptypes;
    }

}

