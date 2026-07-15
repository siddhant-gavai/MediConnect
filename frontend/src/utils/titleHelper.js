/**
 * Sets the browser document title dynamically.
 * @param {string} pageTitle - The title of the current page.
 */
export const setDocumentTitle = (pageTitle) => {
  const baseTitle = 'MediConnect';
  if (pageTitle) {
    document.title = `${baseTitle} | ${pageTitle}`;
  } else {
    document.title = baseTitle;
  }
};
