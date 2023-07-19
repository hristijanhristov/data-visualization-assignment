import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ScatterPlotAltAD({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 60, right: 40, bottom: 30, left: 60};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLog().range([height, 0]);

        const validData = data.filter(d => d.info[5] && d.info[5].AD);

        x.domain(validData.map(d => d.chrom));
        y.domain([1, 4000]);

        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll('circle')
            .data(validData)
            .join('circle')
            .attr("cx", d => x(d.chrom) + x.bandwidth() / 2)
            .attr("cy", d => y(Number(d.info[5].AD.split(',')[1]) + 1))
            .attr("r", 2)
            .attr("fill", 'red')
            .on("mouseover", function(event, d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Chromosome: " + d.chrom + "<br/>"  + "Alternate Allele Depth: " + d.info[5].AD.split(',')[1])
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .append('text')
            .attr('x', width / 2)
            .attr('y', margin.bottom)
            .attr('fill', 'black')
            .text('Chromosome');

        svg.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 30)
            .attr('x', -height / 2)
            .attr('fill', 'black')
            .text('Alternate Allele Depth');

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Chromosomes vs Alternate Allele Depth");
    }, [data]);

    return (
        <svg ref={ref} width="960" height="500">
            <g className="plot-area" />
        </svg>
    );
}

export default ScatterPlotAltAD;
