import LoginForm from "../features/auth/components/LoginForm";
import logo from "../assets/logo.png";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row overflow-hidden max-w-6xl w-full">

        <div className="w-full md:w-1/2 p-8 md:p- flex items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-4">
          <img
            src={logo}
            alt="Tech Trend Emporium"
            className="w-[280px] md:w-[300px] lg:w-[360px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

