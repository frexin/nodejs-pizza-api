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
        const ordersRep: Repository<Order> = getManager().getRepository(Order);

        let orderObject = ctx.request.body;

        let orderToSave: Order = new Order();
        orderToSave.customerId = orderObject.customer_id;
        orderToSave.statusId = StatusList.New;

        let orderErrors: ValidationError[] = await validate(orderToSave);
        let items:Array<OrderItem> = [];

        for (let index in orderObject.items) {
            let item = orderObject.items[index];
            let orderItem = new OrderItem();

            orderItem.quantity = item.quantity;
            orderItem.size = item.size;
            orderItem.pizzaTypeId = item.type_id;

            let itemsErrors: ValidationError[] = await validate(orderItem);

            if (itemsErrors.length) {
                orderErrors = orderErrors.concat(itemsErrors);
                break;
            }

            items.push(orderItem);
        }

        if (orderErrors.length > 0) {
            ctx.status = 400;
            ctx.body = orderErrors;
        } else {
            orderToSave.items = items;
            const order = await ordersRep.save(orderToSave);

            ctx.status = 201;
            ctx.body = order;
        }
    }

}
