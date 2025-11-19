type GridLinesProps = {
  color: string;
};

export const GridLines = ({ color }: GridLinesProps) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-10 no-print"
      style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: '10mm 10mm',
        backgroundPosition: '8.5mm 5mm',
      }}
    >
      <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-red-500 rounded-full opacity-50"></div>
    </div>
  );
};
