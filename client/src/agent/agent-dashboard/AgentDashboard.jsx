import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { NavLink, useNavigate } from 'react-router-dom';
 import { IoClose } from "react-icons/io5";
import { CgMenuLeftAlt } from "react-icons/cg";
import axios from 'axios'
import { FiLogOut } from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";
import { CgMenuRightAlt } from "react-icons/cg";
import { SiMoneygram } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import revenueData from 'data/revenueData';
import { Contextapi } from 'context/Appcontext';
import moment from "moment"
import { FaBangladeshiTakaSign } from "react-icons/fa6"
import { FcMoneyTransfer } from "react-icons/fc";
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import empty_image from "../../assets/empty_image.png"
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,Legend,BarChart,Bar,ResponsiveContainer,PieChart,Pie} from "recharts"
import toast, { Toaster } from 'react-hot-toast';
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiProfit } from "react-icons/gi";
const AgentDashboard = () => {

   const navigate=useNavigate();
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
     const [showmodal,setmodal]=useState(false);
       const admin_info=JSON.parse(localStorage.getItem("admin_data"));
      console.log(admin_info)
    function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
        useEffect(()=>{
     window.addEventListener("scroll",()=>{
      if(window.scrollY > 100){
             setactivetopbar(true)
      }else{
             setactivetopbar(false)
      }
     })
   },[]);
    function handlesidebar(){
        setactivesidebar(!activesidebar)
    }
    // -------------agent information
    const agent_info=JSON.parse(localStorage.getItem("agent_info"));
    const [agent_deposit_moneyinfo,setagent_deposit_moneyinfo]=useState([]);
   const [total_amount_of_deposit,settotal_amount_of_deposit]=useState();
   const [total_commission,settotal_comission]=useState();
   const [chart_data,setchart_data]=useState([]);
   const [agent_all_info,setagent_all_info]=useState([]);
   const [agent_withdraw_info,set_agent_withdraw_info]=useState([]);
     async function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`)
        .then((res)=>{
          setagent_deposit_moneyinfo(res.data.data);
          setagent_all_info(res.data.agent_information);
          set_agent_withdraw_info(res.data.find_agent_withdraw);
          console.log(res.data.find_agent_withdraw)
          const formattedData = res.data.data.map((transaction) => ({
                    timestamp: new Date(transaction.createdAt).toLocaleDateString(), // Format timestamp
                    amount: transaction.amount,
                }));
                setchart_data(formattedData)
          settotal_amount_of_deposit(res.data.total_amount_of_deposit);
          settotal_comission(res.data.total_commission);
        }).catch((err)=>{
          console.log(err)
        })
       }
    useEffect(()=>{
       agent_depositinfo();
    },[]);


    const [activetab,setactivetab]=useState(1);
    // download excell
    const downloadExcel = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL2}/download-excel/${agent_info._id}`, {
            responseType: 'blob', // Ensure the response is treated as a file
        });
        // Create a Blob from the response
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        link.click();
    } catch (error) {
        console.error('Error downloading the Excel file', error);
    }
};

