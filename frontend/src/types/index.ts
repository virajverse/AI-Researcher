export interface FounderInfo {
  name: string;
  role?: string;
  background?: string;
  social_links?: Record<string, string>;
}

export interface LeaderInfo {
  name: string;
  role?: string;
  background?: string;
}

export interface LocationInfo {
  headquarters: string;
  global_offices: string[];
  work_policy?: string;
}

export interface CompanySizeInfo {
  headcount: string;
  estimated_employees?: number;
  department_breakdown?: Record<string, string>;
  growth_trend?: string;
}

export interface IndustryInfo {
  primary: string;
  sub_sectors: string[];
  tags: string[];
}

export interface CorporateRegistryDNA {
  cin_or_reg_number?: string;
  roc_or_state_jurisdiction?: string;
  company_category?: string;
  authorized_capital?: string;
  paid_up_capital?: string;
  incorporation_date?: string;
  legal_status?: string;
}

export interface CultureAndSentiment {
  glassdoor_ambitionbox_rating?: string;
  ceo_approval_percent?: string;
  work_culture_notes?: string;
  attrition_risk_level?: string;
  employee_pros: string[];
  employee_cons: string[];
}

export interface SecurityAndInfraRadar {
  email_service?: string;
  cdn_and_waf?: string;
  analytics_and_trackers: string[];
  payment_processors: string[];
  compliance_signals: string[];
}

export interface AgeInfo {
  founded_year?: number;
  age_years?: number;
  historical_summary?: string;
  corporate_registry?: CorporateRegistryDNA;
}

export interface BasicCompanyDNA {
  company_name: string;
  legal_name?: string;
  tagline?: string;
  website?: string;
  founders: FounderInfo[];
  leadership: LeaderInfo[];
  location: LocationInfo;
  size: CompanySizeInfo;
  industry: IndustryInfo;
  age: AgeInfo;
  corporate_registry?: CorporateRegistryDNA;
  culture_and_sentiment?: CultureAndSentiment;
}

export interface CustomerPersona {
  target_persona: string;
  buyer_vs_user: string;
  target_segment: string;
}

export interface RevenueModelInfo {
  model_type: string;
  pricing_structure: string[];
  estimated_arr_or_revenue?: string;
  monetization_notes?: string;
}

export interface CustomerLogoInfo {
  name: string;
  industry?: string;
  use_case?: string;
}

export interface BusinessIntelligence {
  what_they_sell: string[];
  who_buys: CustomerPersona[];
  revenue_model: RevenueModelInfo;
  main_customers: CustomerLogoInfo[];
  main_markets: string[];
}

export interface ProductItem {
  name: string;
  description: string;
  target_audience?: string;
  key_capabilities?: string[];
  key_features?: string[];
  maturity_stage?: string;
}

export interface RoadmapItem {
  feature_or_version?: string;
  feature_or_milestone?: string;
  status: string;
  impact?: string;
  expected_impact?: string;
}

export interface UserComplaint {
  category: string;
  description?: string;
  complaint?: string;
  source_platform?: string;
  source?: string;
  severity?: string;
}

export interface ReviewSentiment {
  rating_estimate?: string;
  average_rating?: string;
  sentiment_score: number;
  positive_highlights?: string[];
  negative_highlights?: string[];
  nps_indicator?: string;
}

export interface ProductForensics {
  current_products: ProductItem[];
  product_roadmap: RoadmapItem[];
  core_features: string[];
  weaknesses: string[];
  user_complaints: UserComplaint[];
  reviews_summary?: ReviewSentiment;
  reviews_sentiment?: ReviewSentiment;
}

export interface TechStackInfo {
  frontend: string[];
  backend: string[];
  databases: string[];
  cloud_and_infra: string[];
  devops_and_tools: string[];
}

export interface AIUsageInfo {
  ai_features: string[];
  models_or_providers: string[];
  proprietary_ai: boolean;
  ai_maturity_rating: string;
  technical_details?: string;
}

