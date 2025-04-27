const Price = require("../config/price.config");

const getPrice = async(req,res) =>{
    const { name , model , color } = req.body;
    try {
        const item = await Price.find({});
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addOrUpdatePrice = async (req, res) => {
    const { name, model, color, costPrice } = req.body; // Get name, model, color, and costPrice from the request body

    try {
        // Check if the item already exists
        const existingItem = await Price.findOne({ name, model, color });

        if (existingItem) {
            // If the item exists, update its costPrice
            existingItem.costPrice = costPrice;
            await existingItem.save(); // Save the updated item

            return res.status(200).send("Price Updated");
        } else {
            // If the item doesn't exist, create a new one
            const newItem = await Price.create(req.body);
            return res.status(201).send("New Car Added");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};




module.exports = {getPrice,addOrUpdatePrice};