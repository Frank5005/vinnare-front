import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormCardLayout from "../../../layouts/FormCardLayout";
import Button from "../../../components/atoms/Button";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordInput from "../../../components/molecules/PasswordInput";
import { resetPassword } from "../../../services/authService";
import React, { useState } from "react";
const newPasswordSchema = z.object({
    password: z
        .string()
        .min(8)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol"
        ),
    confirmPassword: z.string().nonempty("Confirm Password is required"),
});
    /*
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
    });
    */

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

const NewPasswordForm = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewPasswordFormData>({
        resolver: zodResolver(newPasswordSchema),
    });

    const onSubmit = async (data: NewPasswordFormData) => {
        const token = localStorage.getItem("resetToken");

        if (!token) {
            alert("Missing reset token.");
            return;
        }
        
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await resetPassword(data.password, token);
            localStorage.removeItem("resetToken");
            alert("Password updated successfully.");
            navigate("/login");
        } catch (error: any) {
            setError("Error updating password");
            alert("Error updating password. Please try again.");
        }
    };

    return (
        <FormCardLayout welcome="Welcome !" title="New Password" subtitle="Please enter the new password that you will use to log in.">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <PasswordInput
                    label="New Password"
                    placeholder="Enter your New Password"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <PasswordInput
                    label="Confirm your Password"
                    placeholder="Enter your New Password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                <Button type="submit" variant="primary">
                    Reset
                </Button>
            </form>
        </FormCardLayout>
    );

};

export default NewPasswordForm;
