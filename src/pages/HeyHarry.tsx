import { Navbar } from "@/components/Navbar";
import { PhotoRenamer } from "@/components/PhotoRenamer";

const HeyHarry = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <PhotoRenamer />
      </main>
    </div>
  );
};

export default HeyHarry;