import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import PasswordInput from "../../../components/ui/PasswordInput";
import CheckboxField from "../../../components/ui/CheckboxField";
import FormCardLayout from "../../../layouts/FormCardLayout";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getRoleFromToken, login } from "../../../services/auth";

const loginSchema = z.object({
  username: z.string().min(1, "Invalid username"),
  password: z.string().min(1, "Password required"),
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

  const navigate = useNavigate();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      const token = await login(data);
      const role = getRoleFromToken(token);
      if (role === "Admin") {
        navigate("/admin-employee-homepage");
      } else if (role === "Shopper") {
        navigate("/shop-list");
      } else if (role === "Seller") {
        navigate("/admin-employee-homepage");
      }
    }catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        alert("Invalid username or password. Please try again.");
      }
    }
  };

  return (
    <FormCardLayout welcome="Welcome !" title="Log in" subtitle="Please enter your credentials to log in.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <InputField
          label="Username"
          type="text"
          placeholder="Enter your username"
          {...register("username")}
          error={errors.username?.message}
        />

        <PasswordInput
          label="Password"
          //type="password"
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

          <a 
            onClick={() => navigate("/forgot-password")}
            className="!text-gray-400 !visited:text-black hover:!text-gray-800 cursor-pointer"
          >
           Forgot Password ? 
          </a>
        </div>

        <Button type="submit" variant="primary">
            Login
        </Button>

        <p className="text-sm text-center text-gray-400">
          Don’t have an Account?{" "}
          <Link to="/signup" className="!text-black !visited:text-black hover:!text-gray-800">
            Register
          </Link>
        </p>
      </form>
    </FormCardLayout>
  );
};

export default LoginForm;
