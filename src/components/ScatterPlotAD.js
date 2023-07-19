import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ScatterPlotAD({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = {top: 80, right: 40, bottom: 40, left: 60};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLog().range([height, 0]);

        const validData = data.filter(d => d.info && d.info[5] && d.info[5].AD).map(d => {
            return { ...d, chrom: d.chrom === 'X' ? 23 : d.chrom }
        });

        x.domain([0, d3.max(validData, d => Number(d.chrom))]);
        y.domain([1, 10000]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".dot")
            .data(validData)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", d => x(+d.chrom))
            .attr("cy", d => y(Number(d.info[5].AD.split(',')[0]) + 1))
            .attr("fill", "blue")

        svg.selectAll(".dot2")
            .data(validData)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", d => x(+d.chrom))
            .attr("cy", d => y(Number(d.info[5].AD.split(',')[1]) + 1))
            .attr("fill", "red")



        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Allele Depth");

        svg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height - margin.top + 110) + ")")
            .style("text-anchor", "middle")
            .text("Chromosome");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Chromosomes vs Alternate and Reference Allele Depth");
    }, [data]);

    return (
        <svg ref={ref} width="960" height="500">
            <g className="plot-area" />
        </svg>
    );
}

export default ScatterPlotAD;
