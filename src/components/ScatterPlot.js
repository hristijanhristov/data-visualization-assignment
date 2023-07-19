import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ScatterPlot({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 50, right: 100, bottom: 50, left: 90};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scalePoint()
            .domain(data.map(function(d) { return d.chrom; }))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.pos; })])
            .range([height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y).tickFormat(d3.format(".2e"));

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("fill", "#000")
            .attr("x", width/2)
            .attr("y", 35)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Chromosome");

        svg.append("g")
            .call(yAxis)
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height/2)
            .attr("dy", "-0.1em")
            .attr("text-anchor", "end")
            .text("Position");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Chromosomes vs Position");

        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return x(d.chrom); })
            .attr("cy", function(d) { return y(d.pos); })
            .attr("r", 1.5)
            .style("fill", "#69b3a2")
            .on("mouseover", function(event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Chromosome: " + d.chrom + "<br/>"  + "Position: " + d3.format(".2e")(d.pos))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
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

export default ScatterPlot;
