import React from 'react';

const LogSheetSVG = ({ dayNumber, events }) => {
    const width = 1200;
    const height = 600;
    const gridColor = '#5271C2';
    const lineColor = 'black';
    const nodeColor = 'red';
    
    const gridX = 180;
    const gridY = 80;
    const gridW = 950;
    const gridH = 240;
    const rowH = gridH / 4;
    
    const hoursLabels = ["Midnight", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "Noon", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "Midnight"];
    const statuses = ['off_duty', 'sleeper_berth', 'driving', 'on_duty'];

    // Process events to lines
    let currentTimeHrs = 0.0;
    let prevX = null;
    let prevY = null;
    
    const hosLines = [];
    const hosNodes = [];
    const remarks = [];

    // Filter events for this specific day
    const dayEvents = events.filter(e => e.day === dayNumber);

    dayEvents.forEach((event, idx) => {
        let status = event.status;
        if (!statuses.includes(status)) {
            if (status === '10-Hour Rest (Sleeper Berth)') status = 'sleeper_berth';
            else status = status.includes('off') ? 'off_duty' : 'on_duty';
        }
        
        const duration = event.duration;
        const endTimeHrs = currentTimeHrs + duration;
        if (currentTimeHrs >= 24.0) return;
        const actualEnd = Math.min(24.0, endTimeHrs);
        
        let rowIdx = statuses.indexOf(status);
        if (rowIdx === -1) rowIdx = 0;
        
        const y = gridY + rowIdx * rowH;
        const x1 = gridX + (currentTimeHrs / 24.0) * gridW;
        const x2 = gridX + (actualEnd / 24.0) * gridW;
        
        // Vertical line
        if (prevX !== null && prevY !== null && prevY !== y) {
            hosLines.push(<line key={`v_${idx}`} x1={prevX} y1={prevY} x2={x1} y2={y} stroke={lineColor} strokeWidth="5" strokeLinecap="round" />);
            hosNodes.push(<circle key={`nv1_${idx}`} cx={x1} cy={prevY} r="5" fill={nodeColor} />);
            hosNodes.push(<circle key={`nv2_${idx}`} cx={x1} cy={y} r="5" fill={nodeColor} />);
        } else if (prevX === null) {
            hosNodes.push(<circle key={`nfirst_${idx}`} cx={x1} cy={y} r="5" fill={nodeColor} />);
        }
        
        // Horizontal line
        hosLines.push(<line key={`h_${idx}`} x1={x1} y1={y} x2={x2} y2={y} stroke={lineColor} strokeWidth="6" strokeLinecap="round" />);
        hosNodes.push(<circle key={`nend_${idx}`} cx={x2} cy={y} r="5" fill={nodeColor} />);
        
        // Remarks
        if (event.label && event.label !== 'Driving') {
            const remY = gridY + gridH + 30;
            remarks.push(
                <g key={`rem_${idx}`}>
                    <line x1={x1} y1={gridY + gridH + 15} x2={x1} y2={remY} stroke="black" strokeWidth="3" />
                    <text x={x1 - 5} y={remY + 15} fill="black" fontSize="18" fontWeight="bold" transform={`rotate(45, ${x1 - 5}, ${remY + 15})`}>
                        {event.label}
                    </text>
                </g>
            );
        }
        
        prevX = x2;
        prevY = y;
        currentTimeHrs = endTimeHrs;
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white font-sans rounded-xl p-4">
            <style>
                {`
                text { font-family: ui-sans-serif, system-ui, sans-serif; }
                `}
            </style>
            
            {/* Grid Hours Text */}
            {hoursLabels.map((label, i) => {
                const x = gridX + i * (gridW / 24.0);
                const isMidnight = label === "Midnight";
                return (
                    <g key={`hl_${i}`}>
                        <text x={x - (isMidnight ? 25 : 5)} y={gridY - 20} fill={gridColor} fontSize="14" fontWeight="500">
                            {label}
                        </text>
                        <text x={x - (isMidnight ? 25 : 5)} y={gridY + gridH + 25} fill={gridColor} fontSize="14" fontWeight="500">
                            {label}
                        </text>
                    </g>
                );
            })}
            <text x={gridX + gridW + 15} y={gridY - 25} fill={gridColor} fontSize="14" fontWeight="500">Total</text>
            <text x={gridX + gridW + 15} y={gridY - 10} fill={gridColor} fontSize="14" fontWeight="500">Hours</text>
            
            {/* Status Labels */}
            <text x="20" y={gridY + 0 * rowH + 15} fill={gridColor} fontWeight="bold" fontSize="16">1: OFF DUTY</text>
            <text x="20" y={gridY + 1 * rowH + 5} fill={gridColor} fontWeight="bold" fontSize="16">2: SLEEPER</text>
            <text x="45" y={gridY + 1 * rowH + 25} fill={gridColor} fontWeight="bold" fontSize="16">BERTH</text>
            <text x="20" y={gridY + 2 * rowH + 15} fill={gridColor} fontWeight="bold" fontSize="16">3: DRIVING</text>
            <text x="20" y={gridY + 3 * rowH + 5} fill={gridColor} fontWeight="bold" fontSize="16">4: ON DUTY</text>
            <text x="45" y={gridY + 3 * rowH + 25} fill={gridColor} fontWeight="bold" fontSize="16">(NOT DRIVING)</text>
            
            {/* Horizontal Grid Lines */}
            {[0, 1, 2, 3, 4].map(i => {
                const y = gridY + i * rowH;
                return <line key={`hgl_${i}`} x1={gridX} y1={y} x2={gridX + gridW} y2={y} stroke={gridColor} strokeWidth="2" />;
            })}
            
            {/* Vertical Ticks */}
            {Array.from({ length: 25 }).map((_, h) => {
                const x = gridX + h * (gridW / 24.0);
                const isMainHour = h === 0 || h === 24;
                const ticks = [];
                
                // Main hour line
                ticks.push(<line key={`vt_${h}`} x1={x} y1={gridY} x2={x} y2={gridY + gridH} stroke={gridColor} strokeWidth={isMainHour ? "2" : "1"} />);
                // Bottom main tick for remarks
                ticks.push(<line key={`vbt_${h}`} x1={x} y1={gridY + gridH} x2={x} y2={gridY + gridH + 15} stroke={gridColor} strokeWidth="2" />);
                
                if (h < 24) {
                    for (let q = 1; q < 4; q++) {
                        const qx = x + q * (gridW / 96.0);
                        const tickLen = q === 2 ? rowH / 2 : rowH / 4;
                        
                        // Bottom remark ticks
                        ticks.push(<line key={`vrb_${h}_${q}`} x1={qx} y1={gridY + gridH} x2={qx} y2={gridY + gridH + (q === 2 ? 10 : 5)} stroke={gridColor} strokeWidth="1" />);
                        
                        // Row ticks
                        for (let r = 0; r < 4; r++) {
                            const ry = gridY + r * rowH;
                            ticks.push(<line key={`rt_${h}_${q}_${r}_1`} x1={qx} y1={ry} x2={qx} y2={ry + tickLen} stroke={gridColor} strokeWidth="1" />);
                            if (r < 3) {
                                ticks.push(<line key={`rt_${h}_${q}_${r}_2`} x1={qx} y1={ry + rowH} x2={qx} y2={ry + rowH - tickLen} stroke={gridColor} strokeWidth="1" />);
                            } else {
                                ticks.push(<line key={`rt_${h}_${q}_${r}_3`} x1={qx} y1={gridY + gridH} x2={qx} y2={gridY + gridH - tickLen} stroke={gridColor} strokeWidth="1" />);
                            }
                        }
                    }
                }
                return <g key={`hour_${h}`}>{ticks}</g>;
            })}
            
            {/* REMARKS Title */}
            <text x="20" y={gridY + gridH + 60} fill={gridColor} fontWeight="bold" fontSize="32">REMARKS</text>
            
            {/* HOS GRAPH */}
            {hosLines}
            {hosNodes}
            {remarks}
        </svg>
    );
};

export default LogSheetSVG;
