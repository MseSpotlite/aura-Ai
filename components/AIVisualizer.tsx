import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { WaveOptions, AIState } from '../types';

interface AIVisualizerProps {
  options: WaveOptions;
  state: AIState;
}

const AIVisualizer: React.FC<AIVisualizerProps> = ({ options, state }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameId = useRef<number | null>(null);
  // Use a ref to store the current animated values. This persists across re-renders
  // and allows for smooth transitions from old values to new `options`.
  const currentValues = useRef<WaveOptions>({ ...options });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = svg.node()!.getBoundingClientRect();

    const lineGenerator = d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveBasis);

    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001;
      const easeFactor = 0.08;

      // Determine target parameters based on AI state and props
      let targetAmplitude: number;
      let targetSpeed: number;

      if (state === 'thinking') {
        targetAmplitude = options.amplitude * 1.8;
        targetSpeed = options.speed * 2.5;
      } else if (state === 'speaking') {
        const pulseFast = Math.sin(elapsed * 18) * (options.amplitude * 0.12);
        const pulseSlow = Math.sin(elapsed * 4) * (options.amplitude * 0.20);
        targetAmplitude = options.amplitude + pulseFast + pulseSlow;
        targetSpeed = options.speed * 1.4;
      } else { // 'idle'
        targetAmplitude = options.amplitude;
        targetSpeed = options.speed;
      }

      // Smoothly transition all current values in the ref towards their targets
      currentValues.current.amplitude += (targetAmplitude - currentValues.current.amplitude) * easeFactor;
      currentValues.current.speed += (targetSpeed - currentValues.current.speed) * easeFactor;
      currentValues.current.frequency += (options.frequency - currentValues.current.frequency) * easeFactor;
      currentValues.current.waveCount += (options.waveCount - currentValues.current.waveCount) * easeFactor;
      currentValues.current.color1 = d3.interpolateRgb(currentValues.current.color1, options.color1)(easeFactor);
      currentValues.current.color2 = d3.interpolateRgb(currentValues.current.color2, options.color2)(easeFactor);
      // Background color is handled by CSS on the root element, no need to animate here.

      const { waveCount, amplitude, frequency, speed, color1, color2 } = currentValues.current;
      const colorScale = d3.interpolate(color1, color2);
      
      svg.selectAll('path').remove();

      for (let i = 0; i < waveCount; i++) {
        const pathData: [number, number][] = [];
        const yOffset = height / 2 + (i - (waveCount - 1) / 2) * (amplitude / waveCount * 0.5);
        const freqMultiplier = (i + 1) * 0.5;
        const speedMultiplier = (i + 1) * 0.2;

        for (let x = -10; x <= width + 10; x += 10) {
          const sinX = (x / (frequency * freqMultiplier)) + (elapsed * speed * speedMultiplier);
          const y = yOffset + Math.sin(sinX) * amplitude * ((waveCount - i) / waveCount);
          pathData.push([x, y]);
        }
        
        svg.append('path')
          .datum(pathData)
          .attr('d', lineGenerator)
          .attr('fill', 'none')
          .attr('stroke', colorScale(i / (waveCount - 1 || 1)))
          .attr('stroke-width', 5)
          .attr('stroke-opacity', 0.6 + (i / waveCount) * 1.8);
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
    animate();

    return () => {
      if(animationFrameId.current){
         cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [options, state]); // Rerun effect when options or state change

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default AIVisualizer;