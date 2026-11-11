import { createClient } from "@supabase/supabase-js";
import ClientTable from "@/components/ClientTable";

export const revalidate = 3600; // 1시간마다 캐시 갱신 (SEO 최적화)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  // 서버에서 단가 데이터를 한 번만 긁어옵니다.
  const { data: models } = await supabase
    .from("ai_models")
    .select("*")
    .order("provider", { ascending: true });

  return (
    <main className="max-w-6xl mx-auto p-8 relative">
      <h1 className="text-3xl font-bold mb-8">글로벌 AI 모델 실시간 단가 비교표</h1>
      
      {/* 가져온 데이터를 클라이언트 컴포넌트에 넘깁니다 */}
      <ClientTable models={models || []} />
    </main>
  );
}