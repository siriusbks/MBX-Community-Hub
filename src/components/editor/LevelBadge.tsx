import React from 'react';

interface LevelBadgeProps {
  level: number;
}

/**
 * Returns a CSS gradient class based on the level.
 */
const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
  const getGradient = () => {
    const gradients = [
      'bg-[#a5a5a5]', // 0–9
      'bg-[#2f2f2f]', // 10–19
      'bg-[#6ef9be]', // 20–29
      'bg-[#00be6e]', // 30–39
      'bg-gradient-to-br from-[#0d5afb] via-[#30c3ff] to-[#0d5afb]', // 40–49
      'bg-gradient-to-br from-[#f22afe] via-[#fe82fa] to-[#f22afe]', // 50–59
      'bg-gradient-to-br from-[#f9bb09] via-[#f8f60d] to-[#f9bb09]', // 60–69
      'bg-gradient-to-br from-[#5c0a0a] via-[#bd0404] to-[#5c0a0a]', // 70–79
      'bg-gradient-to-br from-[#d30050] via-[#8500f3] to-[#d30050]', // 80–89
      'bg-gradient-to-br from-[#c483d1] via-[#8593e8] to-[#c483d1]', // 90–99
      'bg-[linear-gradient(to_bottom_right,_#20bdfb_0%,_#4efbcc_25%,_#f8e562_50%,_#e88e94_75%,_#20bdfb_100%)]', // 100+
    ];
    const index = Math.min(Math.floor(level / 10), gradients.length - 1);
    return gradients[index];
  };

  /**
   * Returns a CSS text color class based on the level.
   */
  const getTextColor = () => {
    const colors = [
      'text-gray-900', // 0–9
      'text-white', // 10–19
      'text-gray-900', // 20–29
      'text-white', // 30–39
      'text-white', // 40–49
      'text-white', // 50–59
      'text-gray-900', // 60–69
      'text-white', // 70–79
      'text-white', // 80–89
      'text-gray-900', // 90–99
      'text-gray-900', // 100+
    ];
    const index = Math.min(Math.floor(level / 10), colors.length - 1);
    return colors[index];
  };

  return (
    <span className="relative inline-block px-1.5 py-0 level-wrapper">
      <span className={`text-sm font-bold text-white relative z-10 level-text ${getTextColor()}`}>
        LVL {level}
      </span>
      <span
        className={`absolute inset-0 rounded-sm z-0 level-shadow ${getGradient()}`}
      />
    </span>
  );
};

export default LevelBadge;
