import application from '../../server'
import * as Koa from "koa";

import {agent} from 'supertest';

describe('Customer', () => {

    describe('POST /customer', () => {
        it('should work if all required parameters are present', () => {
            return application.then((app:Koa) => {
                const request = agent(app.callback());

                return request.get('/customers').expect(200).then(response => {
                    let i = 1;
                });


                // req.post('/customers')
                //     .set('Content-Type', 'application/json')
                //     .send({"name": "Adam Smith", "phone": "+493029105895", "address": "fsd fsd fsd"});

                // return req;
            })
            // .then((req) => {
            //    req.expect(200, 'It works!').then(response => {
            //        let i = 1;
            //    })
            // });
        });
    });
});


