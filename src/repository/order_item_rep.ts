import {EntityRepository, Repository} from "typeorm";
import {OrderItem} from "../entity/order_item";

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {

    // findByName(firstName: string, lastName: string) {
    //     return this.findOne({ firstName, lastName });
    // }
    //
    // clearCurrentItems

}
