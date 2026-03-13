'use client'
import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
function Register (){
    const initialValues={
        name:"",
        email:"",
        password:"",
        confirmPassword: "",
        role: "user",
    };

    // get products
    
    // add product
    const addUser=useMutation({
        mutationKey:["users"],
        mutationFn: (values) =>
            fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            }).then((res) => {
            if (!res.ok) throw new Error("Something went wrong");
            return res.json();
            }),

        onSuccess: () => {
            console.log("User Added Successfully");
            Swal.fire({
                title: "Registerd!",
                text: "You have been Registerd successfully.",
                icon: "success",
            });
        },
        onError: (err) => {
            console.log(err.message)
            Swal.fire({
                title: "❌ Error",
                text: "📩 Product Added Failed ❌ .",
                icon: "error",
            });
        },
    })

    const onSubmit = (values, { resetForm }) => {
        addUser.mutate(values, {
            onSuccess: () => {
            resetForm();
            },
        });
        };
    return (
        <>
        <div className="text-center bg-blue-50 p-4 flex flex-col gap-4 justify-center align-middle h-screen">           
            <div className="form w-xl m-auto">
                <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                >
                    <Form className="flex flex-col gap-4 justify-center align-middle">
                        <h2 className="font-bold">Welcom To Registration Page</h2>
                        <Field
                            name="name"
                            type="text"
                            placeholder="Name"
                            className="bg-blue-100 p-2 rounded-md"
                        />
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
                        <Field
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="bg-blue-100 p-2 rounded-md"
                        />
                        <p className="text-start font-medium">You have an account ? <a className="text-blue-600" href="/LoginPage">Login</a></p>
                        <button
                            type="submit"
                            className="bg-blue-200 p-2 rounded-md cursor-pointer font-bold"
                        >
                            Register
                        </button>
                        
                    </Form>
                </Formik>
            </div>
            
        </div>
        </>
    )
}
export default Register;