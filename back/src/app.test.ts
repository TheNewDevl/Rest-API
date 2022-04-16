import supertest from 'supertest'
import { AppManager } from './app'
import sauceRoutes from './routes/sauce-routes'
import userRoutes from './routes/user-routes'
import fs from 'fs'


const appClass = new AppManager(8080)
appClass.setRouter(sauceRoutes, userRoutes)
appClass.init()
appClass.setImgDir()
const app = appClass.getExpress()

describe('GLOBAL ROUTES SUIT TESTS', () => {
    it('should return a 404 when use an unknowing route', async () => {
        const res = await supertest(app).get(`/ioyoiu`)
        expect(res.status).toBe(404)
    })

    it('Should return true because the folder img was created by app method', () => {
        const dir: string = './images';
        expect(fs.existsSync(dir)).toBe(true)
    })
})
