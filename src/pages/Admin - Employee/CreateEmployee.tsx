import AdminHeader from "../../components/organisms/AdminHeader";
import EmployeeForm from "../../features/admin/EmployeeForm";
import FormCardLayout from "../../layouts/FormCardLayout";
import React from 'react';


const CreateEmployee = () => {
    return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>

      <h1 className="font-bold text-black text-center mt-8 mb-20 text-3xl">Employee Portal</h1>

      <main className="flex-1 flex flex-col items-center justify-center">
        <FormCardLayout title="Create Employee">
          <EmployeeForm />
        </FormCardLayout>
      </main>
    </div>
  );
  };
  
  export default CreateEmployee;
  