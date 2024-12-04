export const disabledClasses = 'opacityyy-30 cursor-not-allowed pointer-events-none select-none';

const commonButtonClasses = `inline-flex items-center justify-center space-x-2 py-2 px-4 border ${window.theme('border')} ${window.theme('input')} ${window.theme('hover')} rounded-3xl transition-colors duration-150 cursor-pointer`;

export const buttonClasses = `${commonButtonClasses}`;

export const buttonOutlineClasses = `${commonButtonClasses} bg-transparent`;

export const tabPillClasses = `py-2 px-4 text-xs cursor-pointer rounded-3xl ${window.theme('hover')}`;

export const labelPillClasses = 'bg-grayyy-300 text-grayyy-800 text-sm font-normal me-2 px-2.5 py-0.5 rounded-full';

export const linkClasses = 'font-semibold underline';

export const selectedRadioClasses = `bg-grayyy-200 ${window.theme('border')}`;
