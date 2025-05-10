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
import { useAuth } from "../../../context/AuthContext";
import Cookies from "js-cookie";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
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
  const { login: loginContext } = useAuth();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({
        ...data,
        //username: data.email  
      });
      const { token, username, email } = response;
      const role = getRoleFromToken(token);

      //Cookies.set("token", token.replace('Bearer ', ''), { expires: data.remember ? 7 : undefined });

      localStorage.setItem("token", token.replace('Bearer ', ''));
      localStorage.setItem("userName", username);
      localStorage.setItem("userEmail", email);

      loginContext(username);

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
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
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
          Don't have an Account?{" "}
          <Link to="/signup" className="!text-black !visited:text-black hover:!text-gray-800">
            Register
          </Link>
        </p>
      </form>
    </FormCardLayout>
  );
};

export default LoginForm;
