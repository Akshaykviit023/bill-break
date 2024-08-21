const dateFormat = (dateString) => {
  const date = new Date(dateString);

  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate.replace(",", "")} | ${time}`;
};

export default dateFormat;
