import supertest from "supertest"
import { AppManager } from '../app'
import sauceRoutes from '../routes/sauce-routes'
import userRoutes from '../routes/user-routes'
import * as jwt from '../utils/jwt'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import fs from 'fs'
import * as database from '../database/sauce.database'

const appClass = new AppManager(8080)
appClass.setRouter(sauceRoutes, userRoutes)
appClass.init()
appClass.setImgDir()
const app = appClass.getExpress()

const userId = '123456789'
const dataToCreateSauce = {
    userId: userId,
    name: 'name',
    manufacturer: 'manufacturer',
    description: 'description',
    mainPepper: 'mainPepper',
    imageUrl: 'imageUrl',
    heat: 2,
}

const dbModelSauce = {
    description: "description",
    heat: 2,
    mainPepper: "mainPepper",
    manufacturer: "manufacturer",
    name: "name",
    userId: "123456789",
}
const imageUrl = "http://localhost/fakeurl"


const token = jwt.signToken(userId)

describe('SAUCE ROUTES', () => {

    describe('CREATE', () => {
        beforeAll(async () => {
            const mongo = await MongoMemoryServer.create()
            await mongoose.connect(mongo.getUri())
        })
        afterAll(async () => {

            await mongoose.disconnect()
            await mongoose.connection.close()
        })

        it('Should return 403 if no auth ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
            expect(res.status).toBe(403)
        })

        it('Should throw an error if file missing ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .send(dataToCreateSauce)
            expect(res.body.error).toBe("Aucun fichier n'a été envoyé")
        })

        it('Should return 201 passing file and correct data', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .field('sauce', JSON.stringify(dataToCreateSauce))
                .attach('image', `${__dirname}/test.png`)
            expect(res.status).toBe(201)

            const filename = res.body.createdSauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, async () => {
            })
        })


        it('Should return a valid sauce that was just created', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .field('sauce', JSON.stringify(dataToCreateSauce))
                .attach('image', `${__dirname}/test.png`)
            expect(res.body.createdSauce).toEqual({
                "__v": 0,
                "_id": expect.any(String),
                "description": "description",
                "dislikes": 0,
                "heat": 2,
                "imageUrl": expect.any(String),
                "likes": 0,
                "mainPepper": "mainPepper",
                "manufacturer": "manufacturer",
                "name": "name",
                "userId": "123456789",
                "usersDisliked": [],
                "usersLiked": []
            })
            const filename = res.body.createdSauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, async () => {
            })

        })

        it('Should throw an error if file type is not in the white list ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .field('sauce', JSON.stringify(dataToCreateSauce))
                .attach('image', `${__dirname}/gif.gif`)
            expect(res.body.error).toContain("Format de fichier non supporté")
        })

        it('Should return 400 if dont passe sauce data ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .attach('image', `${__dirname}/test.png`)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if sauce data contains errors ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .field('sauce', JSON.stringify({
                    userId: userId,
                    name: 'name',
                    manufacturer: 'manufacturer',
                    description: 'description',
                    mainPepper: 'mainPepper',
                    imageUrl: 'imageUrl',
                    heat: '4',

                }))
                .attach('image', `${__dirname}/test.png`)
            expect(res.status).toBe(400)
        })

        it('Should return an error if inputs are empty ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
                .field('sauce', JSON.stringify({
                    userId: userId,
                    name: '',
                    manufacturer: 'manufacturer',
                    description: 'description',
                    mainPepper: 'mainPepper',
                    imageUrl: 'imageUrl',
                    heat: '4',

                }))
                .attach('image', `${__dirname}/test.png`)
            expect(res.status).toBe(400)
        })
    })

    // GET ALL SAUCES SUITE TEST
    describe('GET ALL SAUCES, ', () => {
        beforeAll(async () => {
            const mongo = await MongoMemoryServer.create()
            await mongoose.connect(mongo.getUri())
        })
        afterAll(async () => {
            await mongoose.disconnect()
            await mongoose.connection.close()
        })
        it('it should deny access if no authentication returning a 403', async () => {
            const res = await supertest(app)
                .get(`/api/sauces`)
            expect(res.status).toBe(403)
        })

        it('should return 200 passing authentification', async () => {
            const res = await supertest(app)
                .get(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
        })


        it('should return a valid sauce data', async () => {
            await database.create(dbModelSauce, imageUrl)
            const res = await supertest(app)
                .get(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.body).toEqual([{
                "__v": 0,
                "_id": expect.any(String),
                "description": "description",
                "dislikes": 0,
                "heat": 2,
                "imageUrl": expect.any(String),
                "likes": 0,
                "mainPepper": "mainPepper",
                "manufacturer": "manufacturer",
                "name": "name",
                "userId": "123456789",
                "usersDisliked": [],
                "usersLiked": []
            }])
        })

        it('should return an array of sauces', async () => {
            const res = await supertest(app)
                .get(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.body).toEqual(expect.any(Array))
        })

        it('if DB contain more than one sauce, should return the correct number of sauces', async () => {
            await database.create(dbModelSauce, imageUrl)
            const res = await supertest(app)
                .get(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.body.length).toEqual(2)
        })
    })

    // GET ONE SAUCE ROUTE 
    describe('GET ONE SAUCE', () => {
        beforeAll(async () => {
            const mongo = await MongoMemoryServer.create()
            await mongoose.connect(mongo.getUri())

            //create on product
            await database.create(dbModelSauce, imageUrl)
        })
        afterAll(async () => {
            await mongoose.disconnect()
            await mongoose.connection.close()
        })

        it('it should deny access if no authentication returning a 403', async () => {
            const res = await supertest(app)
                .get(`/api/sauces/12222`)
            expect(res.status).toBe(403)
        })

        it('it should return 404 if sauce do not exist', async () => {
            const res = await supertest(app)
                .get(`/api/sauces/1222342`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
        })

        it('it should return the expected sauce with correct data structure', async () => {
            //retreive product id in DB
            const res1 = await supertest(app)
                .get(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
            const productId = res1.body[0]._id

            const res = await supertest(app)
                .get(`/api/sauces/${productId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body).toEqual({
                "__v": 0,
                "_id": expect.any(String),
                "description": "description",
                "dislikes": 0,
                "heat": 2,
                "imageUrl": expect.any(String),
                "likes": 0,
                "mainPepper": "mainPepper",
                "manufacturer": "manufacturer",
                "name": "name",
                "userId": "123456789",
                "usersDisliked": [],
                "usersLiked": []
            })
        })
    })

    //MODIFY SAUCE ROUTE
    describe('MODIFY SAUCE ROUTE', () => {
        async function productId() {
            try {
                const res = await supertest(app)
                    .get(`/api/sauces`)
                    .set('Authorization', `Bearer ${token}`)
                const productId = res.body[0]._id
                return productId
            } catch (error) {
                return error
            }
        }
        beforeAll(async () => {
            const mongo = await MongoMemoryServer.create()
            await mongoose.connect(mongo.getUri())

            //create on product
            await database.create(dbModelSauce, imageUrl)
        })
        afterAll(async () => {
            await mongoose.disconnect()
            await mongoose.connection.close()
        })

        it('It should deny access if no auth', async () => {
            const res = await supertest(app)
                .put(`/api/sauces/12222`)
            expect(res.status).toBe(403)
        })

        it('It should deny access if the sauce we are trying to modify is not our own sauce', async () => {
            const res = await supertest(app)
                .put(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${jwt.signToken("999999")}`)
            expect(res.status).toBe(401)
        })

        it('It should return 200 if only update data ', async () => {
            const res = await supertest(app)
                .put(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${token}`)
                .send(dataToCreateSauce)
            expect(res.status).toBe(200)
        })

        it('It should return 400 if new sauce data contain errors ', async () => {
            const res = await supertest(app)
                .put(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    name: '',
                    manufacturer: 'manufacturer',
                    description: 'description',
                    mainPepper: 'mainPepper',
                    imageUrl: 'imageUrl',
                    heat: "2",
                })
            expect(res.status).toBe(400)
        })

        it('It should return 200 if update file and data ', async () => {
            const res = await supertest(app)
                .put(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${token}`)
                .attach('image', `${__dirname}/test.png`)
                .field('sauce', JSON.stringify(dataToCreateSauce))
            expect(res.status).toBe(200)

            //delete the file created by this test
            const res2 = await supertest(app)
                .get(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${token}`)

            const filename = res2.body.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, async () => { })
        })
    })

    //DELETE SAUCE ROUTE
    describe('DELETE SAUCE ROUTE', () => {
        async function productId() {
            try {
                const res = await supertest(app)
                    .get(`/api/sauces`)
                    .set('Authorization', `Bearer ${token}`)
                const productId = res.body[0]._id
                return productId
            } catch (error) {
                return error
            }
        }
        beforeAll(async () => {
            const mongo = await MongoMemoryServer.create()
            await mongoose.connect(mongo.getUri())

            //create on product
            await database.create(dbModelSauce, imageUrl)
        })
        afterAll(async () => {
            await mongoose.disconnect()
            await mongoose.connection.close()
        })

        it('It should deny access if no auth', async () => {
            const res = await supertest(app)
                .delete(`/api/sauces/12222`)
            expect(res.status).toBe(403)
        })

        it('It should deny access if the sauce we are trying to delete is not our own sauce', async () => {
            const res = await supertest(app)
                .delete(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${jwt.signToken("999999")}`)
            expect(res.status).toBe(401)
        })

        // It should work and return 200 
        it('It should work and return 200', async () => {
            const res = await supertest(app)
                .delete(`/api/sauces/${await productId()}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
        })

        it(' DB shoud not contain causes anymore so body [0] should be undefined if we try to find sauces ', async () => {
            //retreive product id in DB
            const res1 = await supertest(app)
                .get(`/api/sauces`)
                .set('Authorization', `Bearer ${token}`)
            expect(res1.body[0]).toBeUndefined()
        })
    })

    //LIKES SAUCE ROUTE
    describe('LIKES SAUCE ROUTE', () => {
        beforeAll(async () => {
            const mongo = await MongoMemoryServer.create()
            await mongoose.connect(mongo.getUri())
            //create on product
            await database.create(dbModelSauce, imageUrl)
        })

        async function productId() {
            try {
                const res = await supertest(app)
                    .get(`/api/sauces`)
                    .set('Authorization', `Bearer ${token}`)
                const productId = res.body[0]._id
                return productId
            } catch (error) {
                return error
            }
        }

        afterAll(async () => {
            await mongoose.disconnect()
            await mongoose.connection.close()
        })

        it('It should deny access if no auth', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
            expect(res.status).toBe(403)
        })

        // It should return 400 if sauce did not exist
        it('Response should return error if dont find sauce id', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/1111/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: 1
                })
            expect(res.body.error.message).toContain("Cast to ObjectId failed for value")
        })

        it('It should return error if like is not a number', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: "d"
                })
            expect(res.status).toBe(500)
            expect(res.body.error).toContain('Le like doit être un nombre compris entre -1 et 1')
        })

        it('It should return error if like number is > 1', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: 5
                })
            expect(res.status).toBe(500)
            expect(res.body.error).toContain('Le like doit être un nombre compris entre -1 et 1')
        })

        it('It should return error if like number is < 1', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: -10
                })
            expect(res.status).toBe(500)
            expect(res.body.error).toContain('Le like doit être un nombre compris entre -1 et 1')
        })

        it('Like = 0 : Should return 400 and a specific error msg if not already liked or disliked the sauce', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: 0
                })
            expect(res.status).toBe(500)
            expect(res.body.error).toContain('Vous n\'avez pas encore donné votre avis sur cette sauce !')
        })

        it('Like = 1 : Should return 200 and update DB if not already like ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: 1
                })
            expect(res.status).toBe(201)
        })

        it('Like = 1 : Should return 500 and erro msg if already liked or dislike ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: 1
                })
            expect(res.status).toBe(500)
            expect(res.body.error).toContain('Vous avez déjà donné votre avis sur cette sauce !')
        })

        it('Like = 0 : should return 200 and decrement the previous like or dislike  ', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: 0
                })
            expect(res.status).toBe(201)
            expect(res.body.message).toContain('Votre avis a été enregistré !')
        })

        it('Like = -1 : Should return 200 and update DB if not already like or disliked', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: -1
                })
            expect(res.status).toBe(201)
            expect(res.body.message).toContain('Votre avis a été enregistré !')
        })

        it('Like = -1 : Should return 400 already dislike', async () => {
            const res = await supertest(app)
                .post(`/api/sauces/${await productId()}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: userId,
                    like: -1
                })
            expect(res.status).toBe(500)
            expect(res.body.error).toContain('Vous avez déjà donné votre avis sur cette sauce !')
        })
    })
})



