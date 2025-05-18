import PayinTransaction from "../model/PayinTransaction.js";
import User from "../model/User.js";
import axios from 'axios';
import { nanoid } from 'nanoid';
import crypto from 'crypto';
import ApiAccountBkash from "../model/ApiAccountBkash.js";
import merchant_model from "../model/Merchnatmodel.js";
import { createPayment, executePayment } from 'bkash-payment';

const bkashConfig = {
  base_url : 'https://tokenized.pay.bka.sh/v1.2.0-beta',
  username: '01711799891',
  password: 'b8t|m:1I|oF',
  app_key: 'bMk6yA8dUSi1RjEKjURQablGtc',
  app_secret: 'qbl6yK033pPGUeKyJFs2oppUPPeNyJHZn62oOOkMaU3qA0GecnEC'
}

function generate256Hash(data) {
  // Use SHA256 to generate a hash
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

export const payment_bkash = async (req, res) => {
  const apiKey = req.headers['x-api-key']?req.headers['x-api-key']:'';
  const data = req.body;
  if (!data.mid || !data.orderId || !data.payerId || !data.amount || !data.currency || !data.redirectUrl || !data.callbackUrl) { //
    return res.status(200).json({
      success: false,
      orderId: data.orderId,
      message: "Required fields are not filled out."
    })
  }

  if ((data.currency === "BDT" || data.currency === "INR") && parseFloat(data.amount) < 1) {
    return res.status(200).json({
      success: false,
      orderId: data.orderId,
      message: `Minimum deposit amount should be at least 150 for ${data.currency} currency.`
    })
  } else if (data.currency === "USD" && parseFloat(data.amount) < 10) {
    return res.status(200).json({
      success: false,
      orderId: data.orderId,
      message: "Minimum deposit amount should be at least 10 for USD currency."
    })
  }

  try {
    const merchant = await User.findOne({name: data.mid, status: 'activated'});
    if (data.mid !== 'merchant1' && (!merchant || merchant.apiKey !== apiKey)) {
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "There is not existing activated merchant with API key"
      })
    }
    
    const payinTransaction = await PayinTransaction.findOne({
			orderId: data.orderId,
      merchant: data.mid
		});
		if (payinTransaction) {
      console.log('same order id for payment', data.orderId, payinTransaction.status);
			return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Transaction with duplicated order id, " + data.orderId + "."
      });  
		}

    const apiAccountBkash = await ApiAccountBkash.findOne({ status: 'activated' });
    console.log('accountNumber', apiAccountBkash);
    if(!apiAccountBkash) {
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "There is no available Bkash API account."
      });
    }
    if (data.mid !== 'merchant1' && !apiAccountBkash) {
      console.log('there is no activated bkash api account');
			return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "There is no available Bkash API account."
      });
    }

    const referenceId = nanoid(16); // uuidv4();
    console.log('referenceId', referenceId);

    const paymentDetails = {
      amount: data.amount,
      callbackURL: data.callbackUrl,
      orderID: data.orderID || 'Order_101',
      reference: referenceId || '1'
    }
    const createObj =  await createPayment(bkashConfig, paymentDetails)

    console.log('bkash-payment-create-resp', createObj);
     const create_user_pament = new merchant_model({
     merchant_name: data.mid,
     player_id:data.payerId,
     website_url: data.redirectUrl
     });
     if(create_user_pament){
      create_user_pament.save();
     }
    if (createObj.statusCode && createObj.statusCode === '0000') {
      await PayinTransaction.create({
        paymentId: createObj.paymentID,
        merchant: data.mid,
        agentAccount: apiAccountBkash.accountNumber,
        provider: 'bkash',
        orderId: data.orderId,
        payerId: data.payerId,
        expectedAmount: data.amount,
        currency: data.currency,
        redirectUrl: data.redirectUrl,
        callbackUrl: data.callbackUrl,
        referenceId,
        submitDate: new Date(),
        paymentType: 'p2c'
      }); 

      return res.status(200).json({
        success: true,
        message: "Payment link created.",
        orderId: data.orderId,
        paymentId: createObj.paymentID,
        link: createObj.bkashURL
      })
    } else {
      console.log('bkash-payment-create-fail', createObj.errorCode, createObj.errorMessage);
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Internal Error"
      }); 
    }

  } catch (e) {
    res.status(500).json({
      success: false,
      orderId: data.orderId,
      message: e.message
    });
  }
};

export const callback_bkash = async (req, res) => {
  const data = req.body;
  try {
    const transaction = await PayinTransaction.findOne({paymentId: data.paymentID});
		if (!transaction) {
      console.log('bkash-callback-no-transaction-with-paymentID', data.paymentID);
			return res.status(200).json({
        success: false,
        message: "There is no transaction with provided payment ID, " + data.paymentID + "."
      });
		}

    const executeObj = await executePayment(bkashConfig, data?.paymentID);

    if (executeObj.statusCode && executeObj.statusCode === '0000') { {
        let transaction_status = 'processing';
        if (executeObj.transactionStatus === 'Completed') {
          transaction_status = 'fully paid';
        } else if (executeObj.transactionStatus === 'Pending Authorized') {
          transaction_status = 'hold';
        } else if (executeObj.transactionStatus === 'Expired') {
          transaction_status = 'expired';
        } else if (executeObj.transactionStatus === 'Declined') {
          transaction_status = 'suspended';
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = executeObj.trxID;
        transaction.receivedAmount = executeObj.amount;
        transaction.payerAccount = executeObj.customerMsisdn;
        transaction.sentCallbackDate = new Date();
        await transaction.save();
        
        if (transaction.callbackUrl && (transaction.status === 'fully paid' || transaction.status === 'expired' || transaction.status === 'suspended')) {
          const merchant = await User.findOne({name: transaction.merchant, role: 'merchant'});
          if (!merchant) throw Error('Merchant to callback does not exist');
        }
        res.status(200).json({
          success: false,
          data: transaction,
          message: "Transaction completed successfully"
        });
      }

    } else if (executeObj.errorCode) {
      console.log('bkash-payment-execute-fail', executeObj.errorCode, executeObj.errorMessage);      
      
      if (transaction.status !== 'pending') {
        console.log('bkash-callback-transaction-already-done');
        return; 
      }

      const currentTime = new Date();
      transaction.status = 'suspended';
      transaction.statusDate = currentTime;
      transaction.sentCallbackDate = new Date();
      await transaction.save();
      
      const merchant = await User.findOne({name: transaction.merchant, role: 'merchant'});
      if (!merchant) throw Error('Merchant to callback does not exist');
      res.status(400).json({
        success: false,
        data: transaction,
        message: "Transaction suspended"
      });
    }

  } catch (e) {
    console.log('bkash-callback-error', e.message);
    return res.status(500).json({
      success: false,
      message: e.message ?? "Something went wrong"
    });
  }
};