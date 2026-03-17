const sanitizeHTML = require('sanitize-html')

exports.sanitizeTitle = (title) => {
    return sanitizeHTML(title, {
        allowedTags: [],
        allowedAttributes: {}
    })
}

exports.sanitizeContent = (content) => {
    return sanitizeHTML(content, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'ul', 'ol', 'li'],
        allowedAttributes: { 'a': [ 'href' ]}
    })
}

exports.sanitizeTags = (tags) => {
    if (!tags) return [];

    if (Array.isArray(tags)) return tags;

    const parseTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    return parseTags.map(tag => sanitizeHTML(tag, { allowedTags: [] }));
}