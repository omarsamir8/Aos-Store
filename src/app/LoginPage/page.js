'use client'
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
const { Formik, Form, Field } = require("formik");

function LoginPage(){
    const router = useRouter();
    const initialValues={
        email:"",
        password:"",
    };

    const login = useMutation({
        mutationKey: ["login"],
        mutationFn: async (values) => {
            const res = await axios.post("/api/login", values);
            return res.data; 
        },
        onSuccess: (data) => {
            Cookies.set("token", data.token, {
                expires: 7, 
                secure: false, 
                sameSite: "Strict",
            });
            Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
            console.log("Token stored in cookie ✅");
            Swal.fire({
                title: "Logged in!",
                text: "You have been logged in successfully.",
                icon: "success",
            });

            setTimeout(() => {
                router.push("/");
            }, 2000);          
        },
        onError: (err) => {
            console.log(err.response?.data?.message || err.message);
        },
    });

    const onSubmit = (values, { resetForm }) => {
        login.mutate(values, {
            onSuccess: () => {
            resetForm();
            },
        });
        };

        const handleForgetPassword = async () => {
            const { value: email } = await Swal.fire({
            title: "Forgot Password?",
            input: "email",
            inputLabel: "Enter your registered email",
            inputPlaceholder: "example@email.com",
            showCancelButton: true,
            confirmButtonText: "Send Reset Link",
        });
        if (email) {
            try {
                const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                });

                const data = await res.json();

                if (!res.ok) {
                Swal.fire({
                    title: "❌ Error",
                    text: "📩 Email Sent Failed ❌ .",
                    icon: "error",
                });
                } else {
                Swal.fire({
                    title: "📩 Email Sent",
                    text: "📩 Email Sent successfully.",
                    icon: "success",
                });
                }
            } catch (err) {
                Swal.fire({
                    title: "❌ Error",
                    text: "📩 Email Sent Failed ❌ .",
                    icon: "error",
                });
            }
        }
    }
    return (
        <>
        <div className="text-center bg-blue-50 p-4 flex flex-col gap-4 justify-center align-middle h-screen ">
                    <div className="form w-xl m-auto ">
                        <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        >            
                            <Form className="flex flex-col gap-4 justify-center align-middle">  
                                <h2 className="font-bold">Welcom To Login Page</h2>                            
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="bg-blue-100 p-2 rounded-md"
                                />
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="bg-blue-100 p-2 rounded-md"
                                />
                                <p className="text-start font-medium">If You haven't an account ? <a className="text-blue-600" href="/RegisterationPage">signup .</a></p>
                                
                                <button
                                    type="submit"
                                    className="bg-blue-200 p-2 rounded-md cursor-pointer font-bold"
                                >
                                    Login
                                </button>
                                <p onClick={handleForgetPassword} className="text-start font-medium text-blue-600 cursor-pointer ">Forget Password?</p>
                                
                            </Form>
                        </Formik>
                    </div>
                    
                </div>
        </>
    )
}
export default LoginPage;