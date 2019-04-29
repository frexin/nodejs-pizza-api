import * as Router from 'koa-router';
import controller = require('./controller');

const router = new Router();

router.get('/users', controller.user.getUsers);
router.get('/users/:id', controller.user.getUser);
router.post('/users', controller.user.createUser);
router.put('/users/:id', controller.user.updateUser);
router.delete('/users/:id', controller.user.deleteUser);

router.get('/pizza-types', controller.pizzatype.getPizzatypes);
router.get('/customers', controller.customer.getCustomers);
router.post('/customers', controller.customer.createCustomer);

router.get('/orders', controller.order.getOrders);
router.post('/orders', controller.order.createOrder );
router.put('/orders/:id', controller.order.updateOrder );



export { router };
