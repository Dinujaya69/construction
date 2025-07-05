import Link from "next/link";
import Header from "../common/Header";

// Layout component
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
 
        <Header />
      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

  
   
    </div>
  );
};

export default MainLayout;