export interface APIInfo {
  api_types: string[];
  developer_portal_url?: string;
  sdks_supported: string[];
  major_integrations: string[];
}

export interface TechnologyForensics {
  tech_stack: TechStackInfo;
  ai_usage: AIUsageInfo;
  apis_and_ecosystem: APIInfo;
  infrastructure_notes: string[];
  automation_and_workflows: string[];
  security_and_infra_radar?: SecurityAndInfraRadar;
}

export interface PitchSimulationRequest {
  company_name: string;
  target_role: string;
  user_pitch_message: string;
  dossier_id?: string;
  context_summary?: string;
}

export interface PitchSimulationResponse {
  counterpart_role: string;
  counterpart_name: string;
  counterpart_reaction: string;
  reply_message: string;
  internal_thought_monologue: string;
  score_out_of_10: number;
  strengths_of_pitch: string[];
  critical_objections_raised: string[];
  coaching_tip_for_next_round: string;
}

export interface LaunchEvent {
  title?: string;
  headline?: string;
  date?: string;
  date_or_timeframe?: string;
  description?: string;
  details?: string;
}

export interface PartnershipEvent {
  partner?: string;
  partner_name?: string;
  collaboration_scope?: string;
  scope_or_announcement?: string;
}

export interface HiringSignal {
  open_role_categories?: string[];
  open_roles_focus?: string[];
  strategic_focus_areas?: string[];
  hiring_intensity?: string;
  signal_strength?: string;
  notes?: string;
}

export interface FundingRound {
  round_name: string;
  amount_raised?: string;
  lead_investors: string[];
  valuation?: string;
  date?: string;
}

export interface FundingIntelligence {
  total_raised?: string;
  current_valuation?: string;
  rounds: FundingRound[];
  top_investors: string[];
}

export interface AcquisitionEvent {
  target_company: string;
  date?: string;
  strategic_reason?: string;
}

export interface StrategyIntelligence {
  recent_launches: LaunchEvent[];
  partnerships: PartnershipEvent[];
  hiring_trends: HiringSignal;
  expansion_moves: string[];
  funding: FundingIntelligence;
  acquisitions: AcquisitionEvent[];
  new_markets_targeted: string[];
}

export interface CompetitorProfile {
  name: string;
  category: string;
  key_differences: string;
  pricing_comparison?: string;
  market_position?: string;
}

export interface LagBehindArea {
  area: string;
  better_competitors: string[];
  deal_impact: string;
}

export interface CompetitiveLandscape {
  competitors: CompetitorProfile[];
  differentiators_and_moat: string[];
  where_they_lag: LagBehindArea[];
  competitive_summary?: string;
}

export interface PreMeetingDossier {
  executive_icebreakers: string[];
  executive_talking_points: string[];
  red_flags_and_landmines: string[];
  value_proposition_angles: string[];
  smart_deep_questions: string[];
  meeting_gameplan_summary?: string;
}

export interface ForensicCompanyReport {
  id: string;
  company_name: string;
  target_url?: string;
  created_at: string;
  llm_model_used: string;
  research_duration_seconds: number;
  confidence_score: number;
  sources_inspected: string[];
  basic: BasicCompanyDNA;
  business: BusinessIntelligence;
  product: ProductForensics;
  technology: TechnologyForensics;
  strategy: StrategyIntelligence;
  competitive_landscape: CompetitiveLandscape;
  pre_meeting_dossier: PreMeetingDossier;
}

export interface StreamEvent {
  type: string;
  agent?: string;
  message: string;
  data?: any;
  timestamp?: string;
}

export interface DossierSummary {
  id: string;
  company_name: string;
  target_url?: string;
  created_at: string;
  llm_model: string;
  confidence_score: number;
  duration_seconds: number;
  industry?: string;
  tagline?: string;
}

export interface ResearchRequest {
  company_name: string;
  website_url?: string;
  meeting_person?: string;
  meeting_role?: string;
  meeting_topic?: string;
  model_name?: string;
  depth?: string;
}
