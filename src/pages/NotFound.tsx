import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-8xl md:text-9xl font-light text-primary mb-8 tracking-tight">404</h1>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-8 tracking-tight">
              Oops! Page not found
            </h2>
            <p className="text-xl text-muted-foreground mb-12 font-light leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-8 py-4 hover:shadow-lg transition-all duration-300 font-medium"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
