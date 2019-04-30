import * as Router from 'koa-router';
import controller = require('./controller');

const router = new Router();

router.get('/pizza-types', controller.pizzatype.getPizzatypes);
router.get('/customers', controller.customer.getCustomers);
router.get('/customers/:id', controller.customer.getCustomer);
router.post('/customers', controller.customer.createCustomer);

router.get('/orders', controller.order.getOrders);
router.post('/orders', controller.order.createOrder );
router.put('/orders/:id', controller.order.updateOrder );
router.get('/orders/:id', controller.order.getOrder );
router.delete('/orders/:id', controller.order.deleteOrder );



export { router };
