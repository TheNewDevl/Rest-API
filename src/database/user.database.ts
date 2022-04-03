import User from './models/User'

export async function createUser(email: string, hashKey: string): Promise<any> {
    return User.create({
        email: email,
        password: hashKey
    })
}

export async function loginUser(email: string): Promise<any> {
    const findedUser = await User.findOne({ email: email })
    if (findedUser) {
        return findedUser
    } else {
        throw 'Utilisateur non trouvé'
    }
}