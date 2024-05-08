const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String],
    },
    image: {
        type: String,
        default: null,
    },
    file: {
        type: String,
        default: null,
    },
    },
    {
        timestamps: true,
    }
);

TodoSchema.index({ text: "text" });

module.exports = mongoose.model("Todo", TodoSchema);