import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import PasswordInput from "../../../components/ui/PasswordInput";
import SelectField from "../../../components/ui/SelectField";
import Button from "../../../components/ui/Button";
import FormCardLayout from "../../../layouts/FormCardLayout";

const securityQuestions = [
  { label: "What is your pet’s name?", value: "pet" },
  { label: "What city were you born in?", value: "city" },
  { label: "What is your favorite color?", value: "color" },
];

const schema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
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
    // Aquí iría la lógica de envío al backend
  };

  return (
    <FormCardLayout
      welcome="Welcome !"
      title="Sign up"
      subtitle="Register to add items to your wishlist and make purchases"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <a href="/login" className="text-black font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </FormCardLayout>
  );
};

export default SignUpForm;
