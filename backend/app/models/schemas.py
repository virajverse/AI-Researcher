from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any

# ==================== Basic Pillar Schemas ====================
class FounderInfo(BaseModel):
    name: str
    role: Optional[str] = "Co-Founder"
    background: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None

class LeaderInfo(BaseModel):
    name: str
    role: Optional[str] = "Executive / Leadership"
    background: Optional[str] = None

class LocationInfo(BaseModel):
    headquarters: str = "Unknown"
    global_offices: List[str] = Field(default_factory=list)
    work_policy: Optional[str] = "Hybrid / Remote / In-office"

class CompanySizeInfo(BaseModel):
    headcount: str = "Unknown"
    estimated_employees: Optional[int] = None
    department_breakdown: Optional[Dict[str, str]] = None
    growth_trend: Optional[str] = None

class IndustryInfo(BaseModel):
    primary: str = "Technology"
    sub_sectors: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)

class CorporateRegistryDNA(BaseModel):
    cin_or_reg_number: Optional[str] = None
    roc_or_state_jurisdiction: Optional[str] = None
    company_category: Optional[str] = "Private Limited / Commercial Entity"
    authorized_capital: Optional[str] = None
    paid_up_capital: Optional[str] = None
    incorporation_date: Optional[str] = None
    legal_status: Optional[str] = "Active / In Good Standing"

class CultureAndSentiment(BaseModel):
    glassdoor_ambitionbox_rating: Optional[str] = "4.2 / 5.0"
    ceo_approval_percent: Optional[str] = "90%+"
    work_culture_notes: Optional[str] = "High-velocity execution and builder-centric culture."
    attrition_risk_level: Optional[str] = "Low Risk"
    employee_pros: List[str] = Field(default_factory=list)
    employee_cons: List[str] = Field(default_factory=list)

class SecurityAndInfraRadar(BaseModel):
    email_service: Optional[str] = "Google Workspace / Enterprise Cloud"
    cdn_and_waf: Optional[str] = "Cloudflare Enterprise / Edge"
    analytics_and_trackers: List[str] = Field(default_factory=list)
    payment_processors: List[str] = Field(default_factory=list)
    compliance_signals: List[str] = Field(default_factory=list)

class AgeInfo(BaseModel):
    founded_year: Optional[int] = None
    age_years: Optional[int] = None
    historical_summary: Optional[str] = None
    corporate_registry: Optional[CorporateRegistryDNA] = Field(default_factory=CorporateRegistryDNA)

class BasicCompanyDNA(BaseModel):
    company_name: str
    legal_name: Optional[str] = None
    tagline: Optional[str] = None
    website: Optional[str] = None
    founders: List[FounderInfo] = Field(default_factory=list)
    leadership: List[LeaderInfo] = Field(default_factory=list)
    location: LocationInfo = Field(default_factory=LocationInfo)
    size: CompanySizeInfo = Field(default_factory=CompanySizeInfo)
    industry: IndustryInfo = Field(default_factory=IndustryInfo)
    age: AgeInfo = Field(default_factory=AgeInfo)
    corporate_registry: CorporateRegistryDNA = Field(default_factory=CorporateRegistryDNA)
    culture_and_sentiment: CultureAndSentiment = Field(default_factory=CultureAndSentiment)

# ==================== Business & Monetization Schemas ====================
class CustomerPersona(BaseModel):
    target_persona: str
    buyer_vs_user: str
    target_segment: str # Enterprise, Mid-market, SMB, Developers, Consumers

class RevenueModelInfo(BaseModel):
    model_type: str # SaaS, Usage-based, Enterprise License, Marketplace, etc.
    pricing_structure: List[str] = Field(default_factory=list)
    estimated_arr_or_revenue: Optional[str] = None
    monetization_notes: Optional[str] = None

class CustomerLogoInfo(BaseModel):
    name: str
    industry: Optional[str] = None
    use_case: Optional[str] = None

class BusinessIntelligence(BaseModel):
    what_they_sell: List[str] = Field(default_factory=list)
    who_buys: List[CustomerPersona] = Field(default_factory=list)
    revenue_model: RevenueModelInfo = Field(default_factory=lambda: RevenueModelInfo(model_type="SaaS Subscription"))
    main_customers: List[CustomerLogoInfo] = Field(default_factory=list)
    main_markets: List[str] = Field(default_factory=list)

