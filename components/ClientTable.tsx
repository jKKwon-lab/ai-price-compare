"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 모델 데이터 타입 정의
type Model = {
  id: string;
  name: string;
  provider: string;
  input_price_per_1m: number;
  output_price_per_1m: number;
};

export default function ClientTable({ models }: { models: Model[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Model; direction: "asc" | "desc" } | null>(null);
  
  // 상단 비교용 Select State
  const [modelA, setModelA] = useState(models[0]?.id || "");
  const [modelB, setModelB] = useState(models[1]?.id || "");

  // 1. 필터링 및 검색 로직
  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) || model.id.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === "ALL" || model.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  // 2. 정렬 로직
  const sortedModels = [...filteredModels].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Model) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCompare = () => {
    if (modelA && modelB) {
      router.push(`/compare/${encodeURIComponent(modelA)}/vs/${encodeURIComponent(modelB)}`);
    }
  };

  // 중복 없는 제공자 목록 추출
  const providers = Array.from(new Set(models.map((m) => m.provider)));

  return (
    <div className="space-y-8">
      {/* 상단 비교 섹션 */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-4">
          <select value={modelA} onChange={(e) => setModelA(e.target.value)} className="w-full p-3 rounded-md border">
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.provider} - {m.name}</option>
            ))}
          </select>
          <span className="font-bold text-gray-400">VS</span>
          <select value={modelB} onChange={(e) => setModelB(e.target.value)} className="w-full p-3 rounded-md border">
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.provider} - {m.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleCompare} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md whitespace-nowrap transition">
          비교 결과 보기
        </button>
      </div>

      {/* 검색 및 필터 컨트롤 */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="모델명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded-md"
        />
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          className="p-3 border rounded-md w-48 uppercase"
        >
          <option value="ALL">모든 제공자</option>
          {providers.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* 데이터 테이블 */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("provider")}>제공사 ↕</th>
              <th className="p-4">모델 ID</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("name")}>모델명 ↕</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("input_price_per_1m")}>입력 단가 ($/1M) ↕</th>
              <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("output_price_per_1m")}>출력 단가 ($/1M) ↕</th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model) => (
              <tr key={model.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-500 uppercase text-sm">{model.provider}</td>
                <td className="p-4 text-blue-500 text-sm">{model.id}</td>
                <td className="p-4">{model.name}</td>
                <td className="p-4 font-semibold text-blue-600">${model.input_price_per_1m}</td>
                <td className="p-4 font-semibold text-red-600">${model.output_price_per_1m}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedModels.length === 0 && (
          <div className="p-8 text-center text-gray-500">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}