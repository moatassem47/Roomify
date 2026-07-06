const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      uppercase: true,
    },
    streetAddress: {
      type: String,
    },
  },
  { _id: false },
);

const deliverySchema = new mongoose.Schema(
  {
    vehicleType: {
      type: String,
      required: function () {
        return this.parent && this.parent().role === "delivery";
      },
    },
    licensePlate: {
      type: String,
      required: function () {
        return this.parent && this.parent().role === "delivery";
      },
    },
    deliveryStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline",
      required: function () {
        return this.parent && this.parent().role === "delivery";
      },
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      default: null,
      select: false,
    },
    phone: {
      type: String,
      minLength: 11,
      validate: {
        validator: (v) => {
          return /^01[0-9]{9}$/.test(v);
        },
        message: "Phone must contain only numbers",
      },
    },
    role: {
      type: String,
      enum: ["admin", "delivery", "customer"],
      default: "customer",
    },
    address: addressSchema,
    deliveryDetails: deliverySchema,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    refreshToken: {
      type: String,
      select: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    providers: {
      type: [String],
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      select: false,
    },

    verificationExpires: Date,
    
    passwordResetToken: {
      type: String,
      select: false,
    },
   
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongoosePaginate);

userSchema.pre("save", async function () {
  if (this.role === "admin" || this.role === "delivery") {
    this.isVerified = true;
    this.verificationToken = undefined;
    this.verificationExpires = undefined;
  }
});

userSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  const role = update?.role || update?.$set?.role;

  if (role === "admin" || role === "delivery") {
    this.set({
      isVerified: true,
      verificationToken: undefined,
      verificationExpires: undefined,
    });
  }
});

userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre("save", async function () {
  if (!this.isModified("isDeleted")) return;
  this.deletedAt = Date.now();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
