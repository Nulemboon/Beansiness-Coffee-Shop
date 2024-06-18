const ProductModel = require("../models/ProductModel");
const ReviewModel = require("../models/ReviewModel");

class ReviewController {
    addReview = async (req, res) => {
        try {
            const { productId } = req.params;
            const { accountId, review, rating } = req.body;

            const newReview = ReviewModel({
                review: review,
                rating: rating,
                account_id: accountId
            });
            
            const savedReview = newReview.save();

            const product = await ProductModel.findById(productId);
            product.reviews.push(savedReview._id);

            await product.save();

            res.status(200).json({ message: 'Review has been added successfully'})

        } catch(error) {
            res.status(500).json({ message: 'Unable to add review'});
        }
    }

    removeReview = async (req, res) => {
        try {
            const { productId } = req.params;
            const { reviewId } = req.body;

            const product = await ProductModel.findById(productId);

            if (!product) {
              return { error: 'Product not found' };
            }
        
            product.reviews = product.reviews.filter(id => id.toString() !== reviewId.toString());
            await product.save();
        
            await ReviewModel.findByIdAndDelete(reviewId);
        
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch(error) {
            res.status(500).json({ message: 'Unable to delete review'});
        }
    }
}

module.exports = new ReviewController;