import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import PasswordInput from "../../../components/ui/PasswordInput";
import SelectField from "../../../components/ui/SelectField";
import Button from "../../../components/ui/Button";
import FormCardLayout from "../../../layouts/FormCardLayout";
import { Link } from "react-router-dom";

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
    email: z.string().email("Invalid email"),
    password: z.string().min(8).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol"
    ),
    confirmPassword: z.string(),
    securityQuestion: z.string().min(1, "Select a question"),
    answer: z.string().min(1, "Answer is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof schema>;

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log("Sign Up Data:", data);
    // lógica de envío al backend
  };

  return (
    <FormCardLayout
      welcome="Welcome !"
      title="Sign up"
      subtitle="Register to add items to your wishlist and make purchases"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your user email"
          {...register("email")}
          error={errors.email?.message}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your Password"
          {...register("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Repeat Password"
          placeholder="Enter your Password again"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
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

        <Button type="submit">Sign up</Button>

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