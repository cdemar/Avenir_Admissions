const HeroHome = () => {
  return (
    <section id="hero" className="h-[110%] w-full">
      <div
        className="relative h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url("people_throwing_hats_on_air.jpg")` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <h1 className="text-white/95 font-libre text-5xl md:text-6xl lg:text-7xl font-bold leading-tight px-4 sm:px-6 lg:px-8">
            Your Future. Your Path. <br className="md:hidden" />
            Our Guidance.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
