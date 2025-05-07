interface FormCardLayoutProps {
  welcome?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const FormCardLayout = ({ welcome, title, subtitle, children, className }: FormCardLayoutProps) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-sm mx-auto max-h-[90vh] overflow-auto ${className}`}>
      {welcome && <p className="text-base font-medium text-gray-700 mb-3">{welcome}</p>}
      <h2 className="text-xl font-semibold text-gray-700 text-left">{title}</h2>
      {subtitle && <p className="text-sm text-gray-700 mb-6">{subtitle}</p>}
      {children}
    </div>
  );
};

export default FormCardLayout;
  