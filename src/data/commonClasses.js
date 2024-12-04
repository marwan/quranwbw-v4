export const disabledClasses = 'opacityyy-30 cursor-not-allowed pointer-events-none select-none';

const commonButtonClasses = `inline-flex items-center justify-center space-x-2 py-2 px-4 border ${window.theme('border')} ${window.theme('input')} rounded-3xl transition-colors duration-150 cursor-pointer`;

export const buttonClasses = `${commonButtonClasses} bg-grayyy-500 hover:bg-grayyy-600`;

export const buttonOutlineClasses = `${commonButtonClasses} bg-transparent hover:bg-grayyy-600 hover:text-black`;

export const tabPillClasses = 'py-2 px-4 text-xs cursor-pointer rounded-3xl hover:bg-lightGrayyy bg-lightGrayyy';

export const labelPillClasses = 'bg-grayyy-300 text-grayyy-800 text-sm font-normal me-2 px-2.5 py-0.5 rounded-full';

export const linkClasses = 'font-semibold underline';

export const selectedRadioClasses = `bg-grayyy-200 ${window.theme('border')}`;
