import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Contextapi } from 'context/Appcontext';
import Dashboardleftside from 'components/agentcomponents/Dashboardleftside';
import Dashboradheader from 'components/agentcomponents/Dashboardheader';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineMailOutline } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import axios from "axios"
const Agentprofile = () => {
   const navigate=useNavigate();
       const agent_info=JSON.parse(localStorage.getItem("agent_info"));
     const {activesidebar,setactivesidebar,activetopbar,setactivetopbar}=useContext(Contextapi);
     const [showmodal,setmodal]=useState(false);
     const [copynumber,setcopynumber]=useState("01688494105")
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
   const [agent_phone,setagent_phone]=useState("");
   const [agent_email,setagent_email]=useState("");
   const [agent_password,setagent_password]=useState("");
   useEffect(()=>{
      setagent_phone(agent_info.accountNumber);
      setagent_email(agent_info.email);
      setagent_password(agent_info.password)
   },[]);

      const [agent_all_info,setagent_all_info]=useState([]);
      function agent_depositinfo(){
        axios.get(`${process.env.REACT_APP_BASE_URL2}/agent-deposit/${agent_info._id}`)
        .then((res)=>{
          setagent_all_info(res.data.agent_information);
        }).catch((err)=>{
          console.log(err)
        })
       }
    useEffect(()=>{
       agent_depositinfo();
    },[]);
  return (
    <section className='w-full h-[100vh] flex font-poppins'>
        <section className={activesidebar ? 'lg:w-[7%] h-[100vh] transition-all duration-300 overflow-hidden':'w-0 md:w-[25%] transition-all duration-300 h-[100vh]'}>
            <Dashboardleftside/>
            <Toaster/>
        </section>
        <section className={activesidebar ? 'w-[100%] lg:w-[93%] h-[100vh] bg-[#EFEFFD] overflow-y-auto transition-all duration-300':' transition-all bg-[#EFEFFD] duration-300 w-[100%] overflow-y-auto md:w-[75%] h-[100vh]'}>
        <Dashboradheader/> 
       <section className='w-[100%] m-auto py-[20px] xl:py-[20px] px-[10px] lg:px-[20px]'>
        <h1 className='text-[17px] font-[500] mb-[20px] bg-white w-full px-[20px] py-[15px] rounded-[5px] shadow-md'>Profile <span>Overview</span></h1>
                <section className='w-full h-auto p-[20px] bg-white shadow-lg rounded-[5px] flex justify-start  gap-[20px] '>
                        <div className='p-[2px] border-[2px] border-[#eee] rounded-[5px]'>
                          <img className='w-[200px] h-[200px] rounded-[5px] ' src={`https://robohash.org/${agent_all_info?.name}.png`} alt="" />
                        </div>
                        <div>
                          <h2 className='text-[20px] font-[600] mb-[5px]'>{agent_all_info.name}</h2>
                          {/* <h3 className="text-[16px] text-indigo-500 py-[5px]">Merchant : {agent_all_info.merchant_name}</h3> */}
                          <div className='flex justify-start items-center gap-[5px] text-[16px] text-neutral-500'>
                         <MdOutlineMailOutline/>
                         <span>{agent_all_info.email}</span>
                          </div>
                          {/* --------------------- */}
                            <div className='pt-[20px] flex gap-[20px]'>
                              {/* <div className='w-auto p-[10px] border-[2px] border-indigo-400  rounded-[5px] flex justify-center items-center gap-[10px]'>
                                <div className='w-[50px] h-[50px] bg-[#E5F6FF] rounded-full flex justify-center items-center text-[22px] text-[#4F46E5]'>
                                  <FaDollarSign/>
                                </div>
                                <div>
                                  <h2 className='text-[20px] font-[700] mb-[5px]'>৳ 0</h2>
                                  <h3 className='text-[17px] text-neutral-500 font-[600]'>Total Withdraw</h3>
                                </div>
                              </div> */}
                                       <div className='w-auto p-[10px] border-[2px] border-[#eee]  rounded-[5px] flex justify-center items-center gap-[10px]'>
                                <div className='w-[50px] h-[50px] bg-[#E5F6FF] rounded-full flex justify-center items-center text-[22px] text-[#4F46E5]'>
                                  ৳
                                </div>
                                <div>
                                  <h2 className='text-[20px] font-[700] mb-[5px]'>৳ {agent_all_info.balance_in_bdt}</h2>
                                  <h3 className='text-[17px] text-neutral-500 font-[600]'>Deposit Amount</h3>
                                </div>
                              </div>

                            </div>
                          {/* ----------------- */}
                        </div>
                </section>
                {/* ---------------profile information------------------- */}
                         <section className='w-full h-full flex justify-center mt-[20px] bg-white shadow-lg rounded-[5px]'>
                            <section className='w-[20%] h-full border-r-[1px] bprder-[#eee] p-[10px]'>
                                    <ul className='block'>
                                      <li className='text-[18px] font-[500] p-[15px] bg-[#818CF8] rounded-[5px] text-white mb-[10px] cursor-pointer'>Information</li>
                                 </ul>
                            </section>
                            <section className='w-[80%] h-[100%] p-[20px]'>
                                    <div>
                                      <h1 className='text-[20px] font-[600] mb-[10px]'>Your Information</h1>
                                      <form action="">
                                       <div className="w-[100%] mt-[15px]">
                                        <label htmlFor=""className='text-[16px] text-neutral-700'>Phone</label><br />
                                        <input type="number"placeholder='Enter your phone'value={agent_phone} disabled className='w-full bg-[whitesmoke] mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                                        </div>
                                      <div className="w-[100%] mt-[15px]">
                                        <label htmlFor=""className='text-[16px] text-neutral-700'>Email</label><br />
                                        <input type="email"placeholder='Enter your email'value={agent_email} onChange={(e)=>{setagent_email(e.target.value)}} className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                                        </div>
                                  <div className=" w-[100%] mt-[15px]">
                            <label htmlFor=""className='text-[16px] text-neutral-700'>Password</label><br />
                              <input type="password"placeholder='Enter your password'value={agent_password} onChange={(e)=>{setagent_password(e.target.value)}}className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                                                     </div>
            <button className='px-[40px] flex justify-center mt-[15px] items-center gap-[10px] py-[13px] w-auto bg-[#4F46E5] text-[17px] text-white'>Update</button>
                                      </form>
                                    </div>
                            </section>
                         </section>
                {/* ---------------profile information------------------- */}
       </section>
        </section>
    </section>
  )
}

export default Agentprofile