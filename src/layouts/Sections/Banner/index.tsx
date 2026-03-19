import "./styles.css";

export default function Banner() {
  return (
    <div className="relative flex flex-col justify-center items-center w-full bg-[var(--color-primary)] min-h-88">
      <div className="banner-img"></div>
      <div className="relative z-10 px-4 pt-4 w-full max-w-4xl flex flex-col justify-center items-center text-center">
        <div className="color-secondary font-bold text-3xl sm:text-4xl md:text-5xl">
          CIÊNCIAS DA COMPUTAÇÃO
        </div>
        <div className="text-white font-semibold text-xl sm:text-2xl md:text-3xl mt-2 sm:mt-4 text-balance">
          Universidade Estadual Vale do Acaraú
        </div>
        <div className=" text-white font-light text-lg sm:text-xl md:text-2xl mt-1 sm:mt-2">
          Sobral | Ceará
        </div>
      </div>
    </div>
  );
}
