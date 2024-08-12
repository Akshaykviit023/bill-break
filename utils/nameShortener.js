const nameShortener = (name) => {
  if (name.length > 10) {
    return name.slice(0, 7) + "...";
  }

  return name;
};

export default nameShortener;
