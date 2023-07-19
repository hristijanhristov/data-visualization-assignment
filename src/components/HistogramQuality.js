import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function HistogramQuality({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 50, right: 20, bottom: 50, left: 60};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleLinear()
            .domain([-500, d3.max(data, function(d) { return parseFloat(d.qual); })])
            .range([0, width]);

        const histogram = d3.histogram()
            .value(function(d) { return parseFloat(d.qual); })
            .domain(x.domain())
            .thresholds(x.ticks(70));

        const bins = histogram(data);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(bins, function(d) { return d.length; })]);

        const bar = svg.selectAll(".bar")
            .data(bins)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
            .attr("height", function(d) { return height - y(d.length); })
            .on("mouseover", function(event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                if(d.x0 === 5000){
                    div.html("Quality: 5000" + "<br/>"  + "Frequency: " + d.length)
                } else { div.html("Quality: From " + d.x0 + " to " + d.x1 + "<br/>"  + "Frequency: " + d.length)}
                    div
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d, i) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("fill", "#000")
            .attr("x", width/2)
            .attr("y", 35)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Quality");

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
            .text("Quality and Frequency");

    }, [data]);

    return (
        <svg ref={ref}>
            <g className="plot-area" />
        </svg>
    );
}

export default HistogramQuality;
