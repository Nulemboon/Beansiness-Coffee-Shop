const ToppingModel = require('../models/ToppingModel');
const mongoose = require('mongoose');

class ToppingController {
    getAllTopping = async (req, res) => {
        try {
            const toppings = await ToppingModel.find();
            if (!toppings || toppings.length === 0) {
                res.status(404).json({ message: "No Topping Available"});
                return;
            }
            res.json(toppings);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching toppings.' });
        }
    };
    
    getToppingById = async (req, res) => {
        try {
            
            const topping = await ToppingModel.findById(req.params.id);
            if (!topping) {
                res.status(404).json({message: 'Topping not found.' });
                return;
            }

            res.status(200).json(topping);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the topping.' });
        }
    };

    createTopping = async (req, res) => {
        try {
            const { name, price } = req.body;
            const newTopping = new ToppingModel({
                name,
                price
            });

            const saveTopping = await newTopping.save();
            res.status(200).json(saveTopping);
        } catch (error) {
            res.status(500).json({ error: 'Unable to create topping: ' + error.message });
        }
    };

    updateTopping = async (req, res) => {
        try {
            const toppingId = req.params.id;
            const { updateData } = req.body;

            // Validate toppingId
            if (!mongoose.Types.ObjectId.isValid(toppingId)) {
                res.status(400).json({message: 'Invalid topping Id.' });
                return;
            }

            // Find and update the product by ID with only the specified fields
            const updateTopping = await ToppingModel.findByIdAndUpdate(toppingId, updateData, { new: true, runValidators: true });

            if (!updateTopping) {
                res.status(404).json({ message: 'Topping not found' });
                return;
            }

            res.status(200).json(updateTopping);
        } catch (error) {
            res.status(500).json({ error: 'Unable to update topping: ' + error.message });
        }
    };

    // Delete Product
    deleteTopping = async (req, res) => {
        try {
            const toppingId = req.params.id;

            // // Validate toppingId
            if (!mongoose.Types.ObjectId.isValid(toppingId)) {
                res.status(400).json({message: 'Invalid topping Id.' });
                return;
            }

            // Delete product
            const deletedTopping = await ToppingModel.findByIdAndDelete(toppingId);

            if (!deletedTopping) {
                res.status(404).json({ message: 'Topping not found' });
                return;
            }

            res.status(200).json(deletedTopping);
        } catch (error) {
            res.status(500).json({ error: 'Unable to delete Topping: ' + error.message });
        }
    };
}

module.exports = new ToppingController();