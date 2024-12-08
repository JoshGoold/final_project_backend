const bcrypt = require("bcrypt")


async function hashPassword(password){
    if (typeof password !== 'string' || password.trim() === '') {
        throw new Error("Invalid password input. Must be a non-empty string.");
    }    
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
        console.error("Error hashing password: ",error)
    }

}

module.exports = hashPassword;