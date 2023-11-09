const calculateRange = (total, currentPage, rangeToShow) => {
  const range = [];
  const halfRange = Math.floor(rangeToShow / 2);

  if (total <= rangeToShow) {
    // If there are fewer pages than rangeToShow, show all pages
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
  } else {
    if (currentPage <= halfRange) {
      // Show the first pages when the current page is near the beginning
      for (let i = 1; i <= rangeToShow - 2; i++) {
        range.push(i);
      }
      range.push("...");
      range.push(total);
    } else if (currentPage >= total - halfRange) {
      // Show the last pages when the current page is near the end
      range.push(1);
      range.push("...");
      for (let i = total - (rangeToShow - 2); i <= total; i++) {
        range.push(i);
      }
    } else {
      // Show a range with '...' in the middle
      range.push(1);
      range.push("...");
      for (
        let i = currentPage - halfRange + 2;
        i <= currentPage + halfRange - 2;
        i++
      ) {
        range.push(i);
      }
      range.push("...");
      range.push(total);
    }
  }

  return range;
};

export { calculateRange };
