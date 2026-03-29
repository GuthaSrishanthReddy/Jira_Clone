export const getTextContentsFromHtmlString = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent;
};

export const copyToClipboard = value => {
  const $textarea = document.createElement('textarea');
  $textarea.value = value;
  document.body.appendChild($textarea);
  $textarea.select();
  document.execCommand('copy');
  document.body.removeChild($textarea);
};

export const isFocusedElementEditable = () => {
  const { activeElement } = document;
  return (
    !!activeElement &&
    (!!activeElement.getAttribute('contenteditable') ||
      ['TEXTAREA', 'INPUT'].includes(activeElement.tagName))
  );
};
