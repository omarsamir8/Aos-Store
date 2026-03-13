'use client'
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

function ResetPassword(){
    const router = useRouter();
    const { token } = useParams();
    const initialValues={
        password:"",
        confirmPassword:"",
    };
    
    const resetpassword=useMutation({
            mutationKey:["resetpassword"],
            mutationFn:async (values)=>{
                const res = await axios.post(`/api/auth/reset-password/${token}`, values);
                return res.data; 
            },
            onSuccess:()=>{
                Swal.fire({
                title: "Reset Password!",
                text: "Password reseted succssfully",
                icon: "success",
            });
            setTimeout(()=>{
                router.push("/LoginPage")
            },1000)
            },
            onError:(err)=>{
            Swal.fire({
                title: "Error!",
                text: err.message,
                icon: "error",
            });
                
            }
    })

    
    const onSubmit = (values, { resetForm }) => {
          if (values.password !== values.confirmPassword) {
                Swal.fire({
                title: "Error!",
                text: "Please make password and confirm password the same.",
                icon: "error",
                });
                return;
            }

        resetpassword.mutate(values, {
            onSuccess: () => {
            resetForm();
            },
        });
        };

    return (
        <>
            <div className="text-center bg-blue-50 p-4 flex flex-col gap-4 justify-center align-middle h-screen ">
                    <div className="form w-xl m-auto ">
                        <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        >            
                            <Form className="flex flex-col gap-4 justify-center align-middle">  
                                <h2 className="font-bold">Welcom To Reset Password Page</h2>                            
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    className="bg-blue-100 p-2 rounded-md"
                                />        
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="bg-blue-100 p-2 rounded-md"
                                />        
                                <button
                                    type="submit"
                                    className="bg-blue-200 p-2 rounded-md cursor-pointer font-bold"
                                >
                                    Reset Password
                                </button>
                            </Form>
                        </Formik>
                    </div>                 
                </div>           
        </>
    )
}
export default ResetPassword;