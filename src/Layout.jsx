import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [currentUser, setCurrentUser] = React.useState(null);
  
  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-sky-50" dir="rtl">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap');
          
          :root {
            --cet-primary-blue: #0073C4;
            --cet-secondary-blue: #00A9E0;
            --cet-dark-blue: #003B63;
            --cet-light-blue: #EBF5FA;
            --cet-orange: #FF6B35;
            --cet-text-primary: #212529;
            --cet-text-secondary: #495057;
            --cet-background: #FFFFFF;
          }
          
          body {
            font-family: 'Assistant', sans-serif;
          }

          .gradient-text {
            background: linear-gradient(45deg, var(--cet-primary-blue), var(--cet-secondary-blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
      
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-b-sky-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl('ChatBot')} className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-md border-2 border-gray-200">
                <div className="grid grid-cols-2 gap-1 w-12 h-12">
                  <div className="bg-teal-400 rounded-md"></div>
                  <div className="bg-yellow-400 rounded-md"></div>
                  <div className="bg-pink-500 rounded-md"></div>
                  <div className="bg-blue-600 rounded-md"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-blue-700">EDU</span>
                  <span className="text-lg font-bold text-gray-400">-</span>
                  <span className="text-lg font-bold text-blue-700">CREATE</span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Teachers' Makerspace
                </p>
              </div>
            </Link>
            
            {currentUser?.role === 'admin' && (
              <Link to={createPageUrl('Admin')}>
                 <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    פאנל ניהול
                  </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="bg-cet-light-blue mt-16 border-t-2 border-sky-200">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-cet-primary-blue font-semibold text-base">
            נוצר במיוחד עבור אנשי חינוך
          </p>
        </div>
      </footer>
    </div>
  );
}