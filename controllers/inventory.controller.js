const Inventory = require("../config/Inventory.config");
const User = require("../config/dealer.config"); // Assuming you have a User model

const getInvByID = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await Inventory.findById(id);

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        // You may also want to ensure the inventory item belongs to the user
        res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getInvByUsername = async (req, res) => {
    const { username } = req.params; // Get the username from the route parameters
    try {
        // Step 1: Find the user by their username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 2: Find all inventory items associated with this user
        const inventories = await Inventory.find({ dealer: user._id }).populate('dealer', 'username');
        
        // Step 3: Return the inventory items
        res.status(200).json(inventories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const addInv = async (req, res) => {
    try {
        const { username } = req.params; // Correctly extract the username from the route parameters

        // Step 1: Find the dealer by username
        const dealer = await User.findOne({ username });
        if (!dealer) {
            return res.status(404).json({ message: "Dealer not found." });
        }

        // Step 2: Create the inventory item and associate it with the dealer
        const inventoryData = {
            ...req.body,
            dealer: dealer._id // Associate the inventory with the dealer's ID
        };
        const inventory = await Inventory.create(inventoryData);

        // Step 3: Return the created inventory item
        res.status(201).json({ message: "Successfully added to your Inventory", inventory });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send("Car ID must be unique. This Car ID already exists.");
        } else {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    }
};

const updateInv = async (req, res) => {
    try {
        const { id, username } = req.params; // Get the inventory ID and username from the route parameters
        const updates = req.body; // Get the updated data from the request body

        // Step 1: Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Step 2: Find the inventory item by ID and ensure it belongs to the user
        const inventory = await Inventory.findOne({ _id: id, dealer: user._id });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found or does not belong to the user" });
        }

        // Step 3: Update the inventory item with the new data
        Object.assign(inventory, updates);

        // Step 4: Save the updated inventory item
        await inventory.save();

        // Step 5: Return the updated inventory item
        res.status(200).json({ message: "Inventory updated successfully", inventory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
const removeInv = async (req, res) => {
    try {
        const { id, username } = req.params; // Get the inventory ID and username from the route parameters

        // Step 1: Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Step 2: Find the inventory item by ID and ensure it belongs to the user
        const inventory = await Inventory.findOne({ _id: id, dealer: user._id });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found or does not belong to the user" });
        }

        // Step 3: Remove the inventory item
        await Inventory.deleteOne({ _id: id });

        // Step 4: Return a success message
        res.status(200).json({ message: "Inventory item removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getInvByID, addInv, getInvByUsername, updateInv, removeInv };
