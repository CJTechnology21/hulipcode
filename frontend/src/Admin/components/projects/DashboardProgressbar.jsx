import React from 'react';

const DashboardProgressBar = () => {
  const segments = [
    { percent: 48, color: 'bg-cyan-600' },
    { percent: 16.5, color: 'bg-green-400' },
    { percent: 20.5, color: 'bg-yellow-400' },
    { percent: 15, color: 'bg-gray-300' },
  ];

  const markers = [
    { position: '0%', labelTop: '0%', labelBottom: 'Work Progress', color: 'bg-cyan-600' },
    { position: '48%', labelBottom: 'Payment Disbursed 48%', color: 'bg-cyan-700' },
    { position: '64.5%', labelBottom: 'Work Completed 64.5%', color: 'bg-green-500' },
    { position: '85%', labelBottom: 'Payment In Escrow 85%', color: 'bg-yellow-400' },
    { position: '100%', labelTop: '100%', color: 'bg-gray-400' },
  ];

  return (
    <div className="relative w-full h-6 mb-12">
      {/* Background base line */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 rounded-full transform -translate-y-1/2 z-0" />

      {/* Colored segments */}
      {segments.reduce((acc, segment, i) => {
        const left = acc.total;
        acc.total += segment.percent;
        acc.elements.push(
          <div
            key={i}
            className={`absolute top-1/2 h-2 ${segment.color} z-10`}
            style={{
              left: `${left}%`,
              width: `${segment.percent}%`,
              borderTopLeftRadius: i === 0 ? '9999px' : '0',
              borderBottomLeftRadius: i === 0 ? '9999px' : '0',
              borderTopRightRadius: i === segments.length - 1 ? '9999px' : '0',
              borderBottomRightRadius: i === segments.length - 1 ? '9999px' : '0',
              transform: 'translateY(-50%)',
            }}
          />
        );
        return acc;
      }, { total: 0, elements: [] }).elements}

      {/* Milestone markers */}
      {markers.map((m, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center text-center transform -translate-x-1/2"
          style={{ left: m.position, top: '-30px' }}
        >
          {m.labelTop && (
            <span className="text-xs font-bold mb-1 text-black">{m.labelTop}</span>
          )}
          <div
            className={`w-4 h-4 rounded-full ${m.color} border-2 border-white shadow-md z-20`}
          />
          {m.labelBottom && (
            <span className="text-xs font-semibold text-black mt-1 whitespace-nowrap">
              {m.labelBottom}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardProgressBar;
