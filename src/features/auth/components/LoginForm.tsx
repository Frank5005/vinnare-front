import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../../components/ui/InputField";
import PasswordInput from "../../../components/ui/PasswordInput";
import CheckboxField from "../../../components/ui/CheckboxField";
import FormCardLayout from "../../../layouts/FormCardLayout";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const loginSchema = z.object({
  username: z.string().min(1, "Invalid username"),
  password: z.string().min(1, "Password required"),
  remember: z.boolean().optional(),
});

interface DecodedToken {
  role: string;
  email: string;
  username: string;
}

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
      const response = await api.post("/api/login", {
        username: data.username,
        password: data.password,
      });
  
      console.log("Successful login", response.data);
  
      const { token } = response.data;

      //Save the token in cookies
      if(data.remember) {
      Cookies.set("token", token, { expires: 1 }); //1 day expiration
      }

      //Decode the token to get user data
      const decoded = jwtDecode<any>(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log(role);

      console.log("User role:", role);
  
      //Navigate to the appropriate page based on the user role
      if (role === "Admin") {
        navigate("/admin-employee-homepage");
      }
      else if (role === "Shopper") {
        navigate("/shop-list");
      }
      else if (role === "Seller") {
        navigate("/admin-employee-homepage");
      }


    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      // Handle error (e.g., show a notification or message to the user)
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
          type="username"
          placeholder="Enter your username"
          {...register("username")}
          error={errors.username?.message}
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
