const ScrollingText: React.FC = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee w-full">
        <span className="text-black dark:text-white">
          Halo selamat datang di website peta okupasi
        </span>
      </div>
    </div>
  );
};

export default ScrollingText;
