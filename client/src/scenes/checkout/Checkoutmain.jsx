import React, {useState, useRef, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { paymentApi } from 'state/api';
import { capitalize } from 'utilities/CommonUtility';
import { FaClipboard } from 'react-icons/fa';
import { nanoid } from "nanoid";
import axios from "axios"
const Checkoutmain = () => {
   const navigate = useNavigate();
  const textFieldRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [agentAccount, setAgentAccount] = useState('8809876543210');
  const [payerAccount, setPayerAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paidStatus, setPaidStatus] = useState(0); // 0: initial, 1: success, 2: fail
  const [payerAccountError, setPayerAccountError] = useState('');
  const [transactionIdError, setTransactionIdError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [walletNumber,set_walletnumber] = useState();
  const {paymentId}=useParams();
  console.log(paymentId)
    
  // ------------random agent number
  const [random_agent,set_radom_agent]=useState([]);
  const random_agent_number=()=>{
      axios.get(`${process.env.REACT_APP_BASE_URL}/user/checkout-page-agent/merchant1`)
      .then((res)=>{
        console.log(res.data);
        set_radom_agent(res.data)
        set_walletnumber(res.data.accountNumber)
      }).catch((err)=>{
        console.log(err)
      })
  }
  useEffect(()=>{
       random_agent_number();     
  },[])
  const handleCopy = () => {
    navigator.clipboard.writeText(walletNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
   useEffect(() => {
     setIsLoading(true);
 
     paymentApi.payment()
       .checkout({ paymentId })
       .then(res => {
         if (res.data.success) {
           setProvider(res.data.data.provider);
           setAmount(res.data.data.amount);
           setCurrency(res.data.data.currency);
           setAgentAccount(res.data.data.agentAccount);
         } else {
           Swal.fire({
             icon: 'error',
             title: 'Error!',
             text: res.data.message,
             showConfirmButton: true,
           });
           setPaidStatus(2);
         }
         setIsLoading(false);
       })
       .catch(err => {
         Swal.fire({
           icon: 'error',
           title: 'Error!',
           text: err.message,
           showConfirmButton: true,
         });
         setPaidStatus(2);
         setIsLoading(false);
       });
   }, [paymentId]);

console.log(paymentId)
  const handlePayerAccountChange = (e) => {
    setPayerAccount(e.target.value);
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
    if (!transactionId && !e.target.value) {
      setTransactionIdError('Please enter a transaction ID.');
    } else {
      setTransactionIdError('');
    }
  };

  const handleSubmit = async () => {
    if (!payerAccount || !/^[0-9]{11}$/.test(payerAccount)) {
      setPayerAccountError('Please enter a valid account number.');
    } else {
      setPayerAccountError('');
    }

    if (!transactionId) {
      setTransactionIdError('Please enter a transaction ID.');
    } else {
      setTransactionIdError('');
    }

    if (!payerAccount || payerAccountError || !transactionId || transactionIdError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }
//  paymentApi.payment()
      // .paymentSubmit({ paymentId, provider, agentAccount, payerAccount, transactionId })
       axios.post(`${process.env.REACT_APP_BASE_URL}/payment/paymentSubmit`,{paymentId, provider:"bkash", agentAccount:walletNumber, payerAccount, transactionId })
      .then(res => {
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your payment is received.',
            showConfirmButton: true,
          });
          setPaidStatus(1);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.data.message,
            showConfirmButton: true,
          });
          if (res.data.type === 'tid') {
            setTransactionIdError(res.data.message);
          } else if (res.data.type === 'pid') {
            setPaidStatus(2);
          }
        }
        console.log(res)
        setIsLoading(false);
      })
      .catch(err => {
       console.log(err)
      });
  };

  const handleCancel = async () => {
    Swal.fire({
      icon: 'warning',
      title: 'Redirecting...',
      text: 'You are being redirected to your website.',
      showConfirmButton: true,
    });
    window.location = '/';
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Main Container */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-800 text-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl flex flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="w-full md:w-2/3 bg-white text-gray-800 p-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-center tracking-wide text-gray-800">
            Payment  BDT in Bkash
          </h2>

          {/* Wallet Number */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Wallet No <span className="block text-sm text-gray-500">ওয়ালেট নম্বর</span>
            </label>
            <div className="flex items-center  rounded-lg p-2 bg-gray-100 shadow-inner">
              <input
                type="text"
                value={walletNumber}
                readOnly
                className="w-full bg-transparent border-none text-gray-800 outline-none"
              />
              <button
                onClick={handleCopy}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <FaRegCopy size={20} />
              </button>
              {isCopied && (
                <span className="ml-2 text-sm text-green-500">Copied!</span>
              )}
            </div>
          </div>

          {/* Wallet Provider */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Wallet Provider
              <span className="block text-sm text-gray-500">ওয়ালেট প্রদানকারী</span>
            </label>
            <div className="border flex justify-start items-center text-[17px] rounded-[5px] h-[50px] px-[20px] bg-gray-100 shadow-inner">
              Bkash Cashout
            </div>
          </div>

          {/* Payer Account No */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Payer Account No*
              <span className="block text-sm text-gray-500">পেয়ার অ্যাকাউন্ট নম্বর</span>
            </label>
            <input
              type="text"
              value={payerAccount}
              onChange={handlePayerAccountChange}
              placeholder="Payer account number"
              className="w-full border border-neutral-300 rounded-[5px] h-[50px] p-2 outline-none bg-gray-100 shadow-inner"
            />
            {payerAccountError && <p className="text-red-500 text-xs mt-1">{payerAccountError}</p>}

          </div>

          {/* Transaction ID */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Transaction ID*
              <span className="block text-sm text-gray-500">লেনদেন নম্বর</span>
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={handleTransactionIdChange}
              placeholder="Case sensitive"
              className="w-full border border-neutral-300 rounded-[5px] h-[50px] p-2 outline-none bg-gray-100 shadow-inner"
            />
            {transactionIdError && <p className="text-red-500 text-xs mt-1">{transactionIdError}</p>}

          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button            onClick={handleCancel} className="px-[30px] py-[13px] bg-red-600 text-white rounded-[5px] hover:bg-red-400">
              CANCEL
            </button>
            <button               onClick={handleSubmit} className="px-[30px] py-[13px] bg-yellow-400 text-gray-900 font-bold rounded-[5px] hover:bg-yellow-500">
              SUBMIT
            </button>
          </div>
        </div>

        {/* Right Section - Bkash Cashout and Warning */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Bkash Cashout</h3>
          <p className="text-sm leading-relaxed mb-6">
            দয়া করে মনে রাখবেন যে আপনি Bkash Cashout এ আমানত করবেন। নিশ্চিত হন যে
            আপনি একই ওয়ালেট থেকে অর্থপ্রদান করেছেন, অন্যথায় এটি হারিয়ে যেতে পারে।
          </p>

          <h3 className="text-xl font-semibold mb-4">Warning সতর্কতা</h3>
          <p className="text-sm leading-relaxed">
            Please note that you make a deposit to Bkash Cashout. Be sure that you
            make the payment from the same wallet, otherwise it may be lost.
            <br />
            <br />
            Please make sure that your deposit amount must be at least <strong>300.00 BDT</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkoutmain;
