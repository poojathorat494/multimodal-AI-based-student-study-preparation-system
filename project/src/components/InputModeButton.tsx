import React from 'react';

interface InputModeButtonProps {
  mode: string;
  currentMode: string;
  onClick: () => void;
  icon: React.ReactNode;
}

const InputModeButton: React.FC<InputModeButtonProps> = ({
  mode,
  currentMode,
  onClick,
  icon,
}) => {
  const isActive = mode === currentMode;

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } transition-colors`}
      title={`Switch to ${mode} input`}
    >
      {icon}
    </button>
  );
};

export default InputModeButton;