// delete_deposit_data
const delete_deposit_data=(id)=>{
  const confirm_box=window.confirm("Are you sure?");
    if(confirm_box){
            axios.delete(`${process.env.REACT_APP_BASE_URL2}/agent-deposit-history-delete/${id}`)
    .then((res)=>{
            agent_depositinfo();
            toast.success("Agent has been deleted!");
    }).catch((err)=>{
        console.log(err)
    })
    }
}
  return (
    <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden':'w-0 md:w-[25%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
        </section>
        <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300':' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[80%] h-[100vh]'}>
        <Dashboradheader total_amount={total_amount_of_deposit}/> 
        <Toaster/>
       <section className='w-[100%] m-auto py-[20px] xl:py-[40px] px-[10px] lg:px-[20px]'>
        <div>
          <h1 className='text-[20px] lg:text-[33px] font-[600] mb-[8px]'>Dashboard</h1>
          <p className='text-[14px] lg:text-[16px] text-neutral-600'>Whole data about your business here</p>
        </div>
         <section className='w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-[10px] lg:gap-[20px] pt-[15px] lg:pt-[30px]'>
  {/* Deposit Box */}
  <div className='h-auto px-[15px] py-[20px] rounded-[5px] cursor-pointer shadow-md flex justify-start gap-[15px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0'>
    <div className='w-[70px] h-[70px] bg-white bg-opacity-20 rounded-full flex justify-center items-center'>
      <FaMoneyCheckDollar className='text-[25px] lg:text-[30px] text-indigo-500' />
    </div>
    <div>
      <h1 className='text-[18px] font-[600] mb-[5px]'>Deposit</h1>
      <p className='text-[18px] font-[600] flex justify-start items-center gap-[6px]'>
        <FaBangladeshiTakaSign className='text-[20px]' /> {agent_all_info.balance_in_bdt}
      </p>
      <p className="text-[14px] mt-[4px] flex justify-start items-center gap-[4px] font-[500]">
        USDT <BiTransfer className="text-[16px]" /> ${agent_all_info.balanceAmount}
      </p>
    </div>
  </div>

  {/* Limit Box */}
  <div className='h-auto px-[15px] py-[20px] rounded-[5px] cursor-pointer shadow-md flex justify-start gap-[15px] bg-gradient-to-r from-green-400 to-blue-500 text-white border-0'>
    <div className='w-[70px] h-[70px]  text-green-500 bg-white bg-opacity-20 rounded-full flex justify-center items-center'>
      <SiMoneygram className='text-[28px] ' />
    </div>
    <div>
      <h1 className='text-[18px] font-[600] mb-[5px]'>Limit</h1>
      <p className='text-[18px] font-[600] flex justify-start items-center gap-[5px]'>
        <FaBangladeshiTakaSign className='text-[20px]' />
        {agent_all_info.limitAmount > 0 ? <span>{agent_all_info.limitAmount}</span> : <span>0</span>}
      </p>
    </div>
  </div>

  {/* Remaining Limit Box */}
  <div className='h-auto px-[15px] py-[20px] rounded-[5px] cursor-pointer shadow-md flex justify-start gap-[15px] bg-gradient-to-r from-orange-400 to-red-500 text-white border-0'>
    <div className='w-[70px] h-[70px] bg-white text-orange-500 bg-opacity-20 rounded-full flex justify-center items-center'>
      <FaMoneyBillTrendUp className='text-[28px]' />
    </div>
    <div>
      <h1 className='text-[18px] font-[600] mb-[5px]'>Remaining Limit</h1>
      <p className='text-[18px] font-[600] flex justify-start items-center gap-[5px]'>
        <FaBangladeshiTakaSign className='text-[20px]' />
        {agent_all_info.limitRemaining > 0 ? <span>{agent_all_info.limitRemaining}</span> : <span>0</span>}
      </p>
    </div>
  </div>

  {/* Commission Box */}
  <div className='h-auto px-[15px] py-[20px] rounded-[5px] cursor-pointer shadow-md flex justify-start gap-[15px] bg-gradient-to-r from-blue-400 to-purple-600 text-white border-0'>
    <div className='w-[70px] h-[70px] bg-white bg-opacity-20 rounded-full flex justify-center items-center'>
      <GiProfit className='text-[28px] text-indigo-600' />
    </div>
    <div>
      <h1 className='text-[18px] font-[600] mb-[5px]'>Commission</h1>
      <p className='text-[18px] font-[600] flex justify-start items-center gap-[5px]'>
        <FaBangladeshiTakaSign className='text-[20px]' /> {total_commission}
      </p>
    </div>
  </div>
</section>

                {/* ----------------------transiction table--------------- */}
                <section className='w-full h-auto bg-white border-[1px] border-[#eee] border-dashed shadow-sm p-[20px] mt-[30px]'>
                 <section>
                  <div className="relative flex flex-col w-full h-full text-gray-700 bg-white  rounded-xl bg-clip-border no-scollbar">
  <div className="relative  mt-4 overflow-hidden text-gray-700 bg-white rounded-none no-scrollbar bg-clip-border  no-scollbar">
    <div className="w-full flex justify-between mb-[20px]">
      <div className='w-[80%]'>
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Recent Transactions
        </h5>
        <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          These are details about the last transactions.And It will be clear after 1 month.
        </p>
      </div>
      {/* <div className="flex  gap-2 shrink-0 md:w-max">
        <button onClick={downloadExcel} className="flex select-none items-center gap-3 rounded-lg bg-gray-900 px-[30px] h-[55px] text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3">
            </path>
          </svg>
          Download
        </button>
      </div> */}
    </div>
  </div>
  <div>
    <ul className='flex justify-start items-center'>
      <li onClick={()=>{setactivetab(1)}} className={activetab==1 ? "cursor-pointer bg-indigo-500 px-[10px] py-[7px] text-white rounded-[5px]":"cursor-pointer text-neutral-500  py-[7px]"}>Withdraw</li>
      <li onClick={()=>{setactivetab(2)}} className={activetab==2 ? " px-[10px] py-[7px] bg-indigo-500 text-white rounded-[5px]  cursor-pointer":"cursor-pointer text-neutral-500  py-[7px]"}>Deposit</li>
    </ul>
  </div>
<section className={activetab==1 ? "":"hidden"}>
   {
    agent_withdraw_info.length > 0 ?   <div className="mt-[20px] border-[1px] border-[#eee] px-0 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-indigo-500 dark:bg-gray-800">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-sm font-normal text-white  text-left rtl:text-righttext-white  dark:text-gray-400">
                  <div className="flex items-center gap-x-3">
                    <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                    <button className="flex items-center gap-x-2">
                      <span>Invoice Id</span>
                      <svg className="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Payer Number
                </th>
                  <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Transictiction ID
                </th>
                 <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
       {
        agent_withdraw_info.map((data,index)=>{
            return(
     <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  <div className="inline-flex items-center gap-x-3">
                    <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                   <NavLink to={`/agent-deposit-invoice/${data._id}`} className="hover:underline hover:text-indigo-600"> <span>#{data.paymentId}</span></NavLink>
                  </div>
                </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                   {data.agentAccount}
                </td>
                {/* <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">USDT</td> */}

                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.referenceId}</td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                   {data.expectedAmount}
                </td>
                {/* <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.expectedAmount}</td> */}
                  {/* <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    {
                        data.status=="pending" ?  <div className="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-red-100/60 dark:bg-gray-800">
                    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-sm font-normal">{data.status}</h2>
                  </div>: <div className="inline-flex items-center px-3 py-1 text-green-500 rounded-full gap-x-2 bg-green-100/60 dark:bg-gray-800">
                    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-sm font-normal">{data.status}</h2>
                  </div>
                    }
                 
                </td> */}
                {/* <td>
                  <div onClick={()=>{delete_deposit_data(data._id)}} className='p-[8px] cursor-pointer flex justify-center items-center w-auto text-neutral-500 hover:text-neutral-600 rounded-[5px] text-[20px]'>
                  <CgClose/>
                </div>
                </td> */}
              </tr>
            )
        })
       }
         
          
            </tbody>
          </table>
  </div>:<section className='w-full h-auto flex justify-center items-center p-[30px]'>
      <div>
        <img className='w-[200px] m-auto' src={empty_image} alt="" />
        <h1 className='text-[16px] lg:text-[25px] mt-[10px] font-[600]'>Your Transiction History Is Empty!</h1>
      </div>
  </section>
  }
</section>
<section className={activetab==2 ? "":"hidden"}>
  {
    agent_deposit_moneyinfo.length > 0 ?   <div className="mt-[20px] px-0 border-[1px] border-[#eee] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-indigo-500 dark:bg-gray-800">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  <div className="flex items-center gap-x-3">
                    <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                    <button className="flex items-center gap-x-2">
                      <span>Invoice Id</span>
                      <svg className="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Payer Number
                </th>
                <th scope="col" className="px-4 py-3.5  text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Method
                </th>
                  <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Transictiction ID
                </th>
                 <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Amount
                </th>
                 <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white  dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
       {
        agent_deposit_moneyinfo.map((data,index)=>{
            return(
     <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  <div className="inline-flex items-center gap-x-3">
                    <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                   <NavLink to={`/agent-deposit-invoice/${data._id}`} className="hover:underline hover:text-indigo-600"> <span>#{data.invoice_id}</span></NavLink>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {data.payer_number}
                </td>
              
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">USDT</td>
                <td className="px-4 py-4 text-sm whitespace-nowrap text-[#f7b731]">
                   {data.transiction_id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{data.amount}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    {
                        data.status=="pending" ?  <div className="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-red-100/60 dark:bg-gray-800">
                    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-sm font-normal">{data.status}</h2>
                  </div>: <div className="inline-flex items-center px-3 py-1 text-green-500 rounded-full gap-x-2 bg-green-100/60 dark:bg-gray-800">
                    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-sm font-normal">{data.status}</h2>
                  </div>
                    }
                 
                </td>
              </tr>
            )
        })
       }
         
          
            </tbody>
          </table>
  </div>:<section className='w-full h-auto flex justify-center items-center p-[30px]'>
      <div>
        <img className='w-[150px] lg:w-[200px] m-auto' src={empty_image} alt="" />
        <h1 className='text-[16px] lg:text-[25px] mt-[10px] font-[600]'>Your Transiction History Is Empty!</h1>
      </div>
  </section>
  }

</section>
</div>

                 </section>
                </section>
                {/* ------------------------------agent chart--------------------- */}
                   <section className='py-[20px] h-auto flex justify-between lg:flex-row flex-col  items-center gap-[20px] bg-white mt-[30px] p-[20px] border-[1px] border-[#eee] border-dashed shadow-md rounded-[5px]'>
                  <section className='w-[100%] lg:w-[60%] h-[300px] lg:h-[500px] pb-[70px] font-red_hat p-[20px] shadow-shadow_box mt-[30px] rounded-[10px] border-[1px] border-[#ebf1f6]'>
                   <div className='pb-[30px] flex justify-between items-center'>
                    <h1 className='text-[18px] font-[500]'>Total Deposit</h1>
                    <h1 className='font-[700] text-[17px] lg:text-[20px] font-space'>${total_amount_of_deposit}</h1>
                   </div>
               <ResponsiveContainer width="100%" h="100%">
               <AreaChart className='w-[100%]' data={chart_data}>
                    <YAxis/>
                    <XAxis dataKey="timestamp"/>
                    <CartesianGrid/>
                    <Tooltip/>
                    <Legend/>
                    <Area
                     dataKey="amount" 
                     type="monotone"
                     stroke="#7c3aed"
                     fill="#fed330"
                     />
                    </AreaChart>
               </ResponsiveContainer>
                  </section>
                  {/* <section className='w-[100%] lg:w-[40%] h-[300px] lg:h-[500px] p-[20px] shadow-shadow_box mt-[30px] rounded-[10px] border-[1px] border-[#ebf1f6]'>
                 <div className='flex justify-between items-center '>
                   <h1 className='text-[18px] font-[500]'>Total Share</h1>
                   <h2 className='font-[700] text-[17px] lg:text-[20px] font-space'>$20,303,003</h2>
                 </div>
                  <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={agent_withdraw_info.amount} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#4b7bec" />
        </PieChart>
      </ResponsiveContainer>
                  </section> */}
                 
                   </section>
       </section>
        </section>
    </section>
  )
}

export default AgentDashboard