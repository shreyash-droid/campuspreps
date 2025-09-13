export default function strip() {
    return (
    <div className="w-full overflow-hidden bg-black text-white border-y-5 translate-y-25 border-white transform rotate-[-2deg]  mb-12 z-10 relative">
        <div className="whitespace-nowrap animate-marquee font-semibold text-xl py-4">
          <span className="mx-4">Previous year Papers</span> • 
          <span className="mx-4">Study Materials</span> • 
          <span className="mx-4">Youtube Links</span> • 
          <span className="mx-4">Previous year Papers</span> • 
          <span className="mx-4">Study Materials</span> • 
          <span className="mx-4">Youtube Links</span> •
          <span className="mx-4">Previous year Papers</span> • 
          <span className="mx-4">Study Materials</span> • 
          <span className="mx-4">Youtube Links</span> • 
          
          {/* Repeat as needed to fill the strip */}
        </div>
      </div>
    );
  }
  