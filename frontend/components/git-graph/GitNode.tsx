import { GraphNode } from '@/lib/types/git-graph';
import { LAYOUT_CONFIG } from '@/lib/utils/graph-layout';

interface GitNodeProps {
  node: GraphNode;
}

export function GitNode({ node }: GitNodeProps) {
  if (!node.commit) return null;

  return (
    <g className="git-node">
      {/* Blue circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={LAYOUT_CONFIG.NODE_RADIUS}
        fill={LAYOUT_CONFIG.GIT_COLOR}
        stroke="white"
        strokeWidth={2}
      />

      {/* 6-character SHA label to the left */}
      <text
        x={node.x - LAYOUT_CONFIG.NODE_RADIUS - 10}
        y={node.y}
        textAnchor="end"
        dominantBaseline="middle"
        className="text-sm font-mono"
        fill={LAYOUT_CONFIG.GIT_COLOR}
      >
        {node.commit.commit_sha_short}
      </text>
    </g>
  );
}
