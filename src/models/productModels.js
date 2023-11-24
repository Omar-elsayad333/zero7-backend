const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    genderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
      required: true,
    },
    colors: [
      {
        colorId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Color",
        },
        sizes: [
          {
            sizeId: {
              ref: "Size",
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
            quantity: {
              type: Number,
              requierd: true,
            },
          },
        ],
        images: {
          type: [String],
          required: true,
          validate: [
            (urls) => urls.length <= 3,
            "images array cannot have more than 3 items",
          ],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        value: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
