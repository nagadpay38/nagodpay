import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import { Box, useTheme, Button, useMediaQuery } from "@mui/material";
import { useGetApiAccountBkashQuery, generalApi } from "state/api";
import Header from "components/Header";
import { NavLink } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { IoFilter } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import empty_img from "../../assets/empty.png"
import { GoEye } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
// import { merchantTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from "../bkash/Edit"
import Add from "../bkash/Add";
import Swal from 'sweetalert2';
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
const Agent = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

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
const [count_num,setcount_num]=useState(1)
function agent_data(){
    axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-data`)
    .then((res)=>{
        setagent_information(res.data.agent)
        setpending_agent(res.data.pending_agent);
        setallagent(res.data.all_agent)
    }).catch((err)=>{
        console.log(err)
    })
}
useEffect(()=>{
agent_data()
},[])
// delete_agent
const delete_agent = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // If confirmed, make the delete request
            axios.delete(`${process.env.REACT_APP_BASE_URL2}/agent-delete/${id}`)
                .then((res) => {
                    agent_data(); // Call your agent data refresh function
                    toast.success("Agent has been deleted!");
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Failed to delete agent!");
                });
        } else {
            // If canceled, do nothing
            console.log('Delete action was canceled');
        }
    });
};
const [panding_agent,setpending_agent]=useState([])
const [approved_agent,setapproved_agent]=useState([])
const [all_agnet,setallagent]=useState([])



const [find_agent,setfind_agent]=useState("");
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
    
    {/* Main Content */}
    {
        agent_information.length > 0 ?     <section className="p-[20px]">
               <div className="flex justify-between items-center">
               <div>
                 <h1 className="text-[22px] font-[600] mb-[5px]">Agent Monitoring</h1> 
                <p className="text-[16px] text-neutral-500 font-[400]">Agent Information Live Update</p>
               </div>
               <Toaster/>
               <div className="flex justify-center items-center gap-[15px]">
                {/* <button className="px-[22px] py-[12px] border-[2px] bg-white hover:text-white border-[#5D87FF] flex justify-center items-center gap-[8px] text-[15px] text-[#5D87FF] hover:bg-[#5D87FF] transition-all duration-150 cursor-pointer rounded-[5px]">Export</button> */}
                <NavLink to="/numbers">
                <button className="px-[22px] py-[14px] bg-[#5D87FF] flex justify-center items-center gap-[8px] text-[15px] text-white cursor-pointer rounded-[5px]">Create Agent</button>
                </NavLink>
                
               </div>
               </div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-[20px] gap-[20px]">
  {/* All Agents Box */}
  <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-[5px] p-[20px] shadow-sm">
    <div className="flex justify-start gap-[20px]">
      <div className="w-[60px] h-[60px] rounded-[10px] flex justify-center items-center bg-white text-[22px] text-teal-600">
        <FaUserAlt />
      </div>
      <div>
        <h1 className="text-[16px] font-[600] text-white">All Agents</h1>
        <h2 className="text-[20px] mt-[5px] text-white font-[600]">+{agent_information?.length}</h2>
      </div>
    </div>
  </div>

  {/* Approved Agents Box */}
  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-[5px] p-[20px] shadow-sm">
    <div className="flex justify-start gap-[20px]">
      <div className="w-[60px] h-[60px] rounded-[10px] flex justify-center items-center bg-white text-[22px] text-yellow-600 ">
        <FaUserAlt />
      </div>
      <div>
        <h1 className="text-[16px] font-[600] text-white">Approved Agents</h1>
        <h2 className="text-[20px] mt-[5px] text-white font-[600]">+{agent_information?.length}</h2>
      </div>
    </div>
  </div>

  {/* Pending Agents Box */}
  <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-[5px] p-[20px] shadow-sm">
    <div className="flex justify-start gap-[20px]">
      <div className="w-[60px] h-[60px] rounded-[10px] flex justify-center items-center bg-white text-[22px] text-cyan-600 ">
        <FaUserAlt />
      </div>
      <div>
        <h1 className="text-[16px] font-[600] text-white">Pending Agents</h1>
        <h2 className="text-[20px] mt-[5px] text-white font-[600]">+{panding_agent?.length}</h2>
      </div>
    </div>
  </div>

  {/* Canceled Agents Box */}
  <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-[5px] p-[20px] shadow-sm">
    <div className="flex justify-start gap-[20px]">
      <div className="w-[60px] h-[60px] rounded-[10px] flex justify-center items-center bg-white text-[22px] text-red-600 ">
        <FaUserAlt />
      </div>
      <div>
        <h1 className="text-[16px] font-[600] text-white ">Canceled Agents</h1>
        <h2 className="text-[20px] mt-[5px] text-white font-[600]">0</h2>
      </div>
    </div>
  </div>
</section>

                   {/* ------------------agent filtering option------------ */}
               <div className="w-full flex justify-between items-center mt-[40px] py-[20px]">
                {/* --------------search filed----------- */}
                    {/* <div className="flex justify-center items-center gap-[15px]">
                    <div className="px-[25px]  h-[55px] bg-[#6A3FFF] flex justify-center items-center gap-[8px] text-[17px] text-white cursor-pointer rounded-[5px]">
                         <IoFilter className="text-[20px]"/>
                         <span>Filters</span>
                    </div>
                    <div className=" h-[55px]">
                        <select name="" id="" className="w-full px-[20px] h-[100%] border-[1px] border-[#eee] rounded-[5px] p-[10px] text-[18px]">
                            <option value="">All</option>
                            <option value="">Highest</option>
                            <option value="">Low</option>
                        </select>
                    </div>
                 </div> */}
                {/* -------------------agrnt fileter-------------- */}
{/* <div className=" w-[40%]">   
  <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg className="w-4 h-4 t
ext-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
      </svg>
    </div>
    <input type="search" onChange={(e)=>{setfind_agent(e.target.value)}} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by number,name..." required />
   <div className=" absolute top-0 right-0 p-[5px] w-[20%] h-[100%] flex justify-center items-center">
    <button type="submit" className="w-[100%] h-[100%] bg-[#6A3FFF] hover:bg-blue-800 focus:ring-4 text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>

   </div>
  </div>
</div> */}

                {/* ----------------search filed-------------- */}
             
               </div>
                   {/* ------------------agent filtering option------------ */}
                   {/* -------------------------agnet information----------------- */}

<section className="w-full px-[20px] pb-[100px]">
  <div className="flex flex-col">
    <div className="-mx-4 -my-2 overflow-x-auto">
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-[5px]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead className="bg-[whitesmoke] dark:bg-gray-800">
    <tr>
      <th className="px-4 py-[10px] font-[600] text-left text-nowrap uppercase text-sm text-table_title dark:text-gray-300">
        Serial Id
      </th>
      <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
        Agent
      </th>
      <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
        Status
      </th>
      <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-medium text-table_title dark:text-gray-300">
        Balance
      </th>
      <th className="px-4 py-2 text-left text-nowrap uppercase text-sm font-[600] text-table_title dark:text-gray-300">
        Action
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y font-poppins divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
    {agent_information.length > 0 ? (
      agent_information
        .map((data, index) => (
          <tr key={index}>
            <td className="px-4 py-[10px] text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
              <div className="inline-flex items-center gap-x-3">
                <input
                  type="checkbox"
                  className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                />
                <span className="text-[16px] text-orange-500">#{index + 1}</span>
              </div>
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
              <div className="flex  gap-x-4">
                <img
                  className="object-cover w-[50px] h-[50px] rounded-[5px] border-[1px] border-[#eee]"
                  src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${data.name}`}
                  alt="Agent"
                />
                <div>
                  <h2 className="text-[16px] font-[600] text-gray-800 capitalize dark:text-white">{data.name}</h2>
                  <p className="text-[15px]  text-gray-600 dark:text-gray-400 font-[600]">{data.accountNumber}</p>
                  {
                    data.updated_by==""? "":<p className="  text-orange-600 mt-[5px] text-[14px]   dark:text-gray-400 font-[600]">Updated By: <span>{data?.updated_by}</span></p>
                  }
                </div>
              </div>
            </td>
