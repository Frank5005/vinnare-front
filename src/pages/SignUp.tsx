import SignUpForm from "../features/auth/components/SignUpForm";
import logo from "../assets/logo.png";
import background from "../assets/blueLines.png";

const SignUpPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Lado izquierdo: formulario */}
      <div className="w-full md:w-1/2 flex flex-col bg-gray-100 px-4 py-6">
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center px-4 py-6">
  <div className="w-full max-w-sm">
    <h1 className="text-xl font-bold mb-6 text-center md:text-left">
      Tech Trend Emporium
    </h1>
    <SignUpForm />
  </div>
</div>

      </div>

      {/* Lado derecho: imagen decorativa */}
      <div className="hidden md:flex w-full md:w-1/2 h-full relative bg-gray-100 overflow-hidden">
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

export default SignUpPage;
