export const disabledClasses = 'opacity-30 cursor-not-allowed pointer-events-none select-none';

const commonButtonClasses = `inline-flex items-center justify-center space-x-2 py-2 px-4 ${window.theme('input')} ${window.theme('hover')} border ${window.theme('border')} rounded-3xl transition-colors duration-150 cursor-pointer`;

export const buttonClasses = `${commonButtonClasses} ${window.theme('bgSecondaryDark')}`;

export const buttonOutlineClasses = `bg-transparent ${commonButtonClasses}`;

export const tabPillClasses = `py-2 px-4 text-xs cursor-pointer rounded-3xl ${window.theme('hover')}`;

export const labelPillClasses = `${window.theme('bgSecondaryLight')} text-sm font-normal me-2 px-2.5 py-0.5 rounded-full`;

export const linkClasses = `font-semibold underline ${window.theme('textSecondary')}`;

export const selectedRadioOrCheckboxClasses = `${window.theme('bgSecondaryLight')} ${window.theme('borderDark')}`;

export const individualRadioClasses = `inline-flex justify-between items-center p-5 w-full rounded-lg cursor-pointer border-2 ${window.theme('border')} ${window.theme('bgMain')} ${window.theme('checked')} ${window.theme('hover')}`;

export const individualCheckboxClasses = `inline-flex justify-between items-center p-5 w-full rounded-lg cursor-pointer border-2 ${window.theme('border')} ${window.theme('bgMain')} ${window.theme('hover')}`;
