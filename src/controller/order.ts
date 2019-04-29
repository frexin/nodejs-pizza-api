import {BaseContext} from 'koa';
import {getManager, Repository, Not, Equal} from 'typeorm';
import {Order} from "../entity/order";
import {Status, StatusList} from "../entity/status";
import {OrderItem} from "../entity/order_item";
import {Pizzatype} from "../entity/pizzatype";
import {validate, validateSync, ValidationError} from "class-validator";


export default class OrderController {

    static itemsValidationErrors:ValidationError[] = [];

    public static async getOrders(ctx: BaseContext) {

        const ordersRep: Repository<Order> = getManager().getRepository(Order);
        const orders: Order[] = await ordersRep.find();

        ctx.status = 200;
        ctx.body = orders;
    }

    public static async getOrder(ctx: BaseContext) {
        let orderId = +ctx.params.id || 0;

        const ordersRep: Repository<Order> = getManager().getRepository(Order);
        const order: Order = await ordersRep.findOne(orderId);

        if (!order) {
            return this.orderNotFound(ctx, orderId);
        }

        ctx.status = 200;
        ctx.body = order;
    }

    public static async createOrder(ctx: BaseContext) {
        let orderObject = ctx.request.body;
        let orderToSave: Order = new Order();

        orderToSave.customerId = orderObject.customer_id;
        orderToSave.statusId = StatusList.New;

        let items:Array<OrderItem> = await OrderController.prepareAndValidateOrderItems(orderObject.items);
        await OrderController.validateAndSendResult(items, ctx, orderToSave);
    }

    public static async updateOrder(ctx: BaseContext) {
        const ordersRep: Repository<Order> = getManager().getRepository(Order);

        let orderObject = ctx.request.body;

        let orderId = +ctx.params.id || 0;
        let orderToUpdate: Order = await ordersRep.findOne(orderId);

        if (!orderToUpdate) {
            return this.orderNotFound(ctx, orderId);
        }

        if (orderObject.statusId) {
            orderToUpdate.status = new Status(orderObject.statusId);
        }

        let items:Array<OrderItem> = orderToUpdate.items;

        if (orderObject.items) {
            items = await OrderController.prepareAndValidateOrderItems(orderObject.items, orderToUpdate.items);
        }

        await OrderController.validateAndSendResult(items, ctx, orderToUpdate);
    }

    public static async deleteOrder(ctx: BaseContext) {
        let orderId = +ctx.params.id || 0;

        const ordersRep: Repository<Order> = getManager().getRepository(Order);
        const order: Order = await ordersRep.findOne(orderId);

        if (!order) {
            return this.orderNotFound(ctx, orderId);
        }

        ordersRep.delete(orderId);
        ctx.status = 200;
    }

    private static orderNotFound(ctx: BaseContext, orderId) {
        ctx.status = 404;

        let notFoundError: ValidationError = new ValidationError();
        notFoundError.property = "id";
        notFoundError.value = orderId;
        notFoundError.constraints = {
            "id": "Order not found"
        };

        ctx.body = notFoundError;
    }

    private static async prepareAndValidateOrderItems(itemsData, itemsToDelete?: Array<OrderItem>) {
        let items:Array<OrderItem> = [];

        for (let index in itemsData) {
            let item = itemsData[index];
            let orderItem = new OrderItem();

            orderItem.quantity = item.quantity;
            orderItem.size = item.size;
            orderItem.pizzaTypeId = item.type_id;

            let itemsErrors: ValidationError[] = await validate(orderItem);

            if (itemsErrors.length) {
                OrderController.itemsValidationErrors = itemsErrors;
                items = [];
                break;
            }

            items.push(orderItem);
        }

        if (items.length && itemsToDelete) {
            const itemsRep: Repository<OrderItem> = getManager().getRepository(OrderItem);

            itemsToDelete.map((item) => {
                itemsRep.delete({id: item.id});
            });
        }

        return items;
    }

    private static async validateAndSendResult(items: Array<OrderItem>, ctx: BaseContext, orderToSave: Order) {
        const ordersRep: Repository<Order> = getManager().getRepository(Order);
        let validationErrors = await validate(orderToSave);

        if (items.length == 0 || validationErrors.length !== 0) {
            validationErrors = OrderController.itemsValidationErrors.concat(validationErrors);

            ctx.status = 400;
            ctx.body = validationErrors;
        } else {
            orderToSave.items = items;
            const order = await ordersRep.save(orderToSave);

            ctx.status = 201;
            ctx.body = order;
        }
    }
}
