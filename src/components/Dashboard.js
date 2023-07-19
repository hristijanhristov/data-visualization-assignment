import React, {useEffect, useState} from 'react';
import BarChart from './BarChart';
import BarChartFilter from './BarChartFilter';
import BarChartType from './BarChartType';
import HistogramQuality from './HistogramQuality';
import ScatterPlot from './ScatterPlot';
import ScatterPlotAD from './ScatterPlotAD';
import ScatterPlotAltAD from './ScatterPlotAltAD';
import ScatterPlotReferenceAD from './ScatterPlotReferenceAD';

function Dashboard({data}) {
    const [processedData, setProcessedData] = useState([]);

    useEffect(() => {
        // Count the number of variants per chromosome
        let chromCounts = {};

        data.forEach(variant => {
            if (!chromCounts[variant.chrom]) {
                chromCounts[variant.chrom] = 1;
            } else {
                chromCounts[variant.chrom]++;
            }
        });

        // Convert to the array format expected by BarChart
        let dataArray = [];
        for (let chrom in chromCounts) {
            dataArray.push({chrom, count: chromCounts[chrom]});
        }

        setProcessedData(dataArray);
    }, [data]);

    return (
        <div className="dashboard">
            <h1>Genome Visualization Dashboard</h1>
            <br/><br/>
            <div className="graphs-wrapper">
                <BarChart data={processedData}/>
                <br/><br/>
                <BarChartFilter data={data}/>
                <br/><br/>
                <BarChartType data={data}/>
                <br/><br/>
                <HistogramQuality data={data}/>
                <br/><br/>
                <ScatterPlot data={data}/>
                <br/><br/>
                <ScatterPlotAltAD data={data}/>
                <br/><br/>
                <ScatterPlotReferenceAD data={data}/>
                <br/><br/>
                <ScatterPlotAD data={data}/>
            </div>
        </div>
    );
}

export default Dashboard;
