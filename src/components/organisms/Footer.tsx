import { useNavigate } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/signup");
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: <FaInstagram className="text-2xl" />,
      url: "https://instagram.com/vinnare.ecommerce",
      username: "@vinnare.ecommerce"
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-2xl" />,
      url: "https://facebook.com/vinnare.ecommerce",
      username: "vinnare.ecommerce"
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-2xl" />,
      url: "https://wa.me/3032676304",
      username: "+1 (303) 267-6304"
    }
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-300 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-8">
          <div className="w-full md:max-w-md flex-shrink-0 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Sign up for our newsletter</h2>
            <p className="text-black mb-4 text-sm">
              Be the first to know about our special offers, news, and updates.
            </p>
            <form className="w-full" onSubmit={handleSignUp}>
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none pr-24"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-5 font-semibold text-sm text-black bg-transparent rounded-r focus:outline-none"
                  style={{ background: 'none', boxShadow: 'none', border: 'none' }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          <div className="w-full md:flex-1 flex flex-col md:flex-row md:justify-end gap-8">
            {socialLinks.map((social) => (
              <div key={social.name} className="md:min-w-[160px]">
                <h3 className="font-semibold mb-2">{social.name}</h3>
                <a 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
                >
                  {social.icon}
                  <span className="text-sm">{social.username}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black text-white text-xs text-center tracking-widest py-3">
        COPYRIGHTS SITE.COM. ALL RIGHTS RESERVED
      </div>
    </footer>
  );
};

export default Footer;