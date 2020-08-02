import "./chart.css";
import * as d3 from "d3";
import React, { useContext, useEffect, useRef } from "react";
import { ChartContext } from "./ChartContext";

const D3Component = () => {
  let stop = false;
  const { data, arrayLength, unsortedData, sortedData, speed } = useContext(
    ChartContext
  );

  const d3Container = useRef(null),
    width = 1200,
    height = 500,
    margin = { top: 50, right: 50, bottom: 50, left: 50 },
    padding = { x: 20, y: 5 };

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data)])
    .range([padding.y, height - margin.top - margin.bottom]);

  let xScale = d3
    .scaleLinear()
    .domain([0, arrayLength])
    .range([0, width + padding.x]);

  useEffect(() => {
    if (d3Container.current) {
      // refresh SVG on each render to avoid bugs
      d3.selectAll("rect").remove();

      // select svg - ref
      let svg = d3.select(d3Container.current);

      // set gradient color
      let gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "40%")
        .attr("y2", "100%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "var(--red)")
        .attr("stop-opacity", 0.9);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "var(--blue)")
        .attr("stop-opacity", 0.9);

      // create bar chart
      let rect = svg
        .selectAll("rect")
        .data(unsortedData)
        .enter()
        .append("rect")
        .attr("width", width / arrayLength)
        .attr("height", 0)
        .attr("transform", (d, idx) => `translate(${xScale(idx)}, 0)`)
        .attr("y", height)
        .attr("class", "bar")
        .attr("id", (d) => `rect-${d}`)
        .style("fill", "url(#gradient)");

      rect
        .transition()
        .duration(1500)
        .attr("height", (d) => yScale(d))
        .attr("y", (d) => height - yScale(d))
        .delay((d, idx) => idx * (1000 / arrayLength))
        .ease(d3.easeElastic);
    }
  }, [unsortedData, arrayLength, xScale, yScale]);

  /*
  ====================================================================================
  =================================  INSERTION SORT  =================================
  ====================================================================================
  */

  function insertionSort() {
    var value = unsortedData.shift();
    sortedData.push(value);

    swap(sortedData.length - 1);

    function swap(n) {
      if (stop) return (stop = !stop);

      d3.select(`#rect-${value}`).style("fill", "red");

      if (n > 0 && sortedData[n - 1] > value) {
        d3.timeout(() => {
          sortedData.splice(n, 1);
          sortedData.splice(n - 1, 0, value);

          d3.transition()
            .duration(100)
            .ease(d3.easePolyInOut)
            .select(`#rect-${sortedData[n]}`)
            .attr("transform", (d) => `translate(${xScale(n)}, 0)`);

          d3.transition()
            .duration(100)
            .ease(d3.easePolyOut)
            .select(`#rect-${sortedData[n - 1]}`)
            .attr("transform", (d) => `translate(${xScale(n - 1)}, 0)`);

          swap(--n);
        }, speed);
      } else if (unsortedData.length) {
        d3.timeout(() => {
          d3.select(`#rect-${sortedData[n - 1]}`).style("fill", "var(--grass)");
          d3.select(`#rect-${sortedData[n]}`).style("fill", "var(--grass)");

          insertionSort();
        }, speed);
      } else {
        d3.timeout(() => {
          d3.selectAll("rect")
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .style("fill", "url(#gradient)");
        }, 500);
      }
    }
  }
  /*
  ====================================================================================
  ==================================  BUBBLE SORT  ===================================
  ====================================================================================
  */

  function bubbleSort(array, i = 0, j = 0) {
    if (stop) return (stop = !stop);

    if (array[i + 1]) {
      if (array[i] > array[i + 1]) {
        // mark them red for transition
        d3.select(`#rect-${array[i]}`).style("fill", "var(--red)");
        d3.select(`#rect-${array[i + 1]}`).style("fill", "var(--red)");

        // unmark them after timeout
        d3.timeout(function () {
          d3.select(`#rect-${array[i]}`).style("fill", "var(--grass)");
          d3.select(`#rect-${array[i + 1]}`).style("fill", "var(--grass)");
        }, speed);

        // swap values
        let value = array[i + 1];
        array[i + 1] = array[i];
        array[i] = value;

        // move bar animations
        d3.transition()
          .duration(100)
          .ease(d3.easeCubicOut)
          .select(`#rect-${array[i]}`)
          .attr("transform", (d) => `translate(${xScale(i)}, 0)`);

        d3.transition()
          .duration(100)
          .ease(d3.easeCubicOut)
          .select(`#rect-${array[i + 1]}`)
          .attr("transform", (d) => `translate(${xScale(i + 1)}, 0)`);

        // recursion i + 1
        d3.timeout(() => {
          return bubbleSort(array, ++i, j);
        }, speed);

        // if not greater value than next value recursion i + 1
      } else {
        bubbleSort(array, ++i, j);
      }

      // if there is array[j+1] while !array[i+1] reset i and recursion j+1 i=0
    } else if (array[j + 1]) {
      d3.select(`#rect-${array[i - j]}`).style("fill", "url(#gradient)");
      bubbleSort(array, (i = 0), ++j);

      // if !array[i+1] and !array[j+1] means we checked all i and j values so return
    } else {
      d3.timeout(() => {
        d3.selectAll("rect")
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .style("fill", "url(#gradient)");
      }, 250);
      return;
    }
  }

  /*
  ====================================================================================
  ==================================  QUICK SORT  ====================================
  ====================================================================================
  */

  function quickSort(array, pivot = 0) {
    let len = array.length;
    if (len) {
      pivot = Math.floor(len / 2);
      let smaller = [];
      let larger = [];

      d3.timeout(() => {
        swap();
      }, speed);

      function swap(i = 1) {
        if (stop) return (stop = !stop);

        if (i < len) {
          if (array[i] < pivot) {
            smaller.push(array[i]);

            d3.select(`#rect-${pivot}`)
              .style("fill", "var(--grass)")
              .transition()
              .duration(100)
              .ease(d3.easeCubicOut)
              .attr("transform", (d) => `translate(${xScale(pivot)}, 0)`);

            d3.select(`#rect-${i}`)
              .transition()
              .style("fill", "var(--grass)")
              .transition()
              .duration(100)
              .ease(d3.easeCubicOut)
              .attr("transform", (d) => `translate(${xScale(i)}, 0)`);

            d3.timeout(() => {
              swap(++i);
            }, speed);
          } else {
            larger.push(array[i]);

            d3.select(`#rect-${pivot}`)
              .style("fill", "var(--grass)")
              .transition()
              .duration(100)
              .ease(d3.easeCubicOut)
              .attr("transform", (d) => `translate(${xScale(pivot)}, 0)`);

            d3.select(`#rect-${i}`)
              .style("fill", "var(--grass)")
              .transition()
              .duration(100)
              .ease(d3.easeCubicOut)
              .attr("transform", (d) => `translate(${xScale(i)}, 0)`);

            d3.timeout(() => {
              swap(++i);
            }, speed);
          }
        } else {
          d3.select(`#rect-${pivot}`)
            .style("fill", "var(--grass)")
            .transition()
            .duration(100)
            .ease(d3.easeCubicOut)
            .attr("transform", (d) => `translate(${xScale(pivot)}, 0)`);
          d3.select(`#rect-${i}`)
            .transition()
            .style("fill", "var(--grass)")
            .duration(100)
            .ease(d3.easeCubicOut)
            .attr("transform", (d) => `translate(${xScale(i)}, 0)`);
          return;
        }
      }
      return quickSort(smaller).concat(pivot, quickSort(larger));
    } else {
      return array;
    }
  }

  /*
  ====================================================================================
  ================================  SELECTION SORT  ==================================
  ====================================================================================
  */

  function selectionSort() {
    let min = Infinity,
      spliceIndex,
      i = 0;

    getMinValue();

    function getMinValue() {
      if (stop) return (stop = !stop);

      d3.timeout(() => {
        if (unsortedData.length >= i) {
          d3.select(`#rect-${unsortedData[i]}`).style("fill", "var(--red)");

          d3.timeout(() => {
            d3.select(`#rect-${unsortedData[i]}`).style(
              "fill",
              "url(#gradient)"
            );

            if (unsortedData[i] <= min) {
              d3.select(`#rect-${min}`).style("fill", "url(#gradient)");
              min = unsortedData[(spliceIndex = i)];

              d3.select(`#rect-${min}`).style("fill", "var(--red)");
            }
            i++;

            d3.timeout(() => {
              return getMinValue();
            }, speed / 2);
          }, speed / 2);
        } else {
          sortedData.push(min);
          unsortedData.splice(spliceIndex, 1);

          d3.selectAll("rect")
            .transition()
            .duration(100)
            .style("fill", "url(#gradient)")
            .attr("transform", (d) => {
              let value =
                sortedData.indexOf(d) >= 0
                  ? sortedData.indexOf(d)
                  : unsortedData.indexOf(d) + sortedData.length;

              return `translate(${xScale(value)}, 0)`;
            });

          d3.timeout(() => {
            if (unsortedData.length > 0) selectionSort();
          }, speed);
          return;
        }
      });
    }
  }

  /*
  ====================================================================================
  ==================================  MERGE SORT  ====================================
  ====================================================================================
  */
  function mergeSort() {
    var mergeReps = unsortedData.length.toString(2).length + 1;
    var mergeArrays = [[...unsortedData], []];
    
    for (let i = 0; i < unsortedData.length; i += 2) {
      mergeArrays[1].push(mergeTwo([unsortedData[i]], [unsortedData[i + 1]]));
    }
    for (let n = 2; n < mergeReps; n++) {
      mergeArrays[n] = [];
      var unMerged = mergeArrays[n - 1];
      for (let i = 0; i < unMerged.length; i += 2) {
        mergeArrays[n].push(
          mergeTwo(unMerged[i], unMerged[i + 1] ? unMerged[i + 1] : [])
        );
      }
    }
    for (let i = 1; i < mergeArrays.length; i++) {
      mergeArrays[i] = d3.merge(mergeArrays[i]);
    }
    mergeMove(0);

    function mergeTwo(iArray, nArray) {
      var newArray = [];
      for (let i = 0, n = 0; i < iArray.length || n < nArray.length; ) {
        if (iArray[i] < nArray[n]) {
          newArray.push(iArray[i++]);
        } else if (iArray[i] > nArray[n]) {
          newArray.push(nArray[n++]);
        } else if (!iArray[i]) {
          newArray.push(nArray[n++]);
        } else if (!nArray[n]) {
          newArray.push(iArray[i++]);
        }
      }
      return newArray;
    }

    function mergeMove(j) {
      var oldArray = mergeArrays[j],
        newArray = [...mergeArrays[j + 1]],
        sortedData = [];

      moveStep(0);

      function moveStep(n) {

        d3.select(`#rect-${newArray[n]}`).style("fill", "var(--red)");
        sortedData.push(newArray[n]);
        oldArray.shift();

        d3.selectAll("rect")
          .transition()
          .duration(speed)
          .attr("transform", (d) => {
            var xVal =
              sortedData.indexOf(d) > -1
                ? sortedData.indexOf(d)
                : oldArray.indexOf(d) + sortedData.length;
                console.log(sortedData.indexOf(d),  oldArray.indexOf(d), sortedData.length, xScale(xVal-1), xVal-1)
            return `translate(${xScale(xVal - 1)}, 0)`            
          });
       
        d3.timeout(function () {
          if (oldArray.length > 0) {
            moveStep(++n);
          } else if (mergeArrays[j + 2]) {
            mergeMove(++j);
          } else {
            d3.selectAll("rect").style("fill", "url(#gradient)");
          }
        }, speed);
      }
    }
  }

  // function mergerSort(array) {
  //   let animate = []

  //   mergeSort(array)
  //   // =================================================== //
  //   function merger(arr1, arr2) {
  //     animate.push([...arr1, ...arr2])
  //     let i = 0,
  //       j = 0,
  //       mergedArr = [];
  //     while (i < arr1.length && j < arr2.length) {
  //       if (arr1[i] > arr2[j]) {
  //         mergedArr.push(arr2[j++])
  //       }
  //       else {
  //         mergedArr.push(arr1[i++])
  //       }
  //     }

  //     while (i < arr1.length) {
  //       mergedArr.push(arr1[i++]);
  //     }

  //     while (j < arr2.length) {
  //       mergedArr.push(arr2[j++]);
  //     }
  //     animate.push(mergedArr)
  //     return mergedArr;
  //   }

  //   // =================================================== //
  //   function mergeSort(array) {
  //     if (array.length === 1) return array;
  //     let middle = Math.floor(array.length / 2);
  //     let left = mergeSort(array.slice(0, middle));
  //     let right = mergeSort(array.slice(middle));
  //     return merger(left, right);
  //   }

  //   animation(animate)

  //   function animation(animate) {
  //     for (let i=0; i<animate.length; i += 2) {
  //       for (let j=0; j<animate[i].length; j++) {
  //         console.log(animate[i][j], animate[i+1][j])
  //         d3.transition().duration(1000).select(`#rect-${animate[i][j]}`).attr("transform", (d) => `translate(${xScale(data.indexOf(animate[i+1][j]))}, 0)`);
  //         d3.transition().duration(1000).select(`#rect-${animate[i+1][j]}`).attr("transform", (d) => `translate(${xScale(data.indexOf(animate[i][j]))}, 0)`);
  //         console.log(animate[i], animate[i+1], i, animate, data, unsortedData, sortedData, data.indexOf(animate[i][j]))
  //       }

  //     }
  //   }
  // }

  return (
    <>
      <div className="controls">
        <div className="sort-container">
          <h2>Select Sorting Algorithm</h2>
          <button onClick={() => selectionSort()}>Selection Sort</button>
          <button onClick={() => bubbleSort(unsortedData)}>Bubble Sort</button>
          <button onClick={() => insertionSort()}>Insertion Sort</button>
          <button onClick={() => mergeSort()}>Merge Sort</button>
          <button disabled onClick={() => quickSort(unsortedData)}>
            Quick Sort <br />
            (In progress...)
          </button>
          <button disabled onClick={() => (stop = true)}>Stop</button>
        </div>
      </div>
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.left}
        ref={d3Container}
      />
    </>
  );
};

export default D3Component;
