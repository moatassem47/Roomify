const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const mongoosePaginate=require("mongoose-paginate-v2")

const addressSchema= new mongoose.Schema({
  city:{
    type:String,
    required:true,
    uppercase: true,
  },
  streetAddress:{
    type:String,
    required:true
  }
},{ _id: false })

const deliverySchema= new mongoose.Schema({
vehicleType: {
            type: String,
            required: function() { return this.parent && this.parent().role === 'delivery'; }
        },
        licensePlate: {
            type: String,
            required: function() { return this.parent && this.parent().role === 'delivery'; }
        },
        deliveryStatus: {
            type: String,
            enum: ["available", "busy", "offline"],
            default: "offline",
            required: function() { return this.parent && this.parent().role === 'delivery'; }
        }
    
},{ _id: false })



const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim: true,
         uppercase: true,
        
    },
     lastName:{
        type:String,
        required:true,
        trim: true,
         uppercase: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim: true
    },
    password:{
        type:String,
        minLength:8,
        required:true
    },
     phone:{
        type:String,
        minLength:11,
        required:true,
        validate:{
            validator:(v)=>{
                return  /^01[0-9]{9}$/.test(v);
            },
            message:"Phone must contain only numbers"
        }
    },
    role:{
        type:String,
        enum:["admin","delivery","customer"],
        default:"customer"
    },
    address:addressSchema,
    deliveryDetails:deliverySchema,
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date,
    refreshToken: String,
    wishlist: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
]
},
{
    timestamps:true,
})

userSchema.plugin(mongoosePaginate)

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,12);
})

userSchema.pre("save",async function(){
    if(!this.isModified("isDeleted")) return ;
    this.deletedAt=Date.now();
})

const User=mongoose.model("User",userSchema)

module.exports=User