<td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
  {data.status === "deactivated" ? (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={false}
        // onChange={() => updateStatus(data._id, "activated")} // Replace with your status update logic
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 dark:bg-gray-700 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
      <span className="ml-3 text-sm font-medium text-red-500 dark:text-red-400">Inactive</span>
    </label>
  ) : (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={true}
        // onChange={() => updateStatus(data._id, "deactivated")} // Replace with your status update logic
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:bg-gray-700 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
      <span className="ml-3 text-sm font-medium text-green-500 dark:text-green-400">Active</span>
    </label>
  )}
</td>


            <td className="px-4 py-4 text-[16px] font-[600] text-gray-500 dark:text-gray-300 whitespace-nowrap">
               {data.balance_in_bdt <  100 ? <span className="text-red-500">৳{data.balance_in_bdt}</span>:<span className="text-green-500">৳{data.balance_in_bdt}</span>}
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                 <div className="flex justify-start items-center gap-[12px] relative">
                  {/* View Button with Tooltip */}
                  <NavLink to={`/agent-details/${data._id}`} className="w-[45px] h-[40px]  border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                    <GoEye className="text-[20px]" />
                   <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
    View
    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
  </span>
                  </NavLink>

                  {/* Edit Button with Tooltip */}
                  {/* <div className="w-[30px] h-[30px]  border border-gray-300 rounded-[5px] hover:text-brand_color flex justify-center items-center text-[15px] cursor-pointer hover:border-brand_color dark:border-gray-700 dark:hover:bg-gray-800 group relative">
                    <CiEdit className="text-[20px]" />
                    <span className="absolute hidden group-hover:block bottom-[35px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs font-medium rounded px-2 py-0.5 z-10">
                      Edit
                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>

                    </span>
                  </div> */}

                  {/* Delete Button with Tooltip */}
              <div onClick={()=>{delete_agent(data._id)}} className="w-[45px] h-[40px]   border border-gray-300 rounded-[5px] hover:text-indigo-500 flex justify-center items-center text-[15px] cursor-pointer hover:border-indigo-500 dark:border-gray-700 dark:hover:bg-gray-800 group relative">
  <MdDeleteOutline className="text-[20px]"/>
  <span className="absolute hidden group-hover:block bottom-[50px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-[15px] font-medium rounded px-2 py-0.5 z-10">
    Delete
    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-indigo-500"></span>
  </span>
