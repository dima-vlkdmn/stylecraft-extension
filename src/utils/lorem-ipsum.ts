const generateLoremIpsum = (type: 'sentences' | 'paragraphs', count: number): string => {
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  if (type === 'sentences') {
    return Array.from({ length: count }, () => lorem).join(' ');
  } else {
    return Array.from({ length: count }, () => lorem).join('\n\n');
  }
};

export { generateLoremIpsum };
