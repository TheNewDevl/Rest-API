import supertest from 'supertest'
import { AppManager } from '../app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import sauceRoutes from '../routes/sauce-routes'
import userRoutes from '../routes/user-routes'
import { verifyToken } from '../utils/jwt'

const appClass = new AppManager(8080)
appClass.setRouter(sauceRoutes, userRoutes)
appClass.init()
const app = appClass.getExpress()

describe('GLOBAL ROUTES SUIT TESTS', () => {
    it('should return a 404 when use an unknowing route', async () => {
        const res = await supertest(app).get(`/ioyoiu`)
        expect(res.status).toBe(404)
    })
})

describe('USERS ROUTES SUIT TESTS', () => {
    beforeAll(async () => {
        const mongo = await MongoMemoryServer.create()
        await mongoose.connect(mongo.getUri())
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe('CREATE User', () => {
        it('should return a 400  passing invalid password', async () => {
            const res = await supertest(app)
                .post(`/api/auth/signup`)
                .send({
                    email: 'mail@mail.fr',
                    password: ''
                })
            expect(res.status).toBe(400)
        })

        it('should return a 400 passing empty strings', async () => {
            const res = await supertest(app)
                .post(`/api/auth/signup`)
                .send({
                    email: '',
                    password: ''
                })
            expect(res.status).toBe(400)
        })

        it('should return a 403 passing invalid email', async () => {
            const res = await supertest(app)
                .post(`/api/auth/signup`)
                .send({
                    email: '',
                    password: 'trzrDj-z0'
                })
            expect(res.status).toBe(400)
        })

        it('should return a 200 and a json passing valid email and password', async () => {
            const res = await supertest(app)
                .post(`/api/auth/signup`)
                .send({
                    email: 'mail@mail.fr',
                    password: 'trzrDj-z0'
                })
            expect(res.status).toBe(201)
            expect(res.body.message).toBe("Utilisateur créé")
        })

        it('should return a 400 and an error when passing existing user password ', async () => {
            const res = await supertest(app)
                .post(`/api/auth/signup`)
                .send({
                    email: 'mail@mail.fr',
                    password: 'trzrDj-z0'
                })
            expect(res.status).toBe(400)
            expect(res.body.error.errors.email.message).toContain("expected `email` to be unique.")

        })
    })

    describe('LOGIN', () => {

        const validUser = {
            email: 'mail@mail.fr',
            password: 'trzrDj-z0'
        }

        it('Should return 401 passing invalid email', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send({
                    email: 'aaa@mail.fr',
                    password: 'aaaa'
                })
            expect(res.status).toBe(401)
        })
        it('Should return error passing invalid email', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send({
                    email: 'aaa@mail.fr',
                    password: 'aaaa'
                })
            expect(res.body.error).toContain('Utilisateur non trouvé')
        })
        it('Should return the error passing valid email invalid password', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send({
                    email: 'mail@mail.fr',
                    password: 'aaaa'
                })
            expect(res.body.error).toContain('Mot de passe incorrect')
        })
        it('Should return 401 passing valid email invalid password', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send({
                    email: 'mail@mail.fr',
                    password: 'aaaa'
                })

            expect(res.status).toBe(401)
        })
        it('Should return 200 passing valid email and password', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send(validUser)
            expect(res.status).toBe(200)
        })
        it('Should return userId passing valid email and password', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send(validUser)
            expect(res.body.userId).toBeDefined()
        })
        it('Should return a valid mongoose user ID', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send(validUser)
            expect(mongoose.Types.ObjectId.isValid(res.body.userId)).toBe(true)
        })
        it('Should return a token', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send(validUser)
            expect(res.body.token).toBeDefined()
        })
        it('Token should be valid', async () => {
            const res = await supertest(app)
                .post('/api/auth/login')
                .send(validUser)
            const decodedToken: any = verifyToken(res.body.token)
            expect(decodedToken.userId).toEqual(res.body.userId)
        })


    })
})
