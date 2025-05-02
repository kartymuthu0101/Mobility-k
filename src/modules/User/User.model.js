const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String },
    passwordHash: { type: String, required: true }, 
    status: { type: Boolean, default: true }, 
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    isDeleted: { type: Boolean, default: false }, 
    createdBy: { type: Date }, 
    updatedBy: { type: Date },
}, {
    timestamps: true 
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
    next();
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;