import { useEffect } from 'react';


export const usePageTitle = (title, options = {}) => {
  useEffect(() => {
    const {
      suffix = ' | My App',
      maxLength = 100
    } = options;

    // Handle empty/undefined title
    if (!title) {
      document.title = suffix.trim();
      return;
    }

    // Sanitize and truncate title
    const sanitizedTitle = String(title)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .substring(0, maxLength);

    document.title = `${sanitizedTitle}${suffix}`;

    // Reset title on unmount
    return () => {
      document.title = suffix.trim();
    };
  }, [title, options.suffix, options.maxLength]);
};