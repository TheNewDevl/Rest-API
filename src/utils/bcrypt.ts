import bcrypt from 'bcrypt'

export async function crypt(password: string): Promise<any> {
    return await bcrypt.hash(password, 10)
}

export async function decrypt(refPassword: string, passwordToTest: string) {
    const succes = await bcrypt.compare(refPassword, passwordToTest)
    if (!succes) {
        throw "Mot de passe incorrect";
    }
}