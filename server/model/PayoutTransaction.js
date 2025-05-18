import mongoose from "mongoose";

const PayoutTransactionSchema = new mongoose.Schema(
  {
    paymentId: String,
    merchant: String,
    provider: String, // BKASH Personal, NAGAD Personal, Rocket Personal, Upay Personal
    orderId: String,
    payeeId: String,
    payeeAccount: String,
    agentAccount: String,
    transactionId: String,
    requestAmount: Number,
    sentAmount: Number,
    balanceAmount: Number,
    callbackUrl: String,
    sentCallbackDate: Date,
    currency: {
      type: String,
      enum: ["BDT", "INR", "USD"],
      default: "BDT",
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "success", "rejected", "failed"],
      default: "pending",
    },
    transactionDate: Date,
    statusDate: Date,
    mode: {
      type: String,
      enum: ["test", "live"],
      default: "live",
    },
    update_by:{
      type:String,
      default:""
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set to 1 month (30 days) from now
      expires: 0, // TTL index for automatic deletion
    },
  },
  { timestamps: true }
);

// Creating a text index for full-text search (optional)
PayoutTransactionSchema.index({
  merchant: "text",
  mode: "text",
  transactionId: "text",
  orderId: "text",
  paymentId: "text",
  provider: "text",
  agentAccount: "text",
  payeeAccount: "text",
  payeeId: "text",
  status: "text",
});

// Model creation
const PayoutTransaction = mongoose.model("PayoutTransaction", PayoutTransactionSchema);
export default PayoutTransaction;
