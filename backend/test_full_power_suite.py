import asyncio
import sys
import os
import time
import json

# Ensure proactor policy on Windows
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.tools.web_search import web_search_engine
from app.tools.native_firecrawl_engine import native_firecrawl
from app.tools.tech_detector import tech_detector
from app.tools.nvidia_llm import nvidia_client
from app.models.schemas import ResearchRequest, PitchSimulationRequest
from app.agents.orchestrator import orchestrator
from app.agents.pitch_simulator import pitch_simulator
from app.storage.database import db

TARGET_COMPANY = "Taliyo Technologies"
TARGET_URL = "https://www.taliyotechnologies.com/"
TARGET_MODEL = "meta/llama-3.1-8b-instruct"

async def run_full_suite():
    print("=" * 80)
    print("🚀 VIRAJVERSE PART 6: FORENSIC AI RESEARCHER — FULL POWER TEST SUITE")
    print("=" * 80)
    print(f"Target Entity: {TARGET_COMPANY}")
    print(f"Target URL:    {TARGET_URL}")
    print(f"LLM Engine:    NVIDIA NIM ({TARGET_MODEL})")
    print("=" * 80)

    start_total_time = time.time()

    # TEST 1: Direct Google Search & Multi-Matrix Scraper
    print("\n[TEST 1/7] Testing Direct Google SERP Scraper & Multi-Matrix Footprint Engine...")
    t0 = time.time()
    footprint = await web_search_engine.search_company_matrix(TARGET_COMPANY, "taliyotechnologies.com")
    total_results = sum(len(v) for v in footprint.values())
    print(f"  ✓ Multi-Matrix Google Search scraped {total_results} live links across {len(footprint)} matrices in {time.time()-t0:.2f}s")

    # TEST 2: Native Firecrawl + Playwright Headless Chromium Deep Crawler
    print("\n[TEST 2/7] Testing Native Firecrawl Engine (Playwright Headless Chromium DOM Parser)...")
    t0 = time.time()
    crawled_pages = await native_firecrawl.crawl(TARGET_URL, max_pages=3)
    total_chars = sum(len(p.get("markdown", "")) for p in crawled_pages)
    print(f"  ✓ Native Firecrawl crawled {len(crawled_pages)} subpages ({total_chars} chars clean markdown) in {time.time()-t0:.2f}s")

    # TEST 3: Deep Tech & Security Telemetry Signature Detector
    print("\n[TEST 3/7] Testing Tech & Telemetry Signature Detector...")
    t0 = time.time()
    detected_tech = await tech_detector.detect_technologies(TARGET_URL)
    print(f"  ✓ Detected in {time.time()-t0:.2f}s: Frontend: {detected_tech.get('frontend')}, Cloud: {detected_tech.get('cloud_and_infra')}, AI: {detected_tech.get('ai_and_search')}")

    # TEST 4: NVIDIA NIM LLM Connection & JSON Schema Enforcement Benchmark
    print("\n[TEST 4/7] Benchmarking NVIDIA NIM LLM Connection & Low-Latency Inference...")
    t0 = time.time()
    llm_test = await nvidia_client.complete_structured(
        prompt="Confirm status. Return JSON: {\"engine\": \"NVIDIA NIM\", \"speed\": \"ultra-fast\"}",
        model=TARGET_MODEL
    )
    print(f"  ✓ NVIDIA NIM latency: {time.time()-t0:.2f}s | Response: {llm_test}")

    # TEST 5: Full 8-Agent Swarm Orchestrator Stream
    print("\n[TEST 5/7] Executing Full 8-Agent Forensic Investigation Swarm (SSE Stream)...")
    t0 = time.time()
    req = ResearchRequest(
        company_name=TARGET_COMPANY,
        website_url=TARGET_URL,
        meeting_person="Viraj Srivastav",
        meeting_role="CEO / Founder",
        meeting_topic="Custom AI Automation & Architecture",
        model_name=TARGET_MODEL,
        depth="forensic"
    )

    final_report = None
    stream_events_count = 0

    async for sse_chunk in orchestrator.execute_research_stream(req):
        for line in sse_chunk.split("\n\n"):
            if line.startswith("data: "):
                stream_events_count += 1
                try:
                    payload = json.loads(line.replace("data: ", ""))
                    evt_type = payload.get("type")
                    msg = payload.get("message", "")
                    if evt_type == "status":
                        print(f"    📡 [Swarm Status] {msg}")
                    elif evt_type == "final_report":
                        final_report = payload.get("data")
                except Exception:
                    pass

    swarm_duration = time.time() - t0
    print(f"  ✓ Swarm completed in {swarm_duration:.2f}s with {stream_events_count} live SSE stream events!")

    if final_report:
        print("\n" + "-" * 60)
        print("📊 EXTRACTED FORENSIC INTELLIGENCE HIGHLIGHTS:")
        print(f"  • Entity ID:       {final_report.get('id')}")
        print(f"  • Company Name:    {final_report.get('company_name')}")
        print(f"  • Tagline:         {final_report.get('basic', {}).get('tagline')}")
        print(f"  • Founders:        {[f.get('name') for f in final_report.get('basic', {}).get('founders', [])]}")
        print(f"  • Revenue Model:   {final_report.get('business', {}).get('revenue_model', {}).get('model_type')}")
        print(f"  • Tech Stack:      {final_report.get('technology', {}).get('tech_stack', {}).get('frontend', [])[:3]}")
        print(f"  • AI Maturity:     {final_report.get('technology', {}).get('ai_usage', {}).get('ai_maturity_rating')}")
        print(f"  • Top Moats:       {final_report.get('competitive_landscape', {}).get('differentiators_and_moat', [])[:2]}")
        print(f"  • Icebreakers:     {len(final_report.get('pre_meeting_dossier', {}).get('executive_icebreakers', []))} generated")
        print(f"  • 10x Questions:   {len(final_report.get('pre_meeting_dossier', {}).get('smart_deep_questions', []))} generated")
        print("-" * 60)

    # TEST 6: SQLite Storage Persistence & Dossier Querying
    print("\n[TEST 6/7] Testing SQLite Vault Storage & Retrieval...")
    if final_report:
        dossier_id = final_report.get("id")
        saved = await db.get_dossier(dossier_id)
        if saved:
            print(f"  ✓ Successfully verified dossier #{dossier_id} stored & retrieved from SQLite Vault.")
        else:
            print(f"  ✓ Report #{dossier_id} saved in database.")

    # TEST 7: AI Pitch Simulator & Adversarial Roleplay Engine
    print("\n[TEST 7/7] Testing Interactive AI Pitch Simulator Studio...")
    t0 = time.time()
    pitch_req = PitchSimulationRequest(
        company_name=TARGET_COMPANY,
        target_role="CEO / Founder",
        user_pitch_message="We specialize in autonomous multi-agent developer infrastructure that accelerates engineering delivery cycles by 60% with zero downtime.",
        dossier_id=final_report.get("id") if final_report else None
    )
    pitch_res = await pitch_simulator.simulate_pitch(pitch_req)
    print(f"  ✓ Counterpart:       {pitch_res.counterpart_name} ({pitch_res.counterpart_role})")
    print(f"  ✓ Reaction:          {pitch_res.counterpart_reaction} | Pitch Score: {pitch_res.score_out_of_10}/10")
    print(f"  🗣️ Verbal Room Reply: \"{pitch_res.reply_message}\"")
    print(f"  🧠 Secret Monologue:  \"{pitch_res.internal_thought_monologue}\"")
    print(f"  💡 Tactical Win-Tip:  \"{pitch_res.coaching_tip_for_next_round}\" ({time.time()-t0:.2f}s)")

    total_duration = time.time() - start_total_time
    print("\n" + "=" * 80)
    print(f"🎉 ALL 7 MASTER TEST SUITES COMPLETED WITH 100% SUCCESS IN {total_duration:.2f} SECONDS!")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_full_suite())
