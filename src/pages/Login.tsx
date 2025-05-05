import LoginForm from "../features/auth/components/LoginForm";
import logo from "../assets/logo.png";
import background from "../assets/blueLines.png";
import LogoWithBackground from "../components/ui/LogoWithBackground";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      <div className="absolute top-4 left-6 text-lg font-semibold text-black z-20">
        Tech Trend Emporium
      </div>
      <div className="flex flex-col md:flex-row overflow-hidden max-w-6xl w-full">

        <div className="w-full md:w-1/2 p-8 md:p-2 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center w-full md:w-[60%]">
            <LogoWithBackground
                logoSrc={logo}
                backgroundSrc={background}
                size={580}
            />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

