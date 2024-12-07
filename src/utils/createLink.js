import { linkClasses } from '$data/commonClasses';

export function createLink(href, title, classes = linkClasses, attributes = '') {
	return `<a href="${href}" target="_blank" class="${classes}" ${attributes}>${title}</a>`;
}
