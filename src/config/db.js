const mongoose = require("mongoose")
const config = require("./config.json")

module.exports = conect_db = async () => 
{
    try {

        await mongoose.connect(config.DB_PARTH, () => {
            console.log("conected to db");
        })

    } catch (error) {
        console.log("out: ", error.message);
    }
}