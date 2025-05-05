interface FormCardLayoutProps {
    welcome: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }
  
  const FormCardLayout = ({ welcome, title, subtitle, children }: FormCardLayoutProps) => {
    return (
      <div className="bg-white rounded-lg shadow p-6 w-full max- mx-auto">
        <p className="text-base font-medium text-gray-700 mb-3">{welcome}</p>
        <h2 className="text-xl font-semibold text-gray-700 text-left mb-0">{title}</h2>
        {subtitle && <p className="text-sm text-gray-700 mb-7">{subtitle}</p>}
        {children}
      </div>
    );
  };
  
  export default FormCardLayout;
  