import  mongoose from "mongoose";

const Agent_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
       email:{
        type:String,
        required:true
    },
    accountNumber:{
        type:String,
        required:true
    },
       password:{
        type:String,
        required:true
    },
    nid_or_passport:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"deactivated"
    },
    balanceAmount:{
        type:Number,
        default:0
    },
    balance_in_dollar:{
        type:Number,
        default:0     
    },
    balance_in_bdt:{
        type:Number,
        default:0     
    },
    limitAmount:{
         type:Number,
        default:0
    },
        limitRemaining:{
         type:Number,
        default:0
    },
    merchant_name:{
        type:String,
        default:""
    },
    update_by:{
      type:String,
      default:""
    }
},{timestamps:true});

const Agent_model=mongoose.model("Agent",Agent_schema);
 export default Agent_model;