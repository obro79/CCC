import { GraphNode } from '@/lib/types/git-graph';
import { LAYOUT_CONFIG } from '@/lib/utils/graph-layout';

interface ClaudeNodeProps {
  node: GraphNode;
}

export function ClaudeNode({ node }: ClaudeNodeProps) {
  if (!node.context) return null;

  return (
    <g className="claude-node">
      {/* Orange circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={LAYOUT_CONFIG.NODE_RADIUS}
        fill={LAYOUT_CONFIG.CLAUDE_COLOR}
        stroke="white"
        strokeWidth={2}
      />
      {/* No label per user request */}
    </g>
  );
}
