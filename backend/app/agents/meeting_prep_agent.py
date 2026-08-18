import logging
from typing import Dict, Any, Optional, Callable
from app.models.schemas import PreMeetingDossier
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

MEETING_PREP_SYSTEM_PROMPT = """You are the Elite Pre-Meeting Intelligence & Executive Strategy Agent.
Your objective is to craft an unfair competitive advantage for the user walking into a high-stakes meeting with this company.

CRITICAL INSTRUCTIONS:
1. Synthesize all forensic findings strictly for the target company and meeting counterpart to generate:
   - High-impact Executive Icebreakers (Subtle, authentic connection starters referencing actual founder interviews, podcast quotes, or recent milestones)
   - Executive Talking Points (Crisp, strategic value alignment points)
   - Red Flags & Landmines (Critical topics, controversies, or sensitive topics to tread lightly on)
   - Value Proposition Angles (Direct positioning angles solving their known architectural bottlenecks, complaint triggers, or scale challenges)
   - 10x Deep Questions (5-7 thought-provoking, high-IQ questions that prove the user has done deeper research than 99% of people in the room)
   - Executive Meeting Gameplan Summary

2. Output ONLY a valid JSON object matching this schema:
{
  "executive_icebreakers": [
    "Congratulate on the recent Series C milestone or new AI agent release.",
    "Mention their CEO's recent podcast commentary regarding developer ergonomics.",
    "Reference their shift towards real-time multi-tenant architectures."
  ],
  "executive_talking_points": [
    "Aligning with their current Q3 roadmap focus on enterprise compliance.",
    "Demonstrating how integrating high-throughput data streams reduces their operational overhead.",
    "Addressing enterprise procurement cycle compression."
  ],
  "red_flags_and_landmines": [
    "Avoid highlighting their recent pricing backlash on Reddit without offering an immediate solution.",
    "Do not compare them directly to legacy incumbents in a dismissive way; they take pride in modern design.",
    "Be cautious when discussing their self-hosted vs cloud roadmap as it is currently undergoing strategic review."
  ],
  "value_proposition_angles": [
    "Positioning our solution as the missing bridge for their enterprise RBAC & audit logging bottleneck.",
    "Offering a seamless zero-friction API integration that protects their ultra-fast latency SLA."
  ],
  "smart_deep_questions": [
    "How are you currently managing data gravity as your enterprise customers demand localized sovereign cloud deployments?",
    "Given your recent push into AI agents, what has been the biggest hurdle in maintaining sub-100ms response times for complex multi-step reasoning?",
    "With competitors moving toward aggressive open-source models, what is your primary defensive moat to protect pricing power over the next 18 months?"
  ],
  "meeting_gameplan_summary": "Lead with shared alignment on developer-first experiences, validate their recent roadmap wins, subtly bridge into their enterprise compliance bottlenecks, and anchor the conversation around scalability."
}
"""

class MeetingPrepAgent:
    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name

    async def investigate(
        self,
        company_name: str,
        meeting_person: Optional[str],
        meeting_role: Optional[str],
        meeting_topic: Optional[str],
        forensic_context: str,
        log_callback: Optional[Callable[[str], Any]] = None
    ) -> PreMeetingDossier:
        if log_callback:
            await log_callback(f"[Meeting Prep Agent] Synthesizing executive icebreakers, landmines, and 10x deep questions for {company_name}...")

        meeting_info = f"Meeting Counterpart: {meeting_person or 'Executive Leadership'} ({meeting_role or 'Decision Maker'})\nMeeting Objective/Topic: {meeting_topic or 'Strategic Partnership / Sales / Investment'}"

        user_prompt = f"""Target Company: {company_name}
MEETING CONTEXT:
{meeting_info}

SYNTHESIZED FORENSIC DATA:
{forensic_context}

Generate the ultimate Pre-Meeting Intelligence Dossier now. Return JSON only."""

        try:
            raw_data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=MEETING_PREP_SYSTEM_PROMPT,
                model=self.model_name
            )

            return PreMeetingDossier(
                executive_icebreakers=raw_data.get("executive_icebreakers", []),
                executive_talking_points=raw_data.get("executive_talking_points", []),
                red_flags_and_landmines=raw_data.get("red_flags_and_landmines", []),
                value_proposition_angles=raw_data.get("value_proposition_angles", []),
                smart_deep_questions=raw_data.get("smart_deep_questions", []),
                meeting_gameplan_summary=raw_data.get("meeting_gameplan_summary")
            )
        except Exception as e:
            logger.error(f"Error in MeetingPrepAgent: {e}")
            if log_callback:
                await log_callback(f"[Meeting Prep Warning] Fallback applied: {e}")
            return PreMeetingDossier(
                executive_icebreakers=[f"Discuss recent milestones of {company_name}"],
                smart_deep_questions=[f"What are the top strategic priorities for {company_name} this fiscal year?"]
            )

meeting_prep_agent = MeetingPrepAgent()
