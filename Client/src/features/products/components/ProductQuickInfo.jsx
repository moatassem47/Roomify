import { useState } from 'react';
import { Ruler, Layers } from 'lucide-react';
import SpecBadge from './SpecBadge';

const ProductQuickInfo = ({ specs = {}, materials = [] }) => {
  const [activeSpecBadge, setActiveSpecBadge] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-sans font-semibold uppercase tracking-widest text-brand-text">
        Quick Info
      </span>
      <div className="flex gap-2 flex-wrap">
        <SpecBadge
          icon={Ruler}
          label={
            specs.width
              ? `${specs.width} × ${specs.depth || '—'} × ${specs.height || '—'}`
              : 'View Measurements'
          }
          active={activeSpecBadge === 'measurement'}
          onClick={() =>
            setActiveSpecBadge(activeSpecBadge === 'measurement' ? null : 'measurement')
          }
        />
        {materials.map((mat, i) => (
          <SpecBadge
            key={i}
            icon={Layers}
            label={mat}
            active={activeSpecBadge === `material-${i}`}
            onClick={() =>
              setActiveSpecBadge(
                activeSpecBadge === `material-${i}` ? null : `material-${i}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ProductQuickInfo;
