const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, 
    description: { type: String, required: true }, 
    //group_id: { type: mongoose.Schema.Types.ObjectId,ref: 'Group',unique: true  },
    permissions: { type: [String], required: false },
    status: { type: Boolean,default: true},
    isDeleted: { type: Boolean, default: false }, 
    created_by: { type: String, required: false },
    updated_by: { type: String, required: false },
  },
  {
    timestamps: true, 
  }
);

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = RoleModel;
