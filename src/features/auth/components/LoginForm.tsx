import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import PasswordInput from "../../../components/ui/PasswordInput";
import CheckboxField from "../../../components/ui/CheckboxField";
import FormCardLayout from "../../../layouts/FormCardLayout";
import Button from "../../../components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password required"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login data:", data);
  };

  return (
    <FormCardLayout welcome="Welcome !" title="Log in" subtitle="Please enter your credentials to log in.">
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

        <div className="flex items-center justify-between text-sm text-gray-600">
        <CheckboxField
            label="Remember me"
            {...register("remember")}
            error={errors.remember?.message}
        />

          <a href="#" className="!text-gray-400 !visited:text-black hover:!text-gray-800">
           Forgot Password ? 
          </a>
        </div>

        <Button type="submit" variant="primary">
            Login
        </Button>

        <p className="text-sm text-center text-gray-400">
          Don’t have an Account?{" "}
          <a href="#" className="!text-black !visited:text-black hover:!text-gray-800">
            Register
          </a>
        </p>
      </form>
    </FormCardLayout>
  );
};

export default LoginForm;
