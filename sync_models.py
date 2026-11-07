import os
import json
import urllib.request

# 1. .env.local 파일 읽기
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                key, val = line.strip().split('=', 1)
                os.environ[key.strip()] = val.strip()

# URL 끝에 슬래시(/)가 있다면 제거
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip('/')
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

TARGET_PROVIDERS = {"anthropic", "openai", "google", "meta-llama", "deepseek", "mistralai", "qwen"}

def fetch_and_sync():
    print("데이터를 가져오는 중입니다...")
    url = "https://openrouter.ai/api/v1/models"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode("utf-8")).get("data", [])

    records = []
    for item in data:
        model_id = item.get("id", "")
        provider = model_id.split("/")[0] if "/" in model_id else "other"
        if provider not in TARGET_PROVIDERS: continue

        pricing = item.get("pricing", {})
        try:
            input_1m = round(float(pricing.get("prompt", 0)) * 1_000_000, 4)
            output_1m = round(float(pricing.get("completion", 0)) * 1_000_000, 4)
        except ValueError: continue

        if input_1m < 0 or output_1m < 0: continue

        top_prov = item.get("top_provider") or {}
        records.append({
            "id": model_id.replace("/", "-"),
            "name": item.get("name", model_id),
            "provider": provider,
            "context_length": item.get("context_length", 0),
            "max_output_tokens": top_prov.get("max_completion_tokens") or 4096,
            "input_price_per_1m": input_1m,
            "output_price_per_1m": output_1m
        })

    if records:
        # 2. 패키지를 쓰지 않고 Supabase REST API로 직접 데이터 삽입 (우회)
        api_url = f"{SUPABASE_URL}/rest/v1/ai_models"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        }
        
        req_post = urllib.request.Request(
            api_url, 
            data=json.dumps(records).encode("utf-8"), 
            headers=headers, 
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req_post) as res:
                print(f"🎉 성공: {len(records)}개 AI 모델 가격 업데이트 완료! (패키지 우회 성공)")
        except Exception as e:
            print(f"업데이트 실패: {e}")

if __name__ == "__main__":
    fetch_and_sync()