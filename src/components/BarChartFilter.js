import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BarChartFilter({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 50, right: 20, bottom: 150, left: 60};
        const width = 960 - margin.left - margin.right; // Increased SVG width
        const height = 500 - margin.top - margin.bottom;

        // Create a new array by splitting the filter field of each data point
        const allFilters = data.flatMap(d => d.filter.split(';'));

        // Create an object where keys are unique filter types and values are their counts
        const filterCounts = allFilters.reduce((counts, filter) => {
            counts[filter] = (counts[filter] || 0) + 1;
            return counts;
        }, {});

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand()
            .domain(Object.keys(filterCounts))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(Object.values(filterCounts))])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .append("text")
            .attr("fill", "#000")
            .attr("x", width/2)
            .attr("y", 75)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Filter");

        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height/2)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Filter and Frequency");

        svg.selectAll(".bar")
            .data(Object.entries(filterCounts)) // Convert our object to an array of [key, value] pairs
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d[0]))
            .attr("y", d => y(d[1]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d[1]))
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Filter: " + d[0] + "<br/>Frequency: " + d[1])
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (d) => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }, [data]);

    return (
        <svg ref={ref}>
            <g className="plot-area" />
        </svg>
    );
}

export default BarChartFilter;
