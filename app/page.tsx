import { createClient } from "@supabase/supabase-js";
import ClientTable from "../components/ClientTable";

// ⚡ Next.js 16 빌드 에러 해결을 위한 설정 추가
export const instant = false;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  const { data: models } = await supabase
    .from("ai_models")
    .select("*")
    .order("provider", { ascending: true });

  return (
    <main className="max-w-6xl mx-auto p-8 relative">
      <h1 className="text-3xl font-bold mb-8">글로벌 AI 모델 실시간 단가 비교표</h1>
      <ClientTable models={models || []} />
    </main>
  );
}