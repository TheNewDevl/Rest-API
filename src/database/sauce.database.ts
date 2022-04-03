import Sauce from './models/Sauce'

/** Create one sauce in the Sauce DB collection */
export async function create(parsedBody: object, url: string): Promise<any> {
    return await Sauce.create({
        ...parsedBody,
        imageUrl: url
    })
}

/**  Return all Sauces in Sauce DB collection  */
export async function find() {
    return await Sauce.find()
}

/** Return one sauce from sauce DB using id param */
export async function findOne(id: string) {
    const findedSauce = await Sauce.findOne({ _id: id })
    if (findedSauce) {
        return findedSauce
    } else {
        throw 'Sauce non trouvée'
    }
}

export async function updateOne(sauceId: string, newData: object) {
    return await Sauce.updateOne({ _id: sauceId }, { ...newData, _id: sauceId })
}

export async function deleteOne(sauceId: string) {
    return await Sauce.deleteOne({ _id: sauceId })
}

export async function updateLikes(sauceId: string, newData: object) {
    return await Sauce.updateOne({ _id: sauceId }, newData)
}
