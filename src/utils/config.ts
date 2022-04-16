import dotenv from 'dotenv'
dotenv.config()

const config = {

    get PORT(): number {
        return parseInt(this.getKey('PORT'))
    },

    get LOG(): string {
        return this.getKey('LOG')
    },

    get KEY(): string {
        return this.getKey('KEY')
    },

    get NODE_ENV(): string {
        return this.getKey('NODE_ENV')
    },

    getKey(key: string): string {
        const thisKey: string | undefined = process.env[key]
        if (thisKey === undefined) {
            throw new Error(`You must specify ${key}`);
        } else {
            return thisKey
        }
    }

}

export default config