# ==================== Product & Sentiment Schemas ====================
class ProductItem(BaseModel):
    name: str
    description: str
    target_audience: Optional[str] = None
    key_capabilities: List[str] = Field(default_factory=list)

class RoadmapItem(BaseModel):
    feature_or_milestone: str
    status: str # In Beta, Announced, Rumored, Q3/Q4 Target
    impact: Optional[str] = None

class UserComplaint(BaseModel):
    category: str # Pricing, Customer Support, UI/UX, Performance, Missing Features, Integrations
    description: str
    source_platform: Optional[str] = "G2 / Reddit / Reviews"
    severity: str = "Medium" # Critical, High, Medium, Low

class ReviewSentiment(BaseModel):
    average_rating: Optional[str] = "4.5 / 5.0"
    sentiment_score: int = 85 # 0-100
    positive_highlights: List[str] = Field(default_factory=list)
    negative_highlights: List[str] = Field(default_factory=list)
    nps_indicator: Optional[str] = "Positive"

class ProductForensics(BaseModel):
    current_products: List[ProductItem] = Field(default_factory=list)
    product_roadmap: List[RoadmapItem] = Field(default_factory=list)
    core_features: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    user_complaints: List[UserComplaint] = Field(default_factory=list)
    reviews_summary: ReviewSentiment = Field(default_factory=ReviewSentiment)

# ==================== Technology Schemas ====================
class TechStackInfo(BaseModel):
    frontend: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud_and_infra: List[str] = Field(default_factory=list)
    devops_and_tools: List[str] = Field(default_factory=list)

class AIUsageInfo(BaseModel):
    ai_features: List[str] = Field(default_factory=list)
    models_or_providers: List[str] = Field(default_factory=list)
    proprietary_ai: bool = False
    ai_maturity_rating: str = "Advanced" # Pioneer, Advanced, Emerging, None
    technical_details: Optional[str] = None

class APIInfo(BaseModel):
    api_types: List[str] = Field(default_factory=lambda: ["REST", "Webhooks"])
    developer_portal_url: Optional[str] = None
    sdks_supported: List[str] = Field(default_factory=list)
    major_integrations: List[str] = Field(default_factory=list)

class TechnologyForensics(BaseModel):
    tech_stack: TechStackInfo = Field(default_factory=TechStackInfo)
    ai_usage: AIUsageInfo = Field(default_factory=AIUsageInfo)
    apis_and_ecosystem: APIInfo = Field(default_factory=APIInfo)
    infrastructure_notes: List[str] = Field(default_factory=list)
    automation_and_workflows: List[str] = Field(default_factory=list)
    security_and_infra_radar: SecurityAndInfraRadar = Field(default_factory=SecurityAndInfraRadar)

# ==================== Strategy Schemas ====================
class LaunchEvent(BaseModel):
    headline: str
    date_or_timeframe: Optional[str] = None
    details: Optional[str] = None

class PartnershipEvent(BaseModel):
    partner: str
    collaboration_scope: str

class HiringSignal(BaseModel):
    open_role_categories: List[str] = Field(default_factory=list)
    strategic_focus_areas: List[str] = Field(default_factory=list)
    hiring_intensity: str = "Moderate" # Aggressive, Moderate, Selective, Freeze

