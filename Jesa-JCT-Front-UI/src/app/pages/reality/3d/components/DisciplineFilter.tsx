import { useEffect, useState } from "react";
import { getAllDisciplines, filterByDiscipline, DisciplineData } from "../services/viewerUtils";

interface Props {
  viewer: any;
}

export const DisciplineFilter = ({ viewer }: Props) => {
  // 1. Update state type to hold objects
  const [disciplines, setDisciplines] = useState<DisciplineData[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (!viewer) return;

    const updateList = () => {
      const data = getAllDisciplines(viewer);
      setDisciplines(data);
    };

    viewer.addEventListener("geometryLoaded", updateList);
    viewer.addEventListener("objectTreeCreated", updateList);

    if (viewer.model) updateList();

    return () => {
      viewer.removeEventListener("geometryLoaded", updateList);
      viewer.removeEventListener("objectTreeCreated", updateList);
    };
  }, [viewer]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    filterByDiscipline(viewer, value || null);
  };

  return (
    <div className="mb-3">
      <select className="form-select shadow-sm" value={selected} onChange={handleChange}>
        <option value="">All Elements</option>
        {disciplines.map((d) => (
          <option key={d.name} value={d.name}>
            {d.name} ({d.count})
          </option>
        ))}
      </select>
    </div>
  );
};