import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { Pizzatype } from '../entity/pizzatype';

export default class PizzatypeController {

    public static async getPizzatypes (ctx: BaseContext) {

        const ptypeRepository: Repository<Pizzatype> = getManager().getRepository(Pizzatype);
        const ptypes: Pizzatype[] = await ptypeRepository.find();

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = ptypes;
    }

}

