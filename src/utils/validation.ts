type sauce = {
    _id: string,
    userId: string,
    name: string,
    manufacturer: string,
    description: string,
    mainPepper: string,
    imageUrl: string,
    heat: number,
    likes: number,
    dislikes: number,
    usersLiked: string[],
    usersDisliked: string[]
}

export class Validation {

    password(password: string): boolean {
        /** Check if password is strong enough */
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.;,:_-])[A-Za-z0-9.;,:_-]{8,30}$/gm
        if (regexPassword.test(password)) {
            return true
        } else {
            throw 'Mot de passe invalide ! Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    }

    /** Check if input email is valid */
    email = (email: string): boolean => {
        const regexEmail = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i

        if (regexEmail.test(email)) {
            return true
        } else {
            throw 'Email invalide !'
        }
    }

    /** Check if input is a number and only accepts -1,0,1  */
    likeNumber = (likeNumber: number): boolean => {
        if (likeNumber >= -1 && likeNumber <= 1 && typeof likeNumber === 'number') {
            return true
        } else {
            throw 'Le like doit être un nombre compris entre -1 et 1'
        }
    }

    /** Return true if usersLiked[] ou usersDisliked[] contain userId  */
    alreadyLikeOrDisliked = (sauce: sauce, userId: string): void => {
        if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) {
            throw 'Vous avez déjà donné votre avis sur cette sauce !'
        }
    }

    notLikeOrDislikedYet = (sauce: sauce, userId: string): void => {
        if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
            throw 'Vous n\'avez pas encore donné votre avis sur cette sauce !'
        }
    }

    heat = (heat: number): boolean => {
        if (typeof heat === 'number' && heat >= 0 && heat <= 10) {
            return true
        }
        throw 'Doit être un chiffre entre 0 et 10'
    }

    name = (name: string): boolean => {
        if (/^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(name) && typeof name === 'string') {
            return true
        }
        throw 'Doit être un nom de sauce valide'
    }

    manufacturer = (manufacturer: string): boolean => {
        if (/^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(manufacturer) && typeof manufacturer === 'string') {
            return true
        }
        throw 'Doit être un nom de fabriquant valide'
    }

    description = (description: string): boolean => {
        if (/^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(description) && typeof description === 'string') {
            return true
        }
        throw 'Doit être une description valide'
    }

    mainpepper = (mainPepper: string): boolean => {
        if (/^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(mainPepper) && typeof mainPepper === 'string') {
            return true
        }
        throw 'Doit être un nom de piment principal valide'
    }
}
