export default function Strip() {
    const content = (
      <>
        <span className="mx-4">Previous year Papers</span> • 
        <span className="mx-4">Study Materials</span> • 
        <span className="mx-4">Youtube Links</span> • 
      </>
    );

    return (
      <div className="w-full overflow-hidden bg-black text-white border-y-5 translate-y-35 border-white transform rotate-[-2deg] mb-12 relative">
        <div className="relative flex">
          {/* First copy of the text */}
          <div className="animate-marquee whitespace-nowrap font-semibold text-xl py-4">
            {content}
            {content}
            {content}
            {content}
          </div>
          
          {/* Second copy that follows seamlessly */}
          <div className="animate-marquee2 whitespace-nowrap absolute top-0 font-semibold text-xl py-4">
            {content}
            {content}
            {content}
            {content}
          </div>
        </div>
      </div>
    );
  }
  