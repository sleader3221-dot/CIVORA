"use client";

import { Background, Controls, ReactFlow, type Edge, type Node } from "@xyflow/react";
import type { EntityRecord, EntityRelationship, InvestigationCase } from "@/lib/types";

export function EntityGraph({
  entities,
  relationships,
  cases = []
}: {
  entities: EntityRecord[];
  relationships: EntityRelationship[];
  cases?: InvestigationCase[];
}) {
  const nodes: Node[] = [
    ...entities.slice(0, 18).map((entity, index) => ({
      id: entity.id,
      data: { label: `${entity.type}: ${entity.label}` },
      position: { x: (index % 4) * 230, y: Math.floor(index / 4) * 105 },
      style: {
        background: entity.riskScore >= 80 ? "#3b1119" : "#101827",
        color: "#f8fafc",
        border: `1px solid ${entity.riskScore >= 80 ? "#fb7185" : "#334155"}`,
        borderRadius: 14,
        width: 190,
        fontSize: 12
      }
    })),
    ...cases.slice(0, 5).map((caseRecord, index) => ({
      id: caseRecord.id,
      data: { label: `case: ${caseRecord.riskScore}/100` },
      position: { x: 940, y: index * 105 },
      style: {
        background: "#1e1b4b",
        color: "#f8fafc",
        border: "1px solid #c4b5fd",
        borderRadius: 14,
        width: 150,
        fontSize: 12
      }
    }))
  ];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges: Edge[] = relationships
    .filter((relationship) => nodeIds.has(relationship.source) && nodeIds.has(relationship.target))
    .slice(0, 35)
    .map((relationship) => ({
      id: relationship.id,
      source: relationship.source,
      target: relationship.target,
      label: relationship.label,
      style: { stroke: "#7dd3fc" },
      labelStyle: { fill: "#cbd5e1", fontSize: 11 }
    }));

  return (
    <div className="graph-panel">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#334155" gap={18} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
