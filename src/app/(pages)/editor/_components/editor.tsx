import React from 'react';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const get = async () => {
    
}

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 100, y: 200 }, data: { label: '3' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function Editor() {
  return (
    <div className="w-full h-[92vh]">
      <ReactFlow nodes={initialNodes} edges={initialEdges} >        <Background //@ts-ignore
          variant="dots"
          gap={20}
          size={2}
        />
                <Controls position='top-left' aria-label="Controls" />
                <MiniMap position='bottom-left' pannable zoomable ariaLabel="Mini Map" />

</ReactFlow>
    </div>
  );
}