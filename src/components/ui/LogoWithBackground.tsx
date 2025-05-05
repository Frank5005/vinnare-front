interface LogoWithBackgroundProps {
    logoSrc: string;
    backgroundSrc: string;
    size?: number;
  }
  
  const LogoWithBackground = ({
    logoSrc,
    backgroundSrc,
    size = 300,
  }: LogoWithBackgroundProps) => {
    return (
      <div
        className="relative mx-auto"
        style={{ width: size, height: size }}
      >

        <img
          src={backgroundSrc}
          alt="Background pattern"
          className="absolute inset-0 w-full h-full object-contain z-0"
        />
  
        <img
          src={logoSrc}
          alt="Logo"
          className="relative z-10 w-[50%] h-[50%] mx-auto mt-[27%]"
        />
      </div>
    );
  };
  
  export default LogoWithBackground;
  