import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link' // 뒤로가기 버튼용

export const instant = false;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⚡ [프로그래매틱 SEO 핵심] 구글 봇에게 보여줄 동적 제목/설명 자동 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelA: string; modelB: string }>
}) {
  const { modelA, modelB } = await params
  const idA = decodeURIComponent(modelA)
  const idB = decodeURIComponent(modelB)

  const { data: models } = await supabase
    .from('ai_models')
    .select('id, name, provider')
    .in('id', [idA, idB])

  if (!models || models.length < 2) return { title: 'AI 모델 비교' }

  const dataA = models.find((m) => m.id === idA)
  const dataB = models.find((m) => m.id === idB)
  if (!dataA || !dataB) return { title: 'AI 모델 비교' }

  return {
    title: `${dataA.name} vs ${dataB.name} 가격 및 스펙 비교`,
    description: `${dataA.provider}의 ${dataA.name}와(과) ${dataB.provider}의 ${dataB.name} API 단가(입력/출력) 및 컨텍스트 윈도우를 1대1로 비교해 보세요.`
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ modelA: string; modelB: string }>
}) {
  const { modelA, modelB } = await params
  
  const idA = decodeURIComponent(modelA)
  const idB = decodeURIComponent(modelB)

  const { data: models } = await supabase
    .from('ai_models')
    .select('*')
    .in('id', [idA, idB])

  if (!models || models.length < 2) notFound()

  const dataA = models.find((m) => m.id === idA)
  const dataB = models.find((m) => m.id === idB)
  
  if (!dataA || !dataB) notFound()

  return (
    <main className="max-w-4xl mx-auto p-8 relative">
      {/* 홈으로 돌아가기 버튼 */}
      <Link 
        href="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-8 transition-colors"
      >
        ← 다른 모델 비교하기
      </Link>

      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        {dataA.name} <span className="text-gray-400 font-normal">vs</span> {dataB.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 모델 A 카드 */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="uppercase text-sm font-bold text-blue-500 mb-1">{dataA.provider}</div>
          <h2 className="text-2xl font-bold mb-6">{dataA.name}</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">입력 단가 (1M)</span><span className="font-semibold text-blue-600">${dataA.input_price_per_1m}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">출력 단가 (1M)</span><span className="font-semibold text-red-600">${dataA.output_price_per_1m}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">최대 컨텍스트</span><span className="font-semibold">{dataA.context_length?.toLocaleString()}</span></div>
          </div>
        </div>

        {/* 모델 B 카드 */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="uppercase text-sm font-bold text-purple-500 mb-1">{dataB.provider}</div>
          <h2 className="text-2xl font-bold mb-6">{dataB.name}</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">입력 단가 (1M)</span><span className="font-semibold text-blue-600">${dataB.input_price_per_1m}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">출력 단가 (1M)</span><span className="font-semibold text-red-600">${dataB.output_price_per_1m}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">최대 컨텍스트</span><span className="font-semibold">{dataB.context_length?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </main>
  )
}