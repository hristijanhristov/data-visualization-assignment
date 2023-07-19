import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BarChartType({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 60, right: 40, bottom: 70, left: 60};
        const width = 260 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        const typeData = [
            { type: 'INDEL', frequency: 1679 },
            { type: 'SNP', frequency: 5927 }
        ];

        x.domain(typeData.map(function(d) { return d.type; }));
        y.domain([0, 6000]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", height - 250)
            .attr("x", width / 2)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Type");

        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Type and Frequency");

        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll(".bar")
            .data(typeData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.type); })
            .attr("y", function(d) { return y(d.frequency); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.frequency); })
            .on("mouseover", function(event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Type: " + d.type + "<br/>"  + "Frequency: " + d.frequency)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d, i) {
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

export default BarChartType;
