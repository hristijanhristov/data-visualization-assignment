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

        let chromCounts = {};

        data.forEach(variant => {
            if (!chromCounts[variant.chrom]) {
                chromCounts[variant.chrom] = 1;
            } else {
                chromCounts[variant.chrom]++;
            }
        });

        let dataArray = [];
        for (let chrom in chromCounts) {
            dataArray.push({chrom, count: chromCounts[chrom]});
        }

        setProcessedData(dataArray);
    }, [data]);

    return (
        <div className="dashboard">
            <h1>Genome Visualization Dashboard</h1>
            <div className="graphs-wrapper">
                <BarChart data={processedData}/>
                <BarChartFilter data={data}/>
                <BarChartType data={data}/>
                <HistogramQuality data={data}/>
                <ScatterPlot data={data}/>
                <ScatterPlotAltAD data={data}/>
                <ScatterPlotReferenceAD data={data}/>
                <ScatterPlotAD data={data}/>
            </div>
        </div>
    );
}

export default Dashboard;
