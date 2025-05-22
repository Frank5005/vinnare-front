import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/atoms/InputField";
import FormCardLayout from "../../../layouts/FormCardLayout";
import Button from "../../../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SelectField from "../../../components/atoms/SelectField";
import { useEffect, useState } from "react";
import { getSecurityQuestions, verifyEmail } from "../../../services/authService";

const forgotSchema = z.object({
    email: z.string().email("Invalid email address"),
    securityQuestion: z.string().min(1, "Security question required"),
    securityAnswer: z.string().min(1, "Security answer required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotSchema>;

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotSchema),
    });

    const [questions, setQuestions] = useState<{ value: string, label: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getSecurityQuestions();
                setQuestions(data);
            } catch (error) {
                console.error("Error loading questions", error);
            }
        };
        fetchQuestions();
    }, []);

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setLoading(true);
            const isValid = await verifyEmail(
                data.email,
                data.securityQuestion,
                data.securityAnswer
            );

            if (isValid) {
                localStorage.setItem("resetToken", isValid.token);
                navigate("/new-password");
            } else {
                alert("Invalid email, question, or answer.");
            }
        } catch (error: any) {
            console.error("Error verifying recovery data:", error);
            alert("Verification failed. Please check your info and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCardLayout welcome="Welcome !" title="Forgot your password?" subtitle="Please enter the email you use to log in and your recovery information.">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <InputField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <SelectField
                    label="Security Question"
                    options={questions}
                    //placeholder="Select a security question"
                    {...register("securityQuestion")}
                    error={errors.securityQuestion?.message}
                />

                <InputField
                    label="Question answer"
                    type="text"
                    placeholder="Type the answer for the question"
                    {...register("securityAnswer")}
                    error={errors.securityAnswer?.message}
                />

                <Button type="submit" variant="primary">
                    Reset
                </Button>

                <p className="text-sm text-center text-gray-400">
                    Don't have an Account?{" "}
                    <Link to="/signup" className="!text-black !visited:text-black hover:!text-gray-800">
                        Register
                    </Link>
                </p>

                <Link to="/login" className="text-center font-bold mt-4 cursor-pointer">
                    Back to Login
                </Link>
            </form>
        </FormCardLayout>
    );

};

export default ForgotPasswordForm;