class FundingRound(BaseModel):
    round_name: str # Seed, Series A, Series B, IPO, Private Equity
    amount_raised: Optional[str] = None
    lead_investors: List[str] = Field(default_factory=list)
    valuation: Optional[str] = None
    date: Optional[str] = None

    @field_validator("lead_investors", mode="before")
    @classmethod
    def coerce_lead_investors(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [v] if v.strip() else []
        if isinstance(v, list):
            return [str(item) for item in v]
        return []

class FundingIntelligence(BaseModel):
    total_raised: Optional[str] = None
    current_valuation: Optional[str] = None
    rounds: List[FundingRound] = Field(default_factory=list)
    top_investors: List[str] = Field(default_factory=list)

class AcquisitionEvent(BaseModel):
    target_company: str
    date: Optional[str] = None
    strategic_reason: Optional[str] = None

class StrategyIntelligence(BaseModel):
    recent_launches: List[LaunchEvent] = Field(default_factory=list)
    partnerships: List[PartnershipEvent] = Field(default_factory=list)
    hiring_trends: HiringSignal = Field(default_factory=HiringSignal)
    expansion_moves: List[str] = Field(default_factory=list)
    funding: FundingIntelligence = Field(default_factory=FundingIntelligence)
    acquisitions: List[AcquisitionEvent] = Field(default_factory=list)
    new_markets_targeted: List[str] = Field(default_factory=list)

# ==================== Competitive Landscape Schemas ====================
class CompetitorProfile(BaseModel):
    name: str
    category: str # Direct, Indirect, Emerging Disruptor
    key_differences: str
    pricing_comparison: Optional[str] = None
    market_position: Optional[str] = None

class LagBehindArea(BaseModel):
    area: str
    better_competitors: List[str] = Field(default_factory=list)
    deal_impact: Optional[str] = "Competitive gap requiring differentiation."

    @field_validator("better_competitors", mode="before")
    @classmethod
    def coerce_better_competitors(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [v] if v.strip() else []
        if isinstance(v, list):
            return [str(item) for item in v]
        return []

class CompetitiveLandscape(BaseModel):
    competitors: List[CompetitorProfile] = Field(default_factory=list)
    differentiators_and_moat: List[str] = Field(default_factory=list)
    where_they_lag: List[LagBehindArea] = Field(default_factory=list)
    competitive_summary: Optional[str] = None

# ==================== Pre-Meeting Intelligence Dossier ====================
class PreMeetingDossier(BaseModel):
    executive_icebreakers: List[str] = Field(default_factory=list)
    executive_talking_points: List[str] = Field(default_factory=list)
    red_flags_and_landmines: List[str] = Field(default_factory=list)
    value_proposition_angles: List[str] = Field(default_factory=list)
    smart_deep_questions: List[str] = Field(default_factory=list)
    meeting_gameplan_summary: Optional[str] = None

# ==================== Master Forensic Report Schema ====================
class ForensicCompanyReport(BaseModel):
    id: Optional[str] = None
    company_name: str
    target_url: Optional[str] = None
    created_at: Optional[str] = None
    llm_model_used: Optional[str] = None
    research_duration_seconds: Optional[float] = None
    confidence_score: int = 95
    sources_inspected: List[str] = Field(default_factory=list)

    basic: BasicCompanyDNA
    business: BusinessIntelligence
    product: ProductForensics
    technology: TechnologyForensics
    strategy: StrategyIntelligence
    competitive_landscape: CompetitiveLandscape
    pre_meeting_dossier: PreMeetingDossier

# ==================== Request / Response Schemas ====================
# ==================== Pitch Simulator Schemas ====================
class PitchSimulationRequest(BaseModel):
    company_name: str
    target_role: str = "CEO / Founder" # CEO, CTO, VP Engineering, Head of Product
    user_pitch_message: str
    dossier_id: Optional[str] = None
    context_summary: Optional[str] = None

class PitchSimulationResponse(BaseModel):
    counterpart_role: str
    counterpart_name: str
    counterpart_reaction: str # Enthusiastic, Skeptical, Analytical, Defensive, Impressed
    reply_message: str
    internal_thought_monologue: str
    score_out_of_10: int
    strengths_of_pitch: List[str]
    critical_objections_raised: List[str]
    coaching_tip_for_next_round: str

class ComparisonRequest(BaseModel):
    dossier_ids: List[str]
    metrics: Optional[List[str]] = None

class ResearchRequest(BaseModel):
    company_name: str
    website_url: Optional[str] = None
    meeting_person: Optional[str] = None
    meeting_role: Optional[str] = None
    meeting_topic: Optional[str] = None
    model_name: Optional[str] = None
    depth: Optional[str] = "forensic" # forensic, lightning

class StreamMessage(BaseModel):
    type: str # status, agent_start, agent_log, agent_complete, final_report, error
    agent: Optional[str] = None
    message: str
    data: Optional[Any] = None
