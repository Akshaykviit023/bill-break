const getInitials = (groupName) => {
  const words = groupName.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  const firstLetter = words[0].charAt(0).toUpperCase();
  const lastLetter = words[words.length - 1].charAt(0).toUpperCase();
  return `${firstLetter}${lastLetter}`;
};

export default getInitials;
