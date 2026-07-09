import image from "../../assets/final_background.png";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen  overflow-hidden">
      {/* Background Image */}
      <img
        src={image}
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center px-5 ">
        <div className="flex gap-10">
          <button className="text-white border-2 border-white rounded-lg px-6 py-3 text-2xl bg-transparent cursor-pointer hover:bg-white/80 hover:text-black transition">
            Explore Districts
          </button>

          <button className="bg-blue-500 text-white rounded-lg px-6 py-3 text-2xl hover:bg-blue-700 cursor-pointer transition">
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