</div>

                </div>
              {/* <div className="flex items-center gap-x-6">
                <NavLink to={`/agent-details/${data._id}`}>
                  <button className="transition-colors duration-200 p-[12px] rounded-[5px] bg-[#6A3FFF] text-[23px] text-white dark:hover:text-indigo-500 dark:text-gray-300 hover:text-indigo-500 focus:outline-none">
                    <FaRegEdit />
                  </button>
                </NavLink>
                <button
                  onClick={() => {
                    delete_agent(data._id);
                  }}
                  className="p-[12px] transition-colors duration-200 rounded-[5px] bg-[#eb3b5a] text-[23px] text-white hover:text-indigo-500 focus:outline-none"
                >
                  <MdOutlineDelete />
                </button>
              </div> */}
            </td>
          </tr>
        ))
    ) : (
      <tr>
        <td colSpan={5} className="px-4 py-4 flex justify-center items-center text-center text-gray-500 dark:text-gray-300">
          <div>
            <img className="w-[200px] block m-auto" src={empty_img} alt="No Data" />
            <h2 className="text-[18px] text-center font-[500] text-neutral-500">No Data Found!</h2>
          </div>
        </td>
      </tr>
    )}
  </tbody>
</table>

        </div>
      </div>
    </div>
  </div>
  {/* <div className="flex items-center justify-between mt-6">
    <a href="#" className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
      </svg>
      <span>
        previous
      </span>
    </a>
    <div className="items-center hidden md:flex gap-x-3">
      <a href="#" className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">1</a>
      <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">2</a>
      <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">3</a>
      <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">...</a>
      <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">12</a>
      <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">13</a>
      <a href="#" className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">14</a>
    </div>
    <a href="#" className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
      <span>
        Next
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
      </svg>
    </a>
  </div> */}
</section>

                   {/* -------------------------agent information------------------- */}
         </section>:<section className="w-full h-screen flex justify-center items-center">
           <div>
              <img className='w-[200px] block m-auto' src={empty_img} alt="" />
              <h2 className='text-[18px] font-[600] text-center text-neutral-500'>No Data Found</h2>
             </div>
         </section>
      }
  </Box>
</Box>

 
   </>
  );
};

export default Agent;
