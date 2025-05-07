import { useNavigate } from 'react-router-dom';
import Button from "../components/ui/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sticky */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Main content */}
      <main className="flex-1">
        <h1>Landing Page</h1>
        <Button onClick={() => navigate('/Login')}>Ir a Loguearse</Button>
      </main>
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default LandingPage;
  