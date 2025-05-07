import { useNavigate } from 'react-router-dom';
import Button from "../components/ui/Button";

const LandingPage = () => {

  const navigate = useNavigate();

    return (
    <div>
      <h1>Landing Page</h1>
      <Button onClick={() => navigate('/Login')}>Ir a Loguearse</Button>
    </div>
  );
  };
  
  export default LandingPage;
  