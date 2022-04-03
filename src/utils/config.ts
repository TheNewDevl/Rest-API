const config = {

    get PORT(): number {
        if (process.env.PORT === undefined) {
            throw new Error("You must specify PORT");
        } else {
            return parseInt(process.env.PORT)
        }
    },

    get LOG(): string {
        if (process.env.LOG === undefined) {
            throw new Error("You must specify mongo uri");
        } else {
            return process.env.LOG
        }
    },

    get KEY(): string {
        if (process.env.KEY === undefined) {
            throw new Error("You must specify mongo key");
        } else {
            return process.env.KEY
        }

    },

    get NODE_ENV(): string {
        if (process.env.NODE_ENV === undefined) {
            throw new Error("You must specify mongo node_env");
        } else {
            return process.env.NODE_ENV
        }
    }
}

export default config