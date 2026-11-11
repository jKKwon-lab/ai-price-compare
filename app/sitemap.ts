import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Vercel 환경에 세팅된 키를 가져옵니다.
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //실제 Vercel 주소
  const baseUrl = 'https://ai-price-compare-if3h.vercel.app'

  // 1. 메인 화면(홈) 주소 기본 추가
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, 
    },
  ]

  // 2. Supabase DB에서 모든 AI 모델의 ID(이름) 불러오기
  const { data: models } = await supabase.from('ai_models').select('id').order('id')

  if (!models) return routes

  // 3. A vs B 조합을 수학적으로 모두 계산하여 수백 개의 주소 자동 생성
  for (let i = 0; i < models.length; i++) {
    for (let j = i + 1; j < models.length; j++) {
      const modelA = models[i].id
      const modelB = models[j].id

      routes.push({
        url: `${baseUrl}/compare/${encodeURIComponent(modelA)}/vs/${encodeURIComponent(modelB)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  return routes
}