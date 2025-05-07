import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import FormCardLayout from "../../../layouts/FormCardLayout";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SelectField from "../../../components/ui/SelectField";

const forgotSchema = z.object({
    email: z.string().email("Invalid email address"),
    securityQuestion: z.string().min(1, "Security question required"),
    securityAnswer: z.string().min(1, "Security answer required"),
});

const securityQuestions = [
    { label: "What is your favorite color?", value: "WhatIsYourFavoriteColor" },
    { label: "What is your pet’s name?", value: "WhatIsYourPetName" },
    { label: "What is your birth city?", value: "WhatIsYourBirthCity" },
    { label: "What is your mother’s maiden name?", value: "WhatIsYourMotherMaidenName" },
    { label: "What is your favorite food?", value: "WhatIsYourFavoriteFood" },
    { label: "What is your favorite sport?", value: "WhatIsYourFavoriteSport" },
    { label: "What is your favorite movie?", value: "WhatIsYourFavoriteMovie" },
    { label: "What is your favorite book?", value: "WhatIsYourFavoriteBook" },
];

type ForgotPasswordFormData = z.infer<typeof forgotSchema>;

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            navigate("/new-password", { state: { email: data.email, securityQuestion: data.securityQuestion, securityAnswer: data.securityAnswer } });
        } catch (error: any) {
            console.error("Reseting password error:", error.response?.data || error.message);
            if (error.response && error.response.status === 401) {
                alert("Invalid email or answer. Please try again.");
            }
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
                    options={securityQuestions}
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
                    Don’t have an Account?{" "}
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
