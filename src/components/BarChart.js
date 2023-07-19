import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BarChart({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 60, right: 20, bottom: 50, left: 60};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);
        const color = d3.scaleLinear().range(["lightblue", "darkblue"]);

        x.domain(data.map(function(d) { return d.chrom; }));
        y.domain([0, d3.max(data, function(d) { return d.count; })]);
        color.domain([0, d3.max(data, function(d) { return d.count; })]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "#000")
            .attr("x", width / 2)
            .attr("y", 35)
            .attr("text-anchor", "end")
            .text("Chromosome");

        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("text-anchor", "end")
            .text("Variant Data Count");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Chromosomes vs Variant Data Count");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.chrom); })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.count); })
            .attr("fill", function(d) { return color(d.count); })
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Chromosome: ${d.chrom} <br/> Count: ${d.count}`)
                    .style("left", `${event.pageX}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function(d) {
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

export default BarChart;
