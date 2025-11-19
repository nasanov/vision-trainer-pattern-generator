type FixationPointProps = {
  color: string;
  centerX: number;
  centerY: number;
};

export const FixationPoint = ({ color, centerX, centerY }: FixationPointProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${centerX}mm`,
        top: `${centerY}mm`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <div
        style={{
          width: '5mm',
          height: '5mm',
          border: `1px solid ${color}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '1mm',
            height: '1mm',
            backgroundColor: color,
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
};
