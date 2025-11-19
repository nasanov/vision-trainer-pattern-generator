import { CENTER_X, CENTER_Y } from '../../utils/constants';

type FixationPointProps = {
  color: string;
};

export const FixationPoint = ({ color }: FixationPointProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${CENTER_X}mm`,
        top: `${CENTER_Y}mm`,
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
