export const disabledClasses = 'opacity-30 cursor-not-allowed pointer-events-none select-none';

const commonButtonClasses = `inline-flex items-center justify-center space-x-2 py-2 px-4 ${window.theme('input')} ${window.theme('hover')} rounded-3xl transition-colors duration-150 cursor-pointer`;

export const buttonClasses = `${commonButtonClasses} ${window.theme('bgSecondaryMain')}`;

export const buttonOutlineClasses = `bg-transparent ${commonButtonClasses} border ${window.theme('border')}`;

export const tabPillClasses = `py-2 px-4 text-xs cursor-pointer rounded-3xl ${window.theme('hover')}`;

export const labelPillClasses = `${window.theme('bgSecondaryMain')} text-sm font-normal me-2 px-2.5 py-0.5 rounded-full`;

export const linkClasses = `font-semibold underline ${window.theme('textSecondary')}`;

export const selectedRadioClasses = `${window.theme('bgSecondaryMain')} ${window.theme('border')}`;
