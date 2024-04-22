export const clickOutside = (node, callback) => {
    const handleClick = (event) => {
        if (!event?.target)
            return;
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            callback();
        }
    };
    document.addEventListener('click', handleClick, true);
    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
};
