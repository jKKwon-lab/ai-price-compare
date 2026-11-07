"use client"
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const router = useRouter()
  const [models, setModels] = useState<any[]>([])
  const [modelA, setModelA] = useState("")
  const [modelB, setModelB] = useState("")

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('ai_models').select('*').order('provider', { ascending: true })
      if (data && data.length > 0) {
        setModels(data)
        setModelA(data[0].id)
        setModelB(data[1]?.id || data[0].id)
      }
    }
    fetchData()
  }, [])

const goCompare = () => {
  if (modelA === modelB) {
    alert("서로 다른 모델을 선택해주세요.")
    return
  }
  // 특수문자(: 등)가 URL에서 깨지지 않도록 안전하게 인코딩하여 이동
  router.push(`/compare/${encodeURIComponent(modelA)}/vs/${encodeURIComponent(modelB)}`)
}

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">글로벌 AI 모델 실시간 단가 비교표</h1>
      
      <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-blue-800">⚡ 빠르고 간편하게 비교하기</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <select className="w-full p-3 border rounded-lg" value={modelA} onChange={(e) => setModelA(e.target.value)}>
            {models.map(m => <option key={`a-${m.id}`} value={m.id}>{m.provider.toUpperCase()} - {m.name}</option>)}
          </select>
          <span className="font-black text-gray-400">VS</span>
          <select className="w-full p-3 border rounded-lg" value={modelB} onChange={(e) => setModelB(e.target.value)}>
            {models.map(m => <option key={`b-${m.id}`} value={m.id}>{m.provider.toUpperCase()} - {m.name}</option>)}
          </select>
          <button onClick={goCompare} className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 whitespace-nowrap">
            비교 결과 보기
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto shadow-sm border rounded-lg">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold text-gray-700">제공사</th>
              <th className="p-4 font-semibold text-gray-700">모델 ID</th>
              <th className="p-4 font-semibold text-gray-700">모델명</th>
              <th className="p-4 font-semibold text-gray-700">입력 단가 ($/1M)</th>
              <th className="p-4 font-semibold text-gray-700">출력 단가 ($/1M)</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="border-b hover:bg-gray-50">
                <td className="p-4 uppercase text-sm font-bold text-gray-500">{model.provider}</td>
                <td className="p-4 font-mono text-xs text-blue-500">{model.id}</td>
                <td className="p-4 font-medium text-gray-800">{model.name}</td>
                <td className="p-4 text-blue-600 font-medium">${model.input_price_per_1m}</td>
                <td className="p-4 text-red-600 font-medium">${model.output_price_per_1m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}