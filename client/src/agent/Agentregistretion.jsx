import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const Agentregistretion = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [phone, setphone] = useState("");
    const [file, setfile] = useState();
    const [errortext, seterrortext] = useState("");
    const navigate = useNavigate();

    const validateName = (name) => {
        return name.length >= 4 && name.length <= 15;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8 && password.length <= 16;
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+8801|8801|01)[3-9]\d{8}$/;
        return phoneRegex.test(phone);
    };

    const validateFile = (file) => {
        if (!file) return false;
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        return allowedTypes.includes(file.type);
    };

    const handleform = (e) => {
        e.preventDefault();

        if (!validateName(name)) {
            seterrortext("Name must be between 4 and 10 characters.");
            return;
        }

        if (!validateEmail(email)) {
            seterrortext("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            seterrortext("Password must be between 8 and 16 characters.");
            return;
        }

        if (!validatePhone(phone)) {
            seterrortext("Please enter a valid Bangladeshi mobile number.");
            return;
        }

        if (!validateFile(file)) {
            seterrortext("Please upload a valid image file (JPEG/PNG) and ensure it's within the required dimensions.");
            return;
        }

        seterrortext(""); // Clear error if all validations pass

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("phone", phone);
        formdata.append("file", file);

        axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-registration`, formdata)
            .then((res) => {
                if (res.data.success === true) {
                    toast.success("Registration Successful 🎉🎉");
                    localStorage.setItem("agent_info", JSON.stringify(res.data.agent_info));
                    setTimeout(() => {
                        navigate("/agent/waiting-for-approval");
                    }, 1000);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                toast.error(err.name);
            });
    };

    return (
        <section className='w-full h-[100vh] bg-[#F8F9FD] flex justify-center items-center'>
            <Toaster />
            <section className='w-[95%] md:w-[85%] lg:w-[70%] xl:w-[60%] h-auto bg-white border-[1px] border-[#eee] shadow-md p-[20px]'>
                <div className='text-center'>
                    <img className='w-[80px] lg:w-[100px] xl:w-[200px] m-auto mb-[15px]' src="https://eassypay.com/wp-content/uploads/2024/07/Eassy-Pay-Logo-Color.webp" alt="" />
                    <h1 className='text-[20px] lg:text-[25px] font-[600] mb-[20px]'>Agent Registration Form</h1>
                </div>
                <form onSubmit={handleform}>
                    <div className='flex gap-[15px] mb-[15px] lg:flex-row flex-col'>
                        <div className="w-[100%] lg:w-[50%]">
                            <label htmlFor="" className='text-[16px] text-neutral-700'>Name</label><br />
                            <input type="text" placeholder='Enter your name' onChange={(e) => { setname(e.target.value) }} className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                        </div>
                        <div className="w-[100%] lg:w-[50%]">
                            <label htmlFor="" className='text-[16px] text-neutral-700'>Email</label><br />
                            <input type="text" placeholder='Enter your email' onChange={(e) => { setemail(e.target.value) }} className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                        </div>
                    </div>
                    <div className='flex gap-[15px] mb-[15px]  lg:flex-row flex-col '>
                        <div className="w-[100%] lg:w-[50%]">
                            <label htmlFor="" className='text-[16px] text-neutral-700'>Password</label><br />
                            <input type="password" placeholder='**********' onChange={(e) => { setpassword(e.target.value) }} className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                        </div>
                        <div className="w-[100%] lg:w-[50%]">
                            <label htmlFor="" className='text-[16px] text-neutral-700'>Phone</label><br />
                            <input type="number" placeholder='+880' onChange={(e) => { setphone(e.target.value) }} className='w-full mt-[5px] appearance-none border-[1px] border-[#eee] rounded-[2px] h-[55px] p-[15px] text-[17px] text-neutral-600' />
                        </div>
                    </div>
                    <div className="w-[100%] ">
                        <label htmlFor="" className='text-[16px] text-neutral-700'>NID / Passport Copy <span className='text-neutral-500 text-[14px]'>(MAX. 800x400px).</span> </label><br />
                        <input type="file" name="file-input" id="file-input" onChange={(e) => { setfile(e.target.files[0]) }} className="block w-full h-[55px] border border-gray-200 shadow-sm mt-[10px] text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-gray-50 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400" />
                    </div>
                    <p className='text-[18px] pt-[10px] text-red-600'>{errortext}</p>
                    <button className='w-full h-[55px] bg-[#5B33AD] mt-[20px] text-[17px] text-white'>Register</button>
                </form>
            </section>
        </section>
    );
}

export default Agentregistretion;
