import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSecurityQuestions } from "../../services/authService";
import { createEmployee } from "../../services/adminService";
import FormCardLayout from "../../layouts/FormCardLayout";
import InputField from "../../components/atoms/InputField";
import PasswordInput from "../../components/molecules/PasswordInput";
import SelectField from "../../components/atoms/SelectField";
import Button from "../../components/atoms/Button";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8),
    confirmPassword: z.string(),
    address: z.string().min(1, "Address is required"),
    securityQuestion: z.string().min(1, "Select a question"),
    answer: z.string().min(1, "Answer is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmployeeFormData = z.infer<typeof schema>;

const EmployeeForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(schema),
  });

  const [questions, setQuestions] = useState<{ value: string, label: string }[]>([]);

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

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setError(null);
      await createEmployee({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
        address: data.address,
        securityQuestion: data.securityQuestion,
        role: "Seller",
        securityAnswer: data.answer,
      });
      toast.success("Employee created!");
      navigate("/admin/homepage");
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during creation');
    }
  };

  return (
    <FormCardLayout
      title=""
      subtitle="Register the employee and their information"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 w-full max-w-lg mx-auto text-base">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <InputField
          label="Full Name"
          placeholder="Enter their full name"
          {...register("name")}
          error={errors.name?.message}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter their email"
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
          placeholder="Enter the generic password"
          {...register("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Repeat Password"
          placeholder="Confirm their password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <InputField
          label="Address"
          placeholder="Enter their address"
          {...register("address")}
          error={errors.address?.message}
        />

        <SelectField
          label="Security question"
          options={questions}
          {...register("securityQuestion")}
          error={errors.securityQuestion?.message}
        />

        <InputField
          label="Your answer"
          placeholder="Answer their security question"
          {...register("answer")}
          error={errors.answer?.message}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating the employee..." : "Create employee"}
        </Button>
      </form>
    </FormCardLayout>
  );
}

export default EmployeeForm;