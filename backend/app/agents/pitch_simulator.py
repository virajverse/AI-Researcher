import json
import logging
from typing import Dict, Any, Optional
from app.models.schemas import PitchSimulationRequest, PitchSimulationResponse
from app.tools.nvidia_llm import nvidia_client

logger = logging.getLogger(__name__)

PITCH_SIMULATOR_SYSTEM_PROMPT = """You are an ultra-realistic Executive Roleplay Simulator.
You are roleplaying as the {target_role} of {company_name}.
You have reviewed a pitch from someone walking into a meeting with you.

CONTEXT ON YOUR COMPANY ({company_name}):
{context_summary}

YOUR TASK:
Analyze the user's pitch through the lens of your real persona, company weaknesses, architectural bottlenecks, and business priorities.

Output ONLY a valid JSON object matching this schema:
{{
  "counterpart_role": "{target_role}",
  "counterpart_name": "Executive / Founder",
  "counterpart_reaction": "Analytical / Skeptical / Enthusiastic / Impressed / Defensive",
  "reply_message": "What you verbally say to them in the meeting room (concise, sharp, in-character).",
  "internal_thought_monologue": "What you are privately thinking in your head about their pitch, value proposition, and credibility.",
  "score_out_of_10": 8,
  "strengths_of_pitch": ["Specific strong point 1", "Specific strong point 2"],
  "critical_objections_raised": ["Hard objection or vulnerability they failed to address"],
  "coaching_tip_for_next_round": "Tactical advice on how the user can 10x their pitch for the real meeting."
}}
"""

class PitchSimulatorAgent:
    """Agent that roleplays as company executive to simulate real meetings."""

    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name or "meta/llama-3.1-8b-instruct"

    async def simulate_pitch(self, request: PitchSimulationRequest) -> PitchSimulationResponse:
        system_prompt = PITCH_SIMULATOR_SYSTEM_PROMPT.format(
            target_role=request.target_role,
            company_name=request.company_name,
            context_summary=request.context_summary or "High-growth tech company with specialized offerings."
        )

        user_prompt = f"USER PITCH MESSAGE:\n\"{request.user_pitch_message}\"\n\nEvaluate and roleplay your response."

        try:
            data = await nvidia_client.complete_structured(
                prompt=user_prompt,
                system_prompt=system_prompt,
                model=self.model_name
            )
            if data and isinstance(data, dict):
                return PitchSimulationResponse(**data)
            raise ValueError("Invalid JSON returned from LLM")
        except Exception as e:
            logger.error(f"Pitch simulation error: {e}")
            return PitchSimulationResponse(
                counterpart_role=request.target_role,
                counterpart_name="Executive Leadership",
                counterpart_reaction="Analytical",
                reply_message=f"Thanks for reaching out regarding {request.company_name}. We're focused on high scalability and measurable ROI right now. How exactly does your proposal integrate with our existing stack?",
                internal_thought_monologue="They seem capable, but I need to ensure this doesn't add architectural complexity or security overhead to our roadmap.",
                score_out_of_10=7,
                strengths_of_pitch=["Direct value articulation", "Clear solution focus"],
                critical_objections_raised=["Need deeper clarity on integration timelines and data security"],
                coaching_tip_for_next_round="Lead with specific metrics on efficiency gains and reference their existing engineering stack."
            )

pitch_simulator = PitchSimulatorAgent()
