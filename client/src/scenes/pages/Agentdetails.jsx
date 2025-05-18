import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment"
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
// import { merchantTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from "../bkash/Edit"
import Add from "../bkash/Add";
import Swal from 'sweetalert2';
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import empty_img from "../../assets/empty.png"

const Agentdetails = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
const admin_info=JSON.parse(localStorage.getItem("admin_info"));

  useEffect(() => {
    if (authUser === null || authUser.role === "merchant" || authUser.role === "subadmin") {
      navigate('/login');
    }
  }, [authUser])

  const { data, isLoading, refetch } = useGetApiAccountBkashQuery();
  
  
  useEffect(() => {
    if (!isAdding && !isEditing) {
      refetch();
    }
  }, [isAdding, isEditing]);
// --------------------agent data
const [agent_information,setagent_information]=useState([]);
const {id}=useParams();
  const [imageUrl, setImageUrl] = useState("");

useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-details/${id}`)
    .then((res)=>{
        console.log(res);
        setagent_information(res.data.agent);
        setImageUrl(res.data.agent.nid_or_passport)
    }).catch((err)=>{
        console.log(err)
    })
},[])
// -----------agent all info
    const [agent_deposit_moneyinfo,setagent_deposit_moneyinfo]=useState([]);
   const [total_amount_of_deposit,settotal_amount_of_deposit]=useState();
   const [total_commission,settotal_comission]=useState();
   const [chart_data,setchart_data]=useState([]);
   const [agent_all_info,setagent_all_info]=useState([]);
   const [agent_withdraw_info,set_agent_withdraw_info]=useState([]);
     async function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${id}`)
        .then((res)=>{
          setagent_deposit_moneyinfo(res.data.data);
          setagent_all_info(res.data.agent_information);
          set_agent_withdraw_info(res.data.find_agent_withdraw);
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
const downloadImage = () => {
    const imageUrl = "http://localhost:6001/images/1736942429620_banner1.fd06e9e854e421dd9c72.jpg"; // Replace with the dynamic image URL

    // Create a temporary anchor element for downloading the image
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target="_blank";
    link.download = "downloaded-image.jpg"; // The name of the downloaded file
    
    // Append the link to the DOM (required for the link to work)
    document.body.appendChild(link);

    // Trigger the download by programmatically clicking the link
    link.click();

    // Clean up by removing the link from the DOM after the click
    document.body.removeChild(link);
};




// ------------------update agent--------------
const approve_agent=()=>{
  const confirm_box=window.confirm("Are you sure?");
  if(confirm_box){
    axios.put(`${process.env.REACT_APP_BASE_URL2}/agent-update/${id}`,{admin_name:admin_info.name})
    .then((res)=>{
        toast.success(res.data.message)
    }).catch((err)=>{
        console.log(err)
    })
  }

}

// --------download document---------------
  return (
   <>
    <Box 
  display={{ xs: "block", sm: "flex" }} 
  sx={{ display: "flex", justifyContent: 'space-between' }} 
  width="100%" 
>
  {/* Sidebar */}
<Sidebar
  user={authUser || {}}
  isNonMobile={isNonMobile}
  drawerWidth={{
    xs: "100%", // Sidebar takes full width on small screens
    sm: isSidebarOpen ? "25%" : "0%" // 25% width when sidebar is open on larger screens, 0% when closed
  }}
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

  {/* Main content area */}
  <Box 
    sx={{
      width: {
        xs: "100%", // Full width on small screens
        sm: isSidebarOpen ? "75%" : "100%" // 75% width when sidebar is open on large screens, 100% when closed
      },
    }}
  >
    {/* Navbar */}
    <Navbar
      user={authUser || {}}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />
      {/* ------------------------agent information------------------- */}
       <section className="w-full p-[30px] bg-[#F5F7FA] h-auto no-scrollbar">
          <div>
            <h2 className="text-[14px] text-neutral-400">Dashboard / Customers / {agent_information.name}</h2>
          </div>
          <Toaster/>
          <div className="py-[20px] flex justify-between items-center">
            <h1 className="text-[25px] font-[600]">{agent_information.name}</h1>
              {
                agent_information.status=="deactivated" ?  <div className="flex justify-center items-center gap-[10px]">
                <button className="px-[25px] py-[10px] text-[16px] cursor-pointer text-white bg-[#5D87FF]"onClick={approve_agent}>Approve</button>
                {/* <button className="px-[25px] py-[10px] text-[16px] cursor-pointer text-white bg-[#EB3B5A]">Delete</button> */}
            </div>: <div className="flex justify-center items-center gap-[10px]">
                {/* <button className="px-[25px] py-[10px] text-[16px] cursor-pointer text-white bg-[#5D87FF]">Edit</button> */}
                {/* <button className="px-[25px] py-[10px] text-[16px] cursor-pointer text-white bg-[#EB3B5A]">Delete</button> */}
{imageUrl ? (
        <>
          {/* Display the image */}
          {/* Download button */}
          <button
            onClick={downloadImage}
            className="px-6 py-3 text-white bg-[#e84118] rounded hover:bg-[#c23616] transition-all duration-200"
          >
            Download NID Copy
          </button>
        </>
      ) : (
        <p className="text-gray-500">Loading image...</p>
      )}          
      </div>
              }
           
          </div>
          {/* ------------------------profile information------------------------ */}
          <section className="flex justify-center gap-[20px]">
              <section className="w-[30%] p-[20px] relative h-[100%] bg-white border-[1px] border[#eee] ">
                      <div className="absolute top-[2%] left-[2%] px-[15px] py-[5px] text-[13px] text-white bg-[#5D87FF] rounded-[25px] flex justify-center gap-[5px] items-center ">
                        <h2>Balance</h2>
                        <h2>:</h2>

<h2>{agent_information?.deposit_amount || 0}</h2>

                      </div>
                      <div className=" pb-[20px]">
                        <img className="w-[100px] block m-auto h-[100px] rounded-full" src="https://www.aiscribbles.com/img/variant/large-preview/9570/?v=5528a6" alt="" />
                         <h2 className="text-[18px] font-[600] mt-[15px] text-center text-[#212529]">{agent_information.name}</h2>
                         <h3 className="text-[15px] font-[600] mt-[2px] underline text-center text-[#4b7bec]">{agent_information.email}</h3>
                         <h4 className="text-[13px] font-[600] mt-[5px]  text-center text-neutral-600">{agent_information.phone}</h4>
                      </div>
                      <div className="py-[20px] border-t-[1px] border-[#eee]">
                         <div className="grid grid-cols-2 gap-[20px] mb-[10px]">
                            <h1 className="text-[15px] ">Address :</h1>
                            <h1 className="text-[15px] text-neutral-600">Dhaka</h1>
                         </div>
                            <div className="grid grid-cols-2 gap-[20px] mb-[10px]">
                            <h1 className="text-[15px] ">Status :</h1>
                            <h1 className="text-[15px] text-neutral-600">{agent_information.status}</h1>
                         </div>
                            <div className="grid grid-cols-2 gap-[20px] mb-[10px]">
                            <h1 className="text-[15px] ">Account Created :</h1>
                            <h1 className="text-[15px] text-neutral-600">             {moment(agent_information?.createdAt).fromNow()}</h1>
                         </div>
              
                      </div>
              </section>
              <section className="w-[70%] h-auto ">
    <div className="w-full h-auto bg-white border-[1px] border[#eee] p-[20px]">
                       <h2 className="text-[18px] font-[600] mb-[15px]">Deposit Histroy</h2>
                

{
  agent_deposit_moneyinfo.length > 0 ? <div className="relative overflow-x-auto">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-[1px] border-[#eee] border-dashed dark:text-gray-400 ">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Payer ID
        </th>
        <th scope="col" className="px-6 py-3">
          Payer Number
        </th>
        <th scope="col" className="px-6 py-3">
          Amount
        </th>
        <th scope="col" className="px-6 py-3">
          Receving Number
        </th>
      </tr>
    </thead>
    <tbody>
      {
        agent_deposit_moneyinfo.map((data)=>{
          return(
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-indigo-400 whitespace-nowrap dark:text-white">
          #{data.invoice_id}
        </th>
        <td className="px-6 py-4">
          {data.payer_number}
        </td>
        <td className="px-6 py-4">
          ৳ {data.amount}
        </td>
        <td className="px-6 py-4">
          {data.agent_number}
        </td>
      </tr>
          )
        })
      }
    </tbody>
  </table>
</div>:<section className="w-full flex justify-center items-center p-[20px]">
      <div>
        <img className="w-[100px]" src={empty_img} alt="" />
        <h1>No deposit Found.</h1>
      </div>
</section>
}
    </div>
   {
    agent_withdraw_info.length > 0 ?  <div className="w-full h-auto bg-white border-[1px] border[#eee] p-[20px] mt-[20px]">
                       <h2 className="text-[18px] font-[600] mb-[15px]">Withdraw Histroy</h2>
                

<div className="relative overflow-x-auto">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-[1px] border-[#eee] border-dashed dark:text-gray-400 ">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Pament ID
        </th>
        <th scope="col" className="px-6 py-3">
          Payer Number
        </th>
        <th scope="col" className="px-6 py-3">
          Agent Number
        </th>
        <th scope="col" className="px-6 py-3">
          Amount
        </th>
      </tr>
    </thead>
<tbody>
  {
    agent_withdraw_info.map((data)=>{
      return(
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-indigo-400 whitespace-nowrap dark:text-white">
          #{data.pamentId}
        </th>
        <td className="px-6 py-4">
         {data.agentAccount}
        </td>
        <td className="px-6 py-4">
          {data.payerAccount}
        </td>
        <td className="px-6 py-4">
         ৳ {data.expectedAmount}
        </td>
      </tr>
      )
    })
  }
    

    </tbody>
  </table>
</div>
    </div>:<section className="w-full flex justify-center items-center p-[20px]">
      <div>
        <img className="w-[100px]" src={empty_img} alt="" />
        <h1>No Withdraw Found.</h1>
      </div>
</section>
   }
              </section>
          </section>

          {/* ------------------------profile information------------------------ */}
      </section>
           <section className="w-full py-[20px] border-t-[1px] bg-[#F5F7FA] border-[#eee]">
           <p className="text-[16px] text-neutral-600 text-center">All Copyright reserved by EassyPay</p>
      </section>
      {/* ------------------------agent information------------------- */}
      </Box>
    </Box>
   
 
   </>
  );
};

export default Agentdetails;
