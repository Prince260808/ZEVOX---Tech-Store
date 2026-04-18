import Cart from "../models/Cart.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    // Try incrementing if item already exists
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $inc: { "items.$.quantity": quantity } },
      { new: true }
    );

    // If item was NOT found, push new item
    if (!updatedCart) {
      await Cart.findOneAndUpdate(
        { userId },
        {
          $push: { items: { productId, quantity } },
        },
        { upsert: true }
      );
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity <= 0) {
      // Auto-remove if quantity is 0
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      ).populate("items.productId");

      return res.json({
        success: true,
        message: "Item removed from cart",
        cart,
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    ).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart or item not found" });
    }

    res.json({
      success: true,
      message: "Item quantity updated",
      cart,
    });
  } catch (error) {
    console.error("UPDATE QUANTITY ERROR:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.json(cart || { userId, items: [] });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
