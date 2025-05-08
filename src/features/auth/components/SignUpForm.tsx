import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import PasswordInput from "../../../components/ui/PasswordInput";
import SelectField from "../../../components/ui/SelectField";
import Button from "../../../components/ui/Button";
import FormCardLayout from "../../../layouts/FormCardLayout";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../../services/auth";
import { useState } from "react";

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

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol"
    ),
    confirmPassword: z.string(),
    address: z.string().min(1, "Address is required"),
    securityQuestion: z.string().min(1, "Select a question"),
    answer: z.string().min(1, "Answer is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof schema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError(null);
      await signup({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        address: data.address,
        securityQuestion: data.securityQuestion,
        securityAnswer: data.answer,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <FormCardLayout
      welcome="Welcome !"
      title="Sign up"
      subtitle="Register to add items to your wishlist and make purchases"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          {...register("name")}
          error={errors.name?.message}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter your user email"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Username"
          placeholder="Choose a username"
          {...register("username")}
          error={errors.username?.message}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Repeat Password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <InputField
          label="Address"
          placeholder="Enter your address"
          {...register("address")}
          error={errors.address?.message}
        />

        <SelectField
          label="Security question"
          options={securityQuestions}
          {...register("securityQuestion")}
          error={errors.securityQuestion?.message}
        />

        <InputField
          label="Your answer"
          placeholder="Answer to your security question"
          {...register("answer")}
          error={errors.answer?.message}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Already have an Account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </FormCardLayout>
  );
};
export default SignUpForm;