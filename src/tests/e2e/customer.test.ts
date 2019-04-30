import application from '../../server'
import * as Koa from "koa";
import {getConnection} from "typeorm";

import {agent} from 'supertest';
import {Customer} from "../../entity/customer";

beforeEach(() => {
    application.then(() => {
        return getConnection().createQueryBuilder().delete().from("customers").execute();
    });
});

describe('Customer', () => {

    let postData = {"name": "Adam Smith", "phone": "+493029105895", "address": "fsd fsd fsd"};
    let responseKeys = ["name", "phone", "address"];

    describe('POST /customer', () => {
        it('should work if all required parameters are present', async () => {
            return application.then(async (app:Koa) => {
                const request = agent(app.callback());

                let res = await request.post('/customers').send(postData).expect(201);

                expect(Object.keys(res.body)).toEqual(expect.arrayContaining(responseKeys));
            })
        });

        it('should not work if one required parameter is missed', async () => {
            return application.then(async (app:Koa) => {
                const request = agent(app.callback());

                delete postData.address;
                let res = await request.post('/customers').send(postData).expect(400);

                expect(res.body[0]).toHaveProperty("property", "address");
            })
        });
    });

    describe('GET /customers', () => {
        let customers = [
            {"name": "Jack Daniels", "phone": "+493019105810", "address": "nevada"},
            {"name": "Johny Depp", "phone": "+493029105810", "address": "Hollywood rd"}
        ];

        it('should return list of two customers', async () => {
            return application.then(async (app:Koa) => {
                await getConnection().createQueryBuilder().insert().into("customers")
                    .values(customers).execute();

                const request = agent(app.callback());
                let res = await request.get('/customers').expect(200);

                expect(res.body.length).toEqual(2);
                expect(Object.keys(res.body[0])).toEqual(expect.arrayContaining(responseKeys));
            })
        });

        it('should return only one customer', async () => {
            return application.then(async (app:Koa) => {
                let insResult = await getConnection().createQueryBuilder().insert().into("customers")
                    .values([customers[0]]).execute();
                let id = insResult.identifiers[0].id;

                const request = agent(app.callback());
                let url = '/customers/' + id;
                console.log(url);
                let res = await request.get(url).expect(200);

                expect(Object.keys(res.body)).toEqual(expect.arrayContaining(responseKeys));
            })
        });
    });
});


