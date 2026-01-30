export interface DisciplineData {
  name: string;
  count: number;
}

export function getAllDisciplines(viewer: any): DisciplineData[] {
  const tree = viewer?.model?.getInstanceTree();
  if (!tree) return [];

  const results: DisciplineData[] = [];
  let s15Id: number | null = null;

  // 1. Find the "S15" node
  const findS15 = (id: number) => {
    if (tree.getNodeName(id) === "S15") { s15Id = id; return; }
    tree.enumNodeChildren(id, (childId: number) => {
      if (s15Id === null) findS15(childId);
    });
  };
  findS15(tree.getRootId());

  // 2. Count and collect
  if (s15Id !== null) {
    tree.enumNodeChildren(s15Id, (discId: number) => {
      const name = tree.getNodeName(discId);
      if (name) {
        let count = 0;
        tree.enumNodeChildren(discId, () => { count++; }, true);
        results.push({ name, count });
      }
    });

    // Console Log for Debugging
    console.log("=== DISCIPLINE STATS ===");
    console.table(results);
  }

  return results;
}

export function filterByDiscipline(viewer: any, disciplineName: string | null) {
  if (!viewer || !viewer.model) return;

  const tree = viewer.model.getInstanceTree();
  if (!tree) return;

  // 1. If no discipline is selected, show everything
  if (!disciplineName) {
    viewer.showAll();
    viewer.isolate([]);
    return;
  }

  let s15Id: number | null = null;

  // 2. Recursive search to find "S15" (the same way we found the list)
  const findS15 = (id: number) => {
    if (tree.getNodeName(id) === "S15") {
      s15Id = id;
      return;
    }
    tree.enumNodeChildren(id, (childId: number) => {
      if (s15Id === null) findS15(childId);
    });
  };

  findS15(tree.getRootId());

  // 3. Find the specific discipline and isolate its objects
  if (s15Id !== null) {
    let targetDisciplineId: number | null = null;

    // Look for the child named "Piping", "Civil", etc.
    tree.enumNodeChildren(s15Id, (childId: number) => {
      if (tree.getNodeName(childId) === disciplineName) {
        targetDisciplineId = childId;
      }
    });

    if (targetDisciplineId !== null) {
      const dbIds: number[] = [];
      
      // Collect all leaf nodes under the selected discipline
      tree.enumNodeChildren(targetDisciplineId, (dbId: number) => {
        dbIds.push(dbId);
      }, true); // recursive = true

      viewer.isolate(dbIds);
      viewer.fitToView(dbIds);
    }
  } else {
    console.error("Filter failed: Could not find 'S15' node.");
  }
}
