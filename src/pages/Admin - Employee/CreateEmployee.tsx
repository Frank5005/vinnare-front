import AdminHeader from "../../components/organisms/AdminHeader";

const CreateEmployee = () => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900">Create employee</h1>
      </main>
    </div>
    );
  };
  
  export default CreateEmployee;
  