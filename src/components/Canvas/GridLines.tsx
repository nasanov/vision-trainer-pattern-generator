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
        backgroundPosition: 'center',
      }}
    />
  );
};
