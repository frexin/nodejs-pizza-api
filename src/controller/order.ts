import {BaseContext} from 'koa';
import {getManager, Repository, Not, Equal} from 'typeorm';
import {Order} from "../entity/order";
import {Status, StatusList} from "../entity/status";
import {OrderItem} from "../entity/order_item";
import {Pizzatype} from "../entity/pizzatype";
import {validate, ValidationError} from "class-validator";


export default class OrderController {

    public static async getOrders(ctx: BaseContext) {

        const ordersRep: Repository<Order> = getManager().getRepository(Order);
        const orders: Order[] = await ordersRep.find();

        ctx.status = 200;
        ctx.body = orders;
    }

    public static async createOrder(ctx: BaseContext) {
        const pizzaTypeRep: Repository<Pizzatype> = getManager().getRepository(Pizzatype);
        const ordersRep: Repository<Order> = getManager().getRepository(Order);

        let orderObject = ctx.request.body;

        let orderToSave: Order = new Order();
        orderToSave.customerId = orderObject.customer_id;
        orderToSave.statusId = StatusList.New;

        const errors: ValidationError[] = await validate(orderToSave);

        for (let index in orderObject.items) {
            let item = orderObject.items[index];

            let orderItem = new OrderItem();

            orderItem.quantity = item.quantity;
            orderItem.size = item.size;
            orderItem.pizzaType = await pizzaTypeRep.findOne(item.type_id);

            orderToSave.items.push(orderItem);
        }

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
        } else {
            const order = await ordersRep.save(orderToSave);

            ctx.status = 201;
            ctx.body = order;
        }
    }

}
