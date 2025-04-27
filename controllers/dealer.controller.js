const Dealer = require("../config/dealer.config")

const getDealers = async(req,res) => {
    try {
        const dealers = await Dealer.find({});
        res.json(dealers);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {getDealers};