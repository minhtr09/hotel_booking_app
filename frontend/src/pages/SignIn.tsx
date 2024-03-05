import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from '../api-client'

export type SignInFormData = {
    email: string;
    password: string;
}
const SignIn = () => {
    const {register, formState: {errors}} = useForm<SignInFormData>();
    const mutation = useMutation(apiClient.signIn,{
        onSuccess : async () => {
            console.log("user has been signed in");
        }, 
        onError: (error:Error) => {

        }
    })
    return (
        <form className ="flex flex-col gap-5"> 
            <h2 className = "text-3xl font-bold">SignIn</h2>
            <label className = "text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type ="email" className ="bordder rounded w-full py-1 px-2 font-normal" 
                    {...register("email",{required: "This field is required"})}></input>
                    {errors.email && (
                    <span className = "text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className = "text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type ="password" className ="bordder rounded w-full py-1 px-2 font-normal" 
                    {...register("password",{
                        required: "This field is required", 
                        minLength:{
                            value:6,
                            message: "Password must be at least 6 characters",
                        }
                        })}></input>
                        {errors.password && (
                    <span className = "text-red-500">{errors.password.message}</span>
                )}
            </label>
        </form>
    )
}
export default SignIn