import image from "../../assets/hero_image.png";
const HeroSection = () => {
  return (
    <div className="relative  w-full">
      <img src={image} alt="hero" className=" w-full h-full" />
      <div className="flex absolute top-135 left-12 gap-10">
        <button className="  text-white  border-2 rounded-lg p-3 text-2xl bg-transparent  cursor-pointer">
          Explore Districts
        </button>
        <button className=" bg-blue-500  text-white rounded-lg p-3 text-2xl hover:bg-blue-700 cursor-pointer">
          Explore Products
        </button>
      </div>
    </div>
  );
};
export default HeroSection;
