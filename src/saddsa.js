
function bubbleSort() {
  var sortedCount = 0;

  function sortPass(i) {
    if (!unsortedArray.length || stop) return (stop = false);

    if (i <= unsortedArray.length) {
      if (unsortedArray[i] < unsortedArray[i - 1]) {
        d3.select("#rect" + unsortedArray[i]).attr("class", "testing");
        d3.select("#rect" + unsortedArray[i - 1]).attr("class", "testing");

        d3.timeout(function () {
          d3.select("#rect" + unsortedArray[i]).attr("class", "");
          d3.select("#rect" + unsortedArray[i - 1]).attr("class", "");
        }, durationTime);

        var temp = unsortedArray[i - 1];
        unsortedArray[i - 1] = unsortedArray[i];
        unsortedArray[i] = temp;

        slide(unsortedArray[i], i + sortedArray);
        slide(unsortedArray[i - 1], i - 1 + sortedArray);

        d3.select("#counter").html(++steps);

        d3.timeout(function () {
          return sortPass(++i);
        }, durationTime);
      } else if (i == unsortedArray.length) {
        for (n = i; n == unsortedArray[n - 1]; n--) {
          d3.select("#text" + n).attr("class", "sorted");
          unsortedArray.pop();
        }

        sortPass(++i);
      } else {
        sortPass(++i);
      }
    } else {
      bubbleSort();
    }
  }
  sortPass(1);
}
