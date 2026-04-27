const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const mongoosePaginate=require("mongoose-paginate-v2")

const addressSchema= new mongoose.Schema({
  city:{
    type:String,
    required:true
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
        trim: true
    },
     lastName:{
        type:String,
        required:true,
        trim: true
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
    refreshToken: String
},
{
    timestamps:true,
})

userSchema.plugin(mongoosePaginate)

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,12);
})

const User=mongoose.model("User",userSchema)

module.exports=User