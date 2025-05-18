import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Ageentapproval = () => {
    const agent_info=JSON.parse(localStorage.getItem("agent_info"));
    const navigate=useNavigate();
    const handlelogout=()=>{
        const confirm_box=window.confirm("Are you sure?");
        if(confirm_box){
            localStorage.removeItem("agent_info");
            navigate("/login");
        }
    };
    useEffect(()=>{
           if(agent_info.status=="deactivated"){
               navigate("/agent/waiting-for-approval")
           }
          else if(agent_info.status=="activated"){
            navigate("/agent-dashboard")
           }else{
            navigate("/login")
           }
    },[])
  return (
    <section>
        <header className="w-full h-[12vh] bg-white shadow-sm border-b-[1px] flex justify-between items-center px-[100px] py-[20px] border-[#eee] ">
            <div className="logo">
                <img className='w-[100px] scale-[3]' src="https://eassypay.com/wp-content/uploads/2024/07/Eassy-Pay-Logo-Color.webp" alt="" />
            </div>
            <div className='flex justify-center items-center gap-[20px]'>
              <h2 className='text-[20px] font-[600]'>{agent_info.name}</h2>
              <button onClick={handlelogout} className='px-[22px] py-[12px] bg-[#4b7bec] text-[16px] font-[500]  text-white cursor-pointer rounded-[5px]'>Log Out</button>
            </div>
        </header>
        <section className='w-full h-[88vh] flex justify-center items-center'>
                <section className='w-[40%] h-auto text-center'>
                      <h1 className='text-[30px] font-[600]  bg-gradient-to-r from-blue-600  to-indigo-300 inline-block text-transparent bg-clip-text'>Hello {agent_info.name}</h1>
                      <h2 className='text-[18px] text-[#45aaf2] mb-[5px]'>{agent_info.email}</h2>
                      <p className='text-[16px] text-neutral-500 leading-[25px] mb-[10px]'>We have taken your registration information.Our community will check your information.If They get something wrong information your account will be reject.Our team will do it within 3day's.After approval you can Login to your account.</p>
                      <p className='text-[16px] text-black'>Waithing for approval</p>
                </section>
        </section>
    </section>
  )
}

export default Ageentapproval