import { useState } from 'react';

const InfoCell = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-sans text-brand-surface-dim uppercase tracking-wide">{label}</span>
    <span className="text-sm font-sans font-semibold text-brand-charcoal">{value || '—'}</span>
  </div>
);

const TABS = ['Overview', 'Specifications', 'Sustainability'];

const InfoTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const specs = product.specs || {};

  return (
    <div className="mt-6 border-t border-brand-surface-dim pt-4">
      {/* ── Tab Headers ── */}
      <div className="flex gap-0 border-b border-brand-surface-dim">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2.5 text-sm font-sans font-medium transition-colors duration-200 cursor-pointer
              ${activeTab === tab ? 'text-brand-cedar' : 'text-brand-text hover:text-brand-cedar'}`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cedar rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="pt-4">

        {/* Overview: Dimensions + primary materials */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <InfoCell
              label="Dimensions"
              value={`${specs.width || '—'} W × ${specs.depth || '—'} D × ${specs.height || '—'} H`}
            />
            <InfoCell label="Weight Capacity" value={specs.weightCapacity} />
            <InfoCell
              label="Frame Material"
              value={specs.material?.length ? specs.material.join(', ') : '—'}
            />
            <InfoCell label="Upholstery" value={specs.upholstery} />
          </div>
        )}

        {/* Specifications: SKU, category, weight, assembly, colors, origin */}
        {activeTab === 'Specifications' && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <InfoCell label="SKU" value={product._id?.slice(-8).toUpperCase()} />
            <InfoCell label="Category" value={product.category} />
            <InfoCell label="Weight" value={specs.weight} />
            <InfoCell label="Assembly" value={specs.assembly} />
            <InfoCell
              label="Colors Available"
              value={specs.color?.length ? `${specs.color.length} option${specs.color.length > 1 ? 's' : ''}` : '—'}
            />
            <InfoCell label="Country of Origin" value={specs.origin} />
          </div>
        )}

        {/* Sustainability: certifications, eco, warranty */}
        {activeTab === 'Sustainability' && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <InfoCell label="Certified" value={specs.certified} />
            <InfoCell label="Recyclable Packaging" value={specs.recyclable} />
            <InfoCell label="Carbon Offset" value={specs.carbonOffset} />
            <InfoCell label="Warranty" value={specs.warranty} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoTabs;