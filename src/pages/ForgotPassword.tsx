import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";
import logo from "../assets/logo.png";
import background from "../assets/blueLines.png";

const ForgotPassword = () => {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-sm">
          <p className="text-xl font-bold mb-8">Tech Trend Emporium</p>
          <ForgotPasswordForm />
        </div>
      </div>

      <div className="hidden md:flex relative w-full md:w-1/2 h-screen bg-gray-100 overflow-hidden">

        <img
          src={background}
          alt="Background pattern"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <img
            src={logo}
            alt="Tech Trend Emporium"
            className="w-[220px] md:w-[280px] lg:w-[320px] object-contain"
          />
        </div>
      </div>
    </div>
  );
  };
  
  export default ForgotPassword;
  