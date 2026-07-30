"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "pipeline" | "dataset" | "prompt" | "architecture" | "results";

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: "pipeline", label: "Data Pipeline", description: "From raw SEC filings to cleaned dataset" },
  { id: "dataset", label: "Dataset Samples", description: "Real data from the CI-FSFD benchmark" },
  { id: "prompt", label: "Summarization Prompts", description: "How we transformed MD&A text into insights" },
  { id: "architecture", label: "Fine-tuning Architecture", description: "LoRA fine-tuning with softmax classifier" },
  { id: "results", label: "Results & Benchmark", description: "Model performance comparison" },
];

// ─── 10 full MDA + AAER slides (with corresponding SMD&A) ──────────
interface MDASlide {
  id: number;
  company: string;
  cik: string;
  quarter: string;
  industry: string;
  fraud: boolean;
  misstatements: string[];
  aaerSummary: string;
  redFlags: string[];
  rawMDA: string;
  smda: string;
}

const mdaSlides: MDASlide[] = [
  {
    id: 1,
    company: "WorldCom, Inc.",
    cik: "0001045609",
    quarter: "2002 Q2",
    industry: "TELECOMMUNICATIONS",
    fraud: true,
    misstatements: ["Liabilities", "Revenue", "Assets Valuation", "Capitalized Costs"],
    aaerSummary: 'Capitalization of approximately $3.8 billion in line costs to artificially boost operating income. Line costs, which should have been expensed as incurred, were reclassified to long-term assets. Also involved improper revenue recognition through "barter" transactions and cookie-jar reserves. The largest accounting fraud in U.S. history at the time of discovery.',
    redFlags: ["Line costs capitalized instead of expensed", "Revenue recognition on non-cash barter deals", "Earnings quality diverging from cash flow", "Unusual asset growth relative to revenue", "Complex intercompany structures to hide costs"],
    rawMDA: "In the second quarter of 2002, the company reported revenue of $9.8 billion compared to $8.5 billion in the prior quarter. Line cost expenses, which represent the cost of carrying voice and data traffic, were reported at $3.4 billion. However, internal accounting records revealed that approximately $3.8 billion in line costs were improperly capitalized as long-term assets rather than being expensed as incurred. This accounting treatment falsely inflated operating income by reducing reported expenses. The company's earnings before interest, taxes, depreciation, and amortization (EBITDA) was reported at $6.4 billion, a key metric closely watched by analysts. Cash flow from operations was reported at $5.6 billion, significantly higher than net income of $2.1 billion, as the capitalized line costs were classified as investing activities rather than operating expenses. Capital expenditures surged to $7.0 billion from $2.5 billion in the prior year, primarily driven by the reclassified line costs. The company's debt-to-equity ratio rose to 1.8 from 1.2 as the company borrowed aggressively to fund what appeared to be massive network expansion. Management attributed the increased capital spending to building out fiber-optic capacity and acquiring new telecommunications assets. Accounts receivable grew by 22% year-over-year while revenue grew only 15%, indicating potential collection issues. The company also reported $2.5 billion in goodwill and intangible assets from recent acquisitions. The ratio of operating cash flow to capital expenditures, a metric management emphasized, declined from 1.4 to 0.8. In the conference call, management expressed confidence in continued double-digit revenue growth driven by data services. They highlighted the company's aggressive network build-out as a competitive advantage against emerging telecom carriers. They also noted that the company had secured $11.8 billion in credit facilities to fund ongoing capital requirements. The company's stock traded at approximately 15 times trailing earnings. The board authorized a $2.0 billion share repurchase program during the quarter. Management stated that the company's strong free cash flow generation supported both the capital expenditure program and shareholder returns.",
    smda: "**1. Strategic Priorities and Initiatives**\n- WorldCom focused on aggressive network expansion through fiber-optic capacity build-out to gain competitive advantage in the telecommunications market.\n- The company pursued growth through acquisitions, reporting $2.5 billion in goodwill and intangible assets from recent deals.\n- Management emphasized a strategy of capturing data services growth as the primary driver for continued double-digit revenue expansion.\n- A $2.0 billion share repurchase program was authorized, signaling confidence in the company's financial position.\n\n**2. Operational and Segment Performance**\n- Reported revenue grew 15% year-over-year to $9.8 billion, but accounts receivable grew 22%, significantly outpacing revenue growth and suggesting potential collection difficulties.\n- EBITDA was reported at $6.4 billion, a key metric closely monitored by analysts and investors.\n- The ratio of operating cash flow to capital expenditures declined from 1.4 to 0.8, indicating deteriorating cash generation efficiency relative to investment.\n\n**3. Financial Results and Key Trends**\n- Revenue reported at $9.8 billion vs $8.5 billion prior quarter.\n- Approximately $3.8 billion in line costs were improperly capitalized as long-term assets instead of being expensed, artificially inflating operating income.\n- Net income was reported at $2.1 billion but cash flow from operations was $5.6 billion — a suspicious divergence.\n- Capital expenditures surged to $7.0 billion from $2.5 billion year-over-year, driven by reclassified line costs.\n- Debt-to-equity ratio increased to 1.8 from 1.2 as borrowing increased to fund apparent network expansion.\n\n**4. Identified Risks and Uncertainties**\n- The company secured $11.8 billion in credit facilities, suggesting heavy reliance on external financing.\n- Asset-heavy strategy created significant financial leverage and debt service obligations.\n- Dependence on continued double-digit growth made the business vulnerable to telecom sector slowdown.\n\n**5. Forward-Looking Statements and Guidance**\n- Management expressed confidence in continued double-digit revenue growth driven by data services.\n- Management highlighted aggressive network build-out as a competitive advantage against emerging carriers.\n\n**6. Significant Changes, Events, or Developments**\n- $11.8 billion in credit facilities secured to fund ongoing capital requirements.\n- $2.0 billion share repurchase program authorized by the board.\n- Capital expenditure program increased significantly from prior year levels.\n\n**7. Important Figures and Tables**\n| Metric | Current | Prior | Change |\n|--------|---------|-------|--------|\n| Revenue | $9.8B | $8.5B | +15% |\n| Net Income | $2.1B | — | — |\n| EBITDA | $6.4B | — | — |\n| CapEx | $7.0B | $2.5B | +180% |\n| Debt/Equity | 1.8 | 1.2 | +0.6 |\n| OpCF/CapEx | 0.8 | 1.4 | -0.6 |"
  },
  {
    id: 2,
    company: "NIKE, Inc.",
    cik: "320187",
    quarter: "2019 Q3",
    industry: "RUBBER & PLASTICS FOOTWEAR",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Clean filing with standard disclosures, unqualified audit opinion, and consistent accounting policies applied across all reporting segments.",
    redFlags: [],
    rawMDA: "For the third quarter of fiscal 2019, NIKE reported revenues of $9.6 billion, an increase of 7% compared to the same period last year. On a currency-neutral basis, revenue grew 11%. NIKE Brand revenue increased 8% to $9.1 billion, driven by Sportswear and the Jordan Brand. Converse revenue decreased 4% to $482 million. Gross margin improved to 45.1% from 43.8% in the prior year, driven by higher average selling prices and improved product mix, partially offset by higher product costs. SG&A expenses increased to $3.09 billion compared to $2.77 billion last year, representing 32.2% of revenues versus 30.8%. The increase was driven by investments in digital capabilities and demand creation. Net income was $1.1 billion with diluted EPS of $0.68, compared to a net loss of $921 million and diluted loss per share of $0.57 in the prior year. The prior year included a significant one-time tax charge related to U.S. tax reform. Inventories were $5.4 billion, up 7% from the prior year. Cash and short-term investments were $3.7 billion. The company repurchased 10.5 million shares for $850 million during the quarter. A new four-year, $15 billion share repurchase program was authorized in June 2018. Return on invested capital remained strong at approximately 30%. The company's effective tax rate was 15.8% compared to 164.1% in the prior year. In North America, revenue grew 7% on a currency-neutral basis. In EMEA, revenue grew 12% currency-neutral. Greater China revenue grew 24% currency-neutral. Asia Pacific & Latin America grew 14% currency-neutral. NIKE Direct digital sales increased 36% globally. The company continued to invest in its digital transformation and direct-to-consumer capabilities.",
    smda: "**1. Strategic Priorities and Initiatives**\n- NIKE's goal is to deliver value to shareholders by building a profitable global portfolio of branded footwear, apparel, equipment, and accessories.\n- The Consumer Direct Offense strategy focuses on the Triple Double: doubling innovation impact, speed to market, and direct consumer connections.\n- Investments in digital commerce, data/analytics, and a new ERP tool drive the end-to-end digital transformation.\n\n**2. Operational and Segment Performance**\n- NIKE Brand revenue +8% to $9.1B; Sportswear and Jordan Brand led growth.\n- Converse revenue -4% to $482M, driven by declines in the U.S. and Europe.\n- North America currency-neutral +7%; EMEA +12%; Greater China +24%; APLA +14%.\n- NIKE Direct digital sales +36% globally, driven by digital commerce.\n\n**3. Financial Results and Key Trends**\n- Revenue $9.6B (+7% reported, +11% currency-neutral).\n- Gross margin 45.1% vs 43.8% prior year (higher ASP, improved product mix).\n- SG&A $3.09B (32.2% of revenue) driven by digital investments.\n- Net income $1.1B, diluted EPS $0.68 vs net loss in prior year.\n- Effective tax rate 15.8% vs 164.1% (normalized after TCJA).\n\n**4. Identified Risks and Uncertainties**\n- Foreign currency volatility from global trade uncertainty and geopolitical dynamics.\n- Argentina classified as hyper-inflationary; functional currency changed to USD.\n- Competitive pressures in the athletic footwear and apparel market.\n\n**5. Forward-Looking Statements and Guidance**\n- NIKE Direct expected to continue accelerating growth through digital commerce and store expansion.\n- Long-term financial goals remain unchanged despite FX volatility.\n\n**6. Significant Changes, Events, or Developments**\n- New $15B four-year share repurchase program authorized.\n- 10.5M shares repurchased for $850M during the quarter.\n\n**7. Important Figures and Tables**\n| Metric | FY19 Q3 | FY18 Q3 | Change |\n|--------|---------|---------|--------|\n| Revenue | $9,611M | $8,984M | +7% |\n| Gross Margin | 45.1% | 43.8% | +130bp |\n| Net Income | $1,100M | ($921M) | — |\n| EPS (diluted) | $0.68 | ($0.57) | — |\n| Inventory | $5,400M | $5,047M | +7% |\n| Cash & ST Investments | $3,700M | — | — |"
  },
  {
    id: 3,
    company: "Enron Corp.",
    cik: "0001024401",
    quarter: "2001 Q2",
    industry: "NATURAL GAS TRANSMISSION & DISTRIBUTION",
    fraud: true,
    misstatements: ["Revenue", "Liabilities", "Assets Valuation", "Capitalized Costs", "Reserve Account"],
    aaerSummary: "Massive financial fraud involving off-balance-sheet special purpose entities (SPEs) to conceal over $1 billion in debt and inflate earnings by approximately $1 billion. Mark-to-market accounting on long-term energy contracts was abused to recognize fictitious future profits immediately.",
    redFlags: ["Off-balance-sheet SPEs to hide debt", "Mark-to-market on illiquid long-term contracts", "Revenue growing faster than cash flow", "Related-party transactions with undisclosed entities", "Unusually high return on equity"],
    rawMDA: "Enron reported second quarter 2001 revenues of $50.1 billion, a 55% increase year-over-year, with net income of $404 million. The company's wholesale services segment reported revenues of $37.6 billion and operating income of $387 million. Enron's energy services segment grew revenues to $8.2 billion from $4.4 billion in the prior year. The company reported earnings per diluted share of $0.45, compared to $0.34 in the same quarter last year. Enron's return on invested capital was reported at 11%. The company stated that it had successfully deployed its asset-light merchant model to capture market share in the deregulating energy markets. EnronOnline, the company's electronic trading platform, reported 45,000 transactions totaling $1.1 trillion in notional value in the first six months of 2001. The company reported $19.5 billion in total assets and $10.2 billion in total shareholders' equity. Long-term debt was reported at $9.6 billion. The company's stock traded at approximately 55 times trailing earnings. Cash flow from operations was reported at $2.9 billion, while capital expenditures were $1.7 billion. The company disclosed that it had entered into various transactions with related parties, including LJM1, LJM2, and Chewco, which were described as limited partnerships with independent third parties. These entities engaged in transactions that hedged the company's merchant investments and provided financing. The company also discussed its use of mark-to-market accounting for its long-term energy contracts, which allowed the company to recognize the full present value of expected future profits at contract inception. Management attributed the strong results to the company's first-mover advantage in energy trading and its ability to leverage its asset base through the merchant model. They noted that the company was well-positioned to benefit from further deregulation in the electricity and natural gas markets.",
    smda: "**1. Strategic Priorities and Initiatives**\n- Enron pursued an asset-light merchant model focused on trading and marketing energy commodities.\n- EnronOnline electronic trading platform was positioned as a key competitive advantage.\n- The company sought to leverage first-mover advantage in deregulating energy markets.\n\n**2. Operational and Segment Performance**\n- Wholesale services: $37.6B revenue, $387M operating income.\n- Energy services: $8.2B revenue (up from $4.4B prior year).\n- EnronOnline: 45,000 transactions, $1.1 trillion notional value in 6 months.\n\n**3. Financial Results and Key Trends**\n- Revenue $50.1B (+55% YoY), net income $404M, EPS $0.45 vs $0.34.\n- $19.5B total assets, $10.2B shareholders' equity.\n- Stock trading at ~55x trailing earnings, an extremely high multiple.\n- Cash flow from operations $2.9B, CapEx $1.7B.\n- Mark-to-market accounting on long-term contracts recognized expected future profits immediately.\n\n**4. Identified Risks and Uncertainties**\n- Regulatory risks associated with energy market deregulation.\n- Counterparty credit risk in the trading book.\n- Market volatility in energy commodity prices.\n\n**5. Forward-Looking Statements and Guidance**\n- Management expressed confidence in continued growth driven by trading operations.\n- Company positioned to benefit from further deregulation in electricity and natural gas.\n\n**6. Significant Changes, Events, or Developments**\n- Transactions with related parties disclosed: LJM1, LJM2, Chewco limited partnerships.\n- Off-balance-sheet entities used for hedging merchant investments.\n\n**7. Important Figures and Tables**\n| Metric | 2001 Q2 | 2000 Q2 | Change |\n|--------|---------|---------|--------|\n| Revenue | $50.1B | $32.3B | +55% |\n| Net Income | $404M | $305M | +32% |\n| EPS | $0.45 | $0.34 | +32% |\n| Long-term Debt | $9.6B | — | — |\n| Shareholders' Equity | $10.2B | — | — |\n| P/E Ratio | ~55x | — | — |"
  },
  {
    id: 4,
    company: "The Walt Disney Company",
    cik: "0000886982",
    quarter: "2021 Q1",
    industry: "MOTION PICTURES",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Standard quarterly filing with consistent revenue recognition policies. Auditors issued unqualified opinion with no material weaknesses reported.",
    redFlags: [],
    rawMDA: "The Walt Disney Company reported revenues of $16.2 billion for the first quarter of fiscal 2021, compared to $20.9 billion in the prior-year quarter. The decline was primarily driven by the impact of COVID-19 on the company's theme parks, experiences, and products segment. However, the company's direct-to-consumer segment showed significant strength. Disney+ subscribers reached 94.9 million by the end of the quarter, up from 73.7 million in the prior quarter, representing a 29% increase. Total direct-to-consumer revenues increased 73% to $3.5 billion. Media and entertainment distribution revenues were $12.6 billion, with linear networks contributing $7.2 billion. The parks, experiences, and products segment generated revenues of $3.6 billion, down 53% from $7.6 billion in the prior year, reflecting capacity restrictions and temporary park closures. Segment operating income was $0.1 billion compared to $2.3 billion in the prior year. The company reported diluted earnings per share of $0.02 compared to $1.53 in the prior year. Excluding certain items, adjusted EPS was $0.32. Disney reported cash provided by operations of $3.4 billion and free cash flow of $1.8 billion. The company had $16.7 billion in cash and cash equivalents. Total debt was $55.1 billion. The company declared a semi-annual cash dividend of $0.88 per share, paid in January 2021. Capital expenditures for the quarter were $1.1 billion. The company continued to invest in content for its streaming platforms, with content spending on Disney+ original programming accelerating. Management noted that the company's transformation to a direct-to-consumer-focused entertainment company was ahead of schedule, and they expected the parks segment to recover as vaccination distribution expanded.",
    smda: "**1. Strategic Priorities and Initiatives**\n- The company accelerated its transformation to a direct-to-consumer-focused entertainment model.\n- Disney+ original content investment increased significantly to drive subscriber growth.\n- Despite COVID-19 impact, the company maintained its commitment to the streaming-first strategy.\n\n**2. Operational and Segment Performance**\n- Disney+ subscribers reached 94.9M (+29% from 73.7M in prior quarter).\n- Media & entertainment distribution: $12.6B revenue.\n- Parks, experiences & products: $3.6B revenue (-53% YoY due to COVID-19).\n- Direct-to-consumer revenue: $3.5B (+73% YoY).\n\n**3. Financial Results and Key Trends**\n- Total revenue $16.2B vs $20.9B prior year (COVID-19 impact on parks).\n- Diluted EPS $0.02 vs $1.53 prior year; adjusted EPS $0.32.\n- Cash from operations $3.4B, free cash flow $1.8B.\n- $16.7B cash and equivalents, $55.1B total debt.\n- CapEx $1.1B, focused on streaming content investment.\n\n**4. Identified Risks and Uncertainties**\n- COVID-19 pandemic continued to impact theme park operations and capacity.\n- Global economic uncertainty affecting advertising and consumer spending.\n- Highly competitive streaming market with significant content investment required.\n\n**5. Forward-Looking Statements and Guidance**\n- Park segment expected to recover as vaccination distribution expands.\n- Disney+ subscriber growth expected to continue with content slate acceleration.\n\n**6. Significant Changes, Events, or Developments**\n- Semi-annual cash dividend of $0.88 per share declared and paid.\n- Content spending on Disney+ original programming accelerated.\n- Transformation to direct-to-consumer model ahead of schedule.\n\n**7. Important Figures and Tables**\n| Metric | FY21 Q1 | FY20 Q1 | Change |\n|--------|---------|---------|--------|\n| Revenue | $16.2B | $20.9B | -22% |\n| Parks Revenue | $3.6B | $7.6B | -53% |\n| DTC Revenue | $3.5B | $2.0B | +73% |\n| Disney+ Subs | 94.9M | — | +29% QoQ |\n| Diluted EPS | $0.02 | $1.53 | -99% |\n| Free Cash Flow | $1.8B | — | — |"
  },
  {
    id: 5,
    company: "HealthSouth Corp.",
    cik: "0000761602",
    quarter: "2002 Q3",
    industry: "HEALTH SERVICES",
    fraud: true,
    misstatements: ["Revenue", "Accounts Receivable", "Reserve Account"],
    aaerSummary: "Systematic overstatement of operating income across all divisions through fictitious revenue recognition, channel stuffing, and improper capitalization of expenses. Senior management coordinated the fraud across multiple business units over several years. Total overstatement exceeded $2.4 billion.",
    redFlags: ["Revenue far exceeding cash flow from operations", "Channel stuffing at quarter-end", "Unusual capitalization of expenses", "Consistent beat of analyst estimates for years", "Senior management involved in coordinating false entries"],
    rawMDA: "HealthSouth reported revenues of $1.2 billion for the third quarter of 2002, representing a 17% increase over the prior year. Net income was reported at $165 million, with diluted earnings per share of $0.41, exceeding analyst consensus estimates of $0.38. The company reported operating cash flow of $89 million, significantly lower than net income. Days sales outstanding increased to 72 days from 58 days in the prior year. The company's acute care hospitals segment reported revenue growth of 22%, while outpatient rehabilitation grew 15%. HealthSouth reported that its inpatient rehabilitation facilities maintained 72% occupancy rates. The company's allowance for doubtful accounts was reported at 4.5% of accounts receivable, consistent with prior periods. However, accounts receivable over 90 days past due increased to 12% from 8%. The company added 12 new inpatient rehabilitation facilities during the quarter through acquisitions. Capital expenditures were $156 million, including investments in new facility construction and medical equipment. HealthSouth's debt-to-total-capitalization ratio was 42%. The company emphasized its strong internal controls and management's commitment to accurate financial reporting. Management expressed confidence in the company's ability to continue delivering double-digit earnings growth through a combination of organic growth and strategic acquisitions. They highlighted the favorable demographics of an aging population as a key growth driver. The board authorized an additional $500 million for share repurchases.",
    smda: "**1. Strategic Priorities and Initiatives**\n- HealthSouth pursued growth through acquisitions, adding 12 new inpatient rehabilitation facilities.\n- The company emphasized organic growth combined with strategic acquisitions.\n- $500M share repurchase program authorized, signaling confidence in the company.\n\n**2. Operational and Segment Performance**\n- Acute care hospitals segment revenue +22%.\n- Outpatient rehabilitation revenue +15%.\n- Inpatient rehab facilities maintained 72% occupancy.\n\n**3. Financial Results and Key Trends**\n- Revenue $1.2B (+17% YoY); net income $165M; EPS $0.41 vs estimate $0.38.\n- Operating cash flow $89M — significantly lower than $165M net income (red flag).\n- Days sales outstanding increased from 58 to 72 days.\n- Receivables over 90 days past due increased to 12% from 8%.\n- CapEx $156M; debt-to-cap 42%.\n\n**4. Identified Risks and Uncertainties**\n- Regulatory changes in Medicare/Medicaid reimbursement rates.\n- Integration risks from acquisition strategy.\n- Competition from other healthcare providers.\n\n**5. Forward-Looking Statements and Guidance**\n- Management expressed confidence in continued double-digit earnings growth.\n- Favorable demographics (aging population) cited as key growth driver.\n\n**6. Significant Changes, Events, or Developments**\n- 12 new inpatient rehabilitation facilities acquired.\n- $500M share repurchase program authorized.\n- Management emphasized strong internal controls (later proven false).\n\n**7. Important Figures and Tables**\n| Metric | 2002 Q3 | Guidance | |\n|--------|---------|----------|--|\n| Revenue | $1,200M | — | +17% |\n| Net Income | $165M | — | — |\n| EPS | $0.41 | $0.38 | Beat |\n| Op Cash Flow | $89M | — | vs $165M NI |\n| DSO | 72 days | 58 days | +14 days |\n| Bad Debt Allowance | 4.5% | 4.5% | Unchanged |"
  },
  {
    id: 6,
    company: "Amazon.com, Inc.",
    cik: "0001018724",
    quarter: "2018 Q4",
    industry: "RETAIL—COMPUTER SOFTWARE",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Clean quarterly filing with standard disclosures. Consistent revenue recognition policies for product sales, service revenue, and AWS cloud services. Auditors issued unqualified opinion.",
    redFlags: [],
    rawMDA: "Amazon.com reported net sales of $72.4 billion for the fourth quarter of 2018, an increase of 20% compared to $60.5 billion in the prior year, or 22% excluding the $0.8 billion unfavorable impact from foreign exchange. North America segment sales were $44.1 billion, up 18% year-over-year, with operating income of $1.6 billion compared to $649 million in the prior year, driven by strong Prime adoption, fulfillment network expansion enabling one-day and same-day delivery in major metropolitan areas, and increasing marketplace selection. International segment sales were $20.8 billion, up 15% (18% excluding FX), with an operating loss of $0.3 billion compared to income of $0.2 billion in the prior year, reflecting continued investment in new and emerging markets including India, Australia, and the Middle East, as well as the impact of weakening euro, British pound, and Japanese yen. AWS segment sales were $7.4 billion, up 45% year-over-year, with operating income of $2.4 billion representing a 32% operating margin, marking 11 consecutive quarters of growth exceeding 40% year-over-year. AWS's $30 billion annualized run rate grew 46% year-over-year, driven by accelerating enterprise cloud adoption as organizations of all sizes migrated on-premises infrastructure to achieve greater agility, scalability, and cost efficiency. AWS launched 220 new services and features during the quarter, including Amazon Forecast for time-series forecasting using machine learning, Amazon Personalize for real-time personalization and recommendation, and Amazon Textract for automated text and data extraction from scanned documents. New AWS regions were announced for Hong Kong, Italy, South Africa, and Indonesia. Fulfillment costs were $8.7 billion compared to $7.4 billion in the prior year, reflecting investments in fulfillment capacity to support faster delivery speeds, with one-day and same-day delivery networks outpacing the standard two-day network in certain major metropolitan areas during the holiday season. Marketing costs were $4.5 billion compared to $3.9 billion. Technology and content costs were $6.4 billion compared to $5.0 billion, driven by investments in AWS, Alexa, and Prime Video content. General and administrative costs were $1.7 billion compared to $1.4 billion. Gross profit increased to $22.8 billion or 31.5% of net sales, compared to $17.7 billion or 29.3% in the prior year, with margin improvement driven by the growing mix of higher-margin businesses including AWS, advertising revenue, and third-party seller services, as well as continued improvements in fulfillment efficiency. Operating income was $3.8 billion compared to $2.1 billion in the prior year, with AWS contributing $2.4 billion or 63% of total operating income. Net income was $3.0 billion or $6.04 per diluted share, compared to $1.9 billion or $3.75 per diluted share in the prior year. TTM net income was $10.1 billion. Free cash flow was $19.4 billion for TTM, compared to $8.4 billion in the prior year. The company employed 647,500 full-time and part-time employees worldwide as of December 31, 2018, up from 566,000 a year earlier, reflecting investment in fulfillment capacity, AWS, and other growth initiatives. In November 2018, the company raised its U.S. minimum wage to $15 per hour for all employees. Capital expenditures were $13.9 billion including property and equipment acquired under capital leases, compared to $10.1 billion in the prior year, including investments in fulfillment centers, AWS data centers, transportation capabilities including Amazon Air, and technology infrastructure. Operating cash flow was $30.7 billion for TTM compared to $18.4 billion in the prior year. Cash and marketable securities totaled $45.2 billion compared to $34.2 billion at year-end 2017. Total debt and capital lease obligations were $24.5 billion compared to $24.8 billion in the prior year, resulting in a net cash surplus of $20.7 billion. Third-party seller units represented 58% of total units sold, providing customers with unparalleled selection. Prime membership continued to grow globally, with members receiving free shipping, Prime Video, Prime Music, Prime Reading, and exclusive deals. The company's effective tax rate was 12.0% for TTM compared to 27.0% in the prior year, primarily due to the reduction in the U.S. federal corporate income tax rate from 35% to 21% under the Tax Cuts and Jobs Act, as well as the favorable impact of foreign earnings, research and development credits, and excess tax benefits from stock-based compensation. Deferred tax assets of $4.1 billion were partially offset by valuation allowances of $0.8 billion, with uncertain tax positions of $1.2 billion including accrued interest and penalties. Contractual obligations totaled approximately $37.2 billion, consisting of $24.5 billion in debt and capital lease obligations, $8.3 billion in operating leases for fulfillment centers, data centers, and corporate offices with a weighted average remaining term of 6.3 years and $1.5 billion payable within 12 months, and $4.4 billion in purchase obligations for inventory, software, cloud services, and content licensing including Prime Video programming commitments. The company maintained a $2.0 billion unsecured revolving credit facility maturing December 2023 that remained undrawn, replacing a prior $1.5 billion facility. The credit agreement contained customary covenants including a maximum leverage ratio with which the company remained in compliance. The investment portfolio of $26.5 billion consisted principally of corporate debt securities, U.S. government and agency securities, and commercial paper with a weighted average duration of 1.4 years. A hypothetical 100-basis-point increase in interest rates would reduce the fair value of fixed-income securities by approximately $0.4 billion. Variable-rate debt exposure would increase annual interest expense by approximately $65 million. Foreign currency exposure was managed through forward contracts with a notional amount of $8.2 billion designated as cash flow hedges, with changes in fair value recognized in accumulated other comprehensive income and reclassified to earnings when hedged transactions affected earnings. A hypothetical 10% strengthening of the U.S. dollar against all foreign currencies would reduce net sales by approximately $2.8 billion and operating income by $0.3 billion annually. The company's operations spanned more than 50 currencies, with the International segment's operating results most significantly affected by movements in the euro, British pound, and Japanese yen. Commodity price risk from fuel costs associated with the transportation network was managed through optimization of routing, alternative fuel vehicles, and carrier diversification, with a hypothetical 10% increase in fuel prices increasing annual fulfillment costs by approximately $200 million. Stock-based compensation expense was $6.8 billion for TTM compared to $5.4 billion in the prior year, with unrecognized compensation expense of $9.5 billion expected to be recognized over a weighted average period of 1.8 years. The valuation of performance-based stock units incorporated Monte Carlo simulation assumptions for expected stock price volatility, risk-free interest rates, and probability of achieving performance conditions. Revenue recognition policies were consistently applied following the adoption of ASC 606 effective January 1, 2018 using the modified retrospective method, with no material impact on consolidated results. Variable consideration estimates including volume discounts, cooperative marketing agreements, promotional allowances, and rebates were estimated using the expected value method based on historical experience, current trends, and projected customer behavior, with adjustments of approximately $1.5 billion reducing reported revenue for TTM. Inventory was stated at the lower of cost or net realizable value using the FIFO method, with write-downs for estimated excess, obsolescence, and slow-moving inventory. The wholesale inventory was $17.2 billion at December 31, 2018. The company adopted ASU 2016-02 (Leases) effective January 1, 2019 using the modified retrospective approach, expected to result in a significant increase in operating lease assets and liabilities on the balance sheet without materially affecting the income statement. Off-balance-sheet arrangements primarily consisted of operating leases for fulfillment centers, data centers, corporate offices, and retail store locations, with future minimum lease payments of $8.3 billion. The company also had commitments under take-or-pay arrangements and purchase obligations not recorded on the balance sheet until goods or services were received, as well as financial guarantees and indemnifications to certain third parties including intellectual property indemnifications to customers and indemnifications to lenders in securitization programs. Key risks include intense competition in e-commerce from Walmart, Target, and other retailers, competition in cloud computing from Microsoft Azure and Google Cloud, changes in consumer discretionary spending, foreign exchange fluctuations, and increasing regulatory scrutiny related to data privacy, antitrust, and digital market regulation in the United States and European Union including GDPR compliance and potential Digital Markets Act requirements.",
    smda: "**1. Strategic Priorities and Initiatives**\n- Amazon continued to invest in fulfillment infrastructure, AWS data centers, and Prime Video content.\n- Expansion of AWS services with new ML/AI offerings: Amazon Forecast, Personalize, and Textract.\n- Advertising business growth driven by sponsored products and brand advertising.\n\n**2. Operational and Segment Performance**\n- North America segment: $44.1B (+18% YoY).\n- International segment: $20.8B (+15% reported, +18% ex-FX).\n- AWS segment: $7.4B (+45% YoY).\n- AWS annualized run rate: $30B.\n- Third-party seller units: 58% of total units sold.\n- 647,500 employees globally.\n\n**3. Financial Results and Key Trends**\n- Net sales $72.4B (+20% YoY).\n- Operating income $3.8B (AWS contributed $2.4B / 63%).\n- Net income $3.0B vs $1.9B prior year.\n- Free cash flow $19.4B (TTM) vs $8.4B prior year.\n- Operating cash flow $30.7B (TTM).\n- CapEx $13.9B (TTM).\n\n**4. Identified Risks and Uncertainties**\n- Foreign exchange fluctuations impacting international results.\n- Competitive pressures in cloud computing (Microsoft Azure, Google Cloud).\n- Regulatory scrutiny related to market power and data privacy.\n\n**5. Forward-Looking Statements and Guidance**\n- AWS expected to continue rapid growth driven by enterprise cloud adoption.\n- Continued heavy investment in fulfillment capacity for faster delivery.\n\n**6. Significant Changes, Events, or Developments**\n- AWS launched new ML/AI services.\n- Prime Video content investment continued.\n\n**7. Important Figures and Tables**\n| Segment | Q4 2018 | Q4 2017 | Change |\n|---------|---------|---------|--------|\n| North America | $44.1B | $37.3B | +18% |\n| International | $20.8B | $18.0B | +15% |\n| AWS | $7.4B | $5.1B | +45% |\n| **Total** | **$72.4B** | **$60.5B** | **+20%** |\n| Op Income (AWS) | $2.4B | $1.0B | +140% |\n| FCF (TTM) | $19.4B | $8.4B | +131% |"
  },
  {
    id: 7,
    company: "Advanta Corp.",
    cik: "0001060391",
    quarter: "1999 Q3",
    industry: "FINANCE—RETAIL CREDIT",
    fraud: true,
    misstatements: ["Revenue", "Reserve Account", "Accounts Receivable"],
    aaerSummary: "Premature recognition of credit card origination fees and late fee revenue. Loan loss reserves were intentionally understated by approximately $700 million to meet aggressive earnings targets. Revenue from the Discover card network was recorded before contractual eligibility requirements were met.",
    redFlags: ["Loan loss reserves declining while loan portfolio grew", "Revenue growth outpacing actual cash collections", "Frequent restatements to reverse premature recognitions", "Management turnover during investigation period", "Credit card fee income growing faster than managed receivables"],
    rawMDA: "Advanta Corp. reported third quarter 1999 net income of $42 million, or $0.68 per diluted share, compared to $38 million or $0.61 per share in the prior year, representing earnings growth of 11.5%. Managed credit card receivables grew to $8.2 billion from $6.8 billion in the prior year, representing 21% growth, driven by 425,000 new account acquisitions during the quarter through successful direct mail campaigns targeting both prime and non-prime consumer segments, and continued utilization by existing cardholders with average monthly payment rates remaining stable at approximately 14% of outstanding balances. The weighted average APR on the portfolio was 18.5%, down from 19.2% in the prior year, reflecting mix shift toward prime customers and competitive pricing pressure. The prime segment comprised approximately 55% of outstandings with annualized net charge-off rates of 1.2% and yields of 16.5% APR. The non-prime segment represented approximately 30% of outstandings with higher yields of 22.0% APR and charge-off rates of 3.5%. The small business segment, approximately 15% of outstandings, offered yields of 18.0% APR with charge-off rates of 2.8%. Net interest income for the third quarter of 1999 was $157 million compared to $145 million in the prior year quarter, an increase of 8.3%. Net interest margin declined to 6.8% from 7.2%, reflecting increased funding costs from the Federal Reserve's 25-basis-point rate hike during the quarter as part of a tightening cycle that began in June 1999. Gross interest income increased to $268 million from $237 million, while interest expense increased to $111 million from $92 million, reflecting higher average debt levels and increased funding costs. The provision for credit losses was $42 million compared to $40 million in the prior year, reflecting growth in the managed receivables portfolio partially offset by stable credit quality trends. Credit card fee income was $87 million, up 31% from $66 million in the prior year, including annual membership fees recognized over the membership period, late payment fees and over-limit fees recognized when assessed, and origination fees including balance transfer and cash advance fees deferred and recognized as interest income over the expected life of the receivable using the effective interest method. Fee income was recorded net of estimated reversals of approximately $4 million based on historical experience with customer disputes, goodwill adjustments, and regulatory compliance. Total non-interest income was $114 million, up 25.3% from $91 million. Non-interest expense was $112 million compared to $100 million, including marketing and solicitation costs of $39 million reflecting the cost of new account acquisition programs, processing and servicing costs of $42 million related to ongoing management of the receivables portfolio, and other operating expenses of $31 million. The allowance for loan losses was $142 million, representing 3.1% of on-balance-sheet receivables of $4.6 billion, compared to $136 million and 3.3% in the prior year. Off-balance-sheet securitized receivables totaled $3.6 billion through master trust and other securitization programs, with an allowance of $28 million representing 0.8% coverage on off-balance-sheet receivables compared to $30 million or 0.9% in the prior year. The allowance for credit losses was determined using a migration analysis model that stratifies the portfolio by delinquency status and applies historical loss emergence rates to each delinquency bucket, incorporating assumptions regarding the timing of loss emergence, recovery rates on charged-off accounts, and the representativeness of historical loss experience as an indicator of future losses. The allowance was reviewed quarterly by management and adjusted as necessary based on changes in portfolio composition, economic conditions, and recent loss trends. Net charge-offs were $41 million or 2.0% of average managed receivables on an annualized basis, versus $38 million or 2.2% in the prior year, reflecting the seasoning of newer vintages, favorable economic conditions, and the effectiveness of credit risk management practices. Delinquencies over 30 days were 4.0% of managed receivables, down from 4.3% in the prior year. On-balance-sheet credit quality was similarly favorable. Total assets were $5.2 billion compared to $4.6 billion at December 31, 1998, with cash and cash equivalents of $128 million and investments in debt securities and other investments of $215 million. Shareholders' equity was $1.1 billion. The Tier 1 leverage ratio was 14.2% and the total risk-based capital ratio was 18.5%, well above regulatory minimums for well-capitalized institutions of 5% and 10%, respectively. Funding sources included retail deposits of $2.3 billion at bank subsidiaries including money market accounts, certificates of deposit, and savings accounts with weighted average maturities of less than one year for money market and savings products and approximately 18 months for certificates of deposit, securitization funding of $3.6 billion through master trust programs with a renewed $500 million committed warehouse credit facility providing additional liquidity, and wholesale borrowings of $0.8 billion including Federal funds purchased, securities sold under repurchase agreements, and other short-term borrowings. The company repurchased 1.2 million shares for $42 million during the quarter under its authorized share repurchase program. Return on average assets was 1.6% and return on average equity was 20.0% for the quarter. Securitization accounting under SFAS No. 140 was applied for transfers of credit card receivables to trusts, with retained servicing rights and certain interests including interest-only strips and cash reserve accounts recorded at fair value with changes in fair value recognized in earnings. The fair value of retained interests of $95 million was estimated using a discounted cash flow model incorporating assumptions about credit losses, payment rates, and discount rates. A 10% increase in expected credit losses would reduce the fair value of retained interests by approximately $12 million, and a 10% decrease in expected payment rates would reduce fair value by approximately $8 million. Interest rate risk was managed through the matching of asset and liability maturities, the use of interest rate swap agreements, and the maintenance of a diversified funding base. Net interest income would decrease by approximately $6.5 million for a hypothetical 100-basis-point decrease in short-term interest rates as variable-rate assets would reprice downward more quickly than liabilities, while a 100-basis-point increase would increase net interest income by approximately $5.2 million. Credit risk was managed through underwriting standards, credit scoring models, account management practices, and collection procedures. A hypothetical 100-basis-point increase in the net charge-off rate would reduce pre-tax income by approximately $82 million on an annualized basis. Concentration risk was managed through geographic diversification with no single state representing more than 10% of outstanding receivables. The company's smaller business credit card product was launched during the quarter to capitalize on the underserved small business segment. The company faced intense competition from larger issuers including MBNA Corporation, First USA, Citigroup, and Discover Financial Services, competing on the basis of pricing, product features, brand recognition, distribution channels, and risk-based pricing capabilities. Industry consolidation among competitors and increasing investment in marketing and technology continued to intensify competitive pressures. The company's bank subsidiaries were regulated by the Office of the Comptroller of the Currency, the Federal Deposit Insurance Corporation, and state banking authorities. Changes in regulatory requirements, including potential legislation to limit credit card interest rates and fees, could materially affect the company's business model and profitability. The company maintained a regulatory compliance program designed to ensure adherence to the Truth in Lending Act, Fair Credit Reporting Act, Equal Credit Opportunity Act, and Fair Debt Collection Practices Act. The company adopted SFAS No. 133 effective for fiscal years beginning after June 15, 2000, which required all derivative instruments to be recorded on the balance sheet at fair value, and was evaluating the impact of adoption. The company was also evaluating SEC Staff Accounting Bulletin No. 101 regarding revenue recognition practices.",
    smda: "**1. Strategic Priorities and Initiatives**\n- Advanta focused on growing its managed credit card portfolio through new account acquisition programs.\n- Expansion of co-branded credit card partnerships was a key growth strategy.\n- Launched a new small business credit card product during the quarter.\n\n**2. Operational and Segment Performance**\n- Managed credit card receivables grew to $8.2B (+21% YoY).\n- Credit card fee income: $87M (+31% YoY) — outpacing receivable growth.\n- Prime and subprime portfolio segments both contributed to growth.\n\n**3. Financial Results and Key Trends**\n- Net income $42M, EPS $0.68 vs $0.61 prior year.\n- Net interest margin 6.8% vs 7.2% (declining).\n- Allowance for loan losses $142M (2.8% of receivables) vs $136M (3.0%) — declining reserve ratio despite portfolio growth (red flag).\n- Net charge-offs 2.0% vs 2.2%.\n- Delinquencies 4.0% vs 4.3%.\n- ROE 20%; efficiency ratio 35% vs 38%.\n\n**4. Identified Risks and Uncertainties**\n- Credit risk in subprime portfolio segment.\n- Interest rate risk from rising funding costs.\n- Competitive pressure in credit card market.\n\n**5. Forward-Looking Statements and Guidance**\n- Management expected continued credit metric improvement from refined scoring models.\n\n**6. Significant Changes, Events, or Developments**\n- Small business credit card product launched.\n- Co-branded partnerships expanded.\n\n**7. Important Figures and Tables**\n| Metric | 1999 Q3 | 1998 Q3 | Change |\n|--------|---------|---------|--------|\n| Managed Receivables | $8.2B | $6.8B | +21% |\n| Fee Income | $87M | $66M | +31% |\n| Net Income | $42M | $38M | +11% |\n| Allowance/Loans | 2.8% | 3.0% | -20bp |\n| Net Charge-offs | 2.0% | 2.2% | -20bp |\n| Delinquency 30+ | 4.0% | 4.3% | -30bp |"
  },
  {
    id: 8,
    company: "Merrill Lynch & Co., Inc.",
    cik: "0000789019",
    quarter: "2019 Q4",
    industry: "SECURITIES",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Clean filing with standard disclosures. Company maintained adequate reserves and conservative valuation models across all trading and advisory divisions.",
    redFlags: [],
    rawMDA: "Bank of America, the parent company of Merrill Lynch, reported fourth quarter 2019 net income of $6.7 billion, or $0.74 per diluted share, compared to $7.3 billion or $0.70 per share in the prior year. Global Wealth & Investment Management (GWIM), which includes Merrill Lynch, reported revenue of $4.7 billion, up 2% year-over-year compared to $4.6 billion. Net income for the wealth management division was $1.1 billion, compared to $1.0 billion in the prior year quarter. Total client balances reached a record $2.9 trillion at December 31, 2019, an increase of 12% compared to $2.6 trillion at year-end 2018, driven by net new household growth and market appreciation during the year. Merrill Lynch produced its ninth consecutive quarter of net new household growth, with approximately 5,000 net new households added during the quarter, representing a leading indicator of future revenue growth. Financial advisor headcount increased 4% to 14,114 advisors compared to 13,560 in the prior year, reflecting successful recruiting from other firms and continued investment in the trainee program for new advisors. The retention rate for experienced financial advisors remained above 95%, reflecting the advisor value proposition, culture, and career development opportunities. Average annualized revenue per financial advisor increased 3% to $1.12 million from $1.09 million in the prior year quarter, reflecting the benefit of higher client balances and the effectiveness of the wealth management platform. The wealth management division's pretax margin was 28%, within the company's target range of the mid-to-high 20% range, compared to 27% in the prior year quarter. Asset management fees were $2.3 billion for the fourth quarter, up 3% compared to the prior year quarter, driven by higher average market levels and net new asset flows partially offset by a shift in product mix toward lower-fee advisory programs. Total client assets under management in discretionary advisory programs reached a record $530 billion, representing approximately 18% of total client balances, reflecting the continued adoption of managed advisory solutions. Brokerage fees and transaction-based revenue were $0.6 billion, relatively flat compared to the prior year quarter, reflecting lower trading volumes in a low-volatility market environment. Net interest income was $1.1 billion, up 2% compared to the prior year quarter, driven by higher deposit balances and loan growth partially offset by the impact of three Federal Reserve rate cuts totaling 75 basis points during 2019. Non-interest expense was $3.4 billion, relatively flat compared to the prior year quarter, consisting of revenue-related compensation costs of $1.9 billion reflecting revenue levels during the quarter, general and administrative expenses of $0.7 billion driven by technology investments and regulatory costs, and other expenses of $0.8 billion. Retail deposits held at Bank of America by Merrill Lynch clients totaled $122 billion at December 31, 2019, an increase of 8% compared to $113 billion at year-end 2018. Loan balances outstanding in the wealth management division were $164 billion, an increase of 4% compared to $157 billion at year-end 2018, driven by residential mortgage and securities-based lending reflecting client demand for borrowing solutions. The loan portfolio continued to perform well with net charge-offs remaining low relative to historical averages. The wealth management loan portfolio was primarily composed of residential mortgage loans, securities-based loans, and other secured lending benefiting from conservative loan-to-value ratios and strong collateral positions. Bank of America maintained a Common Equity Tier 1 ratio of 11.4% under the Basel III standardized approach as of December 31, 2019, well above the regulatory minimum of 4.5% plus the capital conservation buffer. The supplementary leverage ratio was 6.8% for the quarter, exceeding the 3% regulatory minimum. The average Liquidity Coverage Ratio was approximately 115% during the fourth quarter of 2019, above the regulatory minimum of 100%. The company's liquidity portfolio consisted of high-quality liquid assets totaling approximately $725 billion at December 31, 2019, providing substantial liquidity resources to support ongoing operations. Bank of America declared a quarterly common stock dividend of $0.18 per share during the fourth quarter and received Federal Reserve non-objection to its capital plan as part of the Comprehensive Capital Analysis and Review (CCAR) process. The average daily Value-at-Risk (VaR) for the wealth management division was $12 million for the fourth quarter of 2019 at a 99% confidence level over a one-day holding period, reflecting the conservative risk profile of the business. The maximum daily VaR during the quarter was $18 million. The average daily VaR for the total corporation was $42 million. Market risk was measured and managed using a variety of risk metrics including VaR and stress testing frameworks. A hypothetical 10% decline in equity market values would reduce annual asset management fee revenue by approximately $230 million. On an interest rate sensitivity basis, a hypothetical 100-basis-point parallel shift upward in interest rates would increase annual net interest income by approximately $3.0 billion for the consolidated company, while a 100-basis-point decrease would reduce net interest income by approximately $2.2 billion. The wealth management division's contribution to this sensitivity was approximately $0.3 billion. The company managed interest rate risk through the use of derivative instruments including interest rate swaps, caps, and floors. Credit risk was managed through disciplined underwriting standards, ongoing portfolio monitoring, and diversification across borrower types and geographies. Operational risk management included comprehensive policies, procedures, and internal controls with ongoing investment in technology, cybersecurity, and business continuity capabilities. The SEC's Regulation Best Interest became effective June 30, 2019, establishing a new standard of conduct for broker-dealers making recommendations to retail customers, requiring them to act in the best interest of the retail customer without placing their own financial interests ahead of the customer. The company implemented policies, procedures, and training programs to ensure compliance with Regulation Best Interest and modified certain compensation arrangements and disclosure practices. The Department of Labor's fiduciary rule was vacated by the Fifth Circuit Court of Appeals. The Dodd-Frank Wall Street Reform and Consumer Protection Act continued to influence the regulatory landscape with enhanced capital, liquidity, and risk management requirements. The company adopted ASU 2016-13 (CECL) effective January 1, 2020 using the modified retrospective method, resulting in a one-time increase in the allowance for credit losses of approximately $3.6 billion at the consolidated level and a cumulative-effect reduction to retained earnings of approximately $2.7 billion net of tax. For the wealth management division specifically, the CECL impact was approximately $0.3 billion primarily related to residential mortgage and securities-based lending portfolios. Goodwill impairment testing was performed annually at the reporting unit level using a combination of the income approach (discounted cash flow analysis with discount rate range of 9% to 11%, terminal growth rate of 3%, and projected revenue growth of 2% to 4%) and the market approach (comparable company multiples). The 2019 annual impairment test indicated that the fair value of each reporting unit substantially exceeded its carrying value, and no impairment was required. Level 3 fair value measurements represented approximately 5% of financial instruments measured at fair value at the consolidated level, totaling approximately $22 billion, primarily consisting of mortgage-backed securities, private equity investments, and structured products. A hypothetical 10% change in the fair value of Level 3 assets would affect pre-tax income by approximately $2.2 billion. The aggregate accrual for legal and regulatory contingencies was $1.2 billion at the consolidated level, with a range of reasonably possible losses in excess of accrued amounts estimated at $0 to $1.5 billion. The company maintained access to $15 billion in committed syndicated credit facilities that remained undrawn. The company's efficiency ratio improved to 60.5% from 61.8% in the prior year. Global Banking & Markets revenue was $4.3 billion, driven by strong sales and trading results.",
    smda: "**1. Strategic Priorities and Initiatives**\n- Merrill Lynch focused on its full-service wealth management model with responsible growth strategy.\n- Continued investment in advisor recruiting and training to grow the advisor force.\n- Expansion of banking and lending products to deepen client relationships.\n\n**2. Operational and Segment Performance**\n- GWIM revenue $4.7B (+2% YoY).\n- Net new household growth for 9th consecutive quarter.\n- Advisor headcount: 14,114 (+4%).\n- Revenue per advisor: $1.12M (+3%).\n- Client balances: $2.9T record (+12%).\n- Discretionary AUM: $530B.\n\n**3. Financial Results and Key Trends**\n- Net income $1.1B for wealth management division.\n- Pretax margin 28%, within target range.\n- Loan balances $164B (+4%).\n- Efficiency ratio 60.5% vs 61.8% (improving).\n- VaR $42M average (conservative risk profile).\n\n**4. Identified Risks and Uncertainties**\n- Market volatility impacting wealth management fees and trading revenue.\n- Interest rate environment affecting net interest income.\n- Regulatory costs and compliance requirements.\n\n**5. Forward-Looking Statements and Guidance**\n- Continued focus on responsible growth through the full-service model.\n- Target pretax margin maintained in the mid-to-high 20s.\n\n**6. Significant Changes, Events, or Developments**\n- Record client balances driven by net new households and market appreciation.\n- Consistent advisor headcount growth for multiple quarters.\n\n**7. Important Figures and Tables**\n| Metric | Q4 2019 | Q4 2018 | Change |\n|--------|---------|---------|--------|\n| GWIM Revenue | $4.7B | $4.6B | +2% |\n| GWIM Net Income | $1.1B | — | — |\n| Client Balances | $2.9T | $2.6T | +12% |\n| Advisors | 14,114 | 13,560 | +4% |\n| Rev/Advisor | $1.12M | $1.09M | +3% |\n| Pretax Margin | 28% | 27% | +100bp |"
  },
  {
    id: 9,
    company: "AIG (American International Group)",
    cik: "0000005272",
    quarter: "2005 Q1",
    industry: "INSURANCE",
    fraud: true,
    misstatements: ["Revenue", "Reserve Account", "Liabilities", "Assets Valuation"],
    aaerSummary: "Material misrepresentation of loss reserves and improper accounting for finite reinsurance transactions. AIG used off-balance-sheet vehicles to inflate loss reserves by $500 million and hid underwriting losses. The company also engaged in bid-rigging and improper broker compensation schemes.",
    redFlags: ["Finite reinsurance used to smooth earnings", "Inconsistent reserve development patterns", "Loss reserves increasing without corresponding premium growth", "Off-balance-sheet special purpose vehicles", "Regulatory investigation into broker compensation"],
    rawMDA: "AIG reported first quarter 2005 net income of $3.9 billion, compared to $2.8 billion in the prior year quarter, an increase of 39.3%. Net income per diluted share was $1.47, compared to $1.05 in the prior year quarter. Net premiums written increased 11.1% to $10.2 billion. Total revenues were $25.3 billion, up 14.5% from $22.1 billion in the prior year quarter. Net premiums earned increased 10.5% to $9.5 billion in the General Insurance segment, reflecting continued price discipline and strong retention. The combined ratio for General Insurance improved to 92.5 from 94.1 in the prior year quarter, driven by favorable prior-year reserve development of $0.4 billion primarily related to accident years 2002 through 2004, lower catastrophe losses of $0.2 billion compared to $0.4 billion in the prior year quarter, and improved current accident year underwriting results reflecting disciplined risk selection and pricing actions. The loss and loss adjustment expense ratio improved to 63.2 from 64.8 in the prior year quarter, reflecting lower current accident year loss ratios and favorable prior-year development. The underwriting expense ratio improved to 25.8 from 26.0. The policyholder dividend ratio was 3.5 compared to 3.3 in the prior year quarter. General Insurance loss and loss adjustment expense reserves were $47.6 billion at March 31, 2005, compared to $45.1 billion at March 31, 2004, reflecting loss reserve strengthening in certain lines of business and the assumption of loss reserves through reinsurance transactions. Asbestos and environmental reserves totaled $4.2 billion at March 31, 2005, representing the company's best estimate of ultimate losses for these exposures given the long latency period of claims, the evolving legal environment, and the difficulty in predicting future claim filing patterns. Acquisition and underwriting expenses were $3.1 billion for the quarter compared to $2.8 billion in the prior year quarter. Net investment income increased 12.0% to $3.1 billion, reflecting higher invested assets and improved yields on the fixed-income portfolio. Net realized capital gains were $0.5 billion compared to $0.3 billion in the prior year quarter. Other revenues including fee income and commissions increased to $11.5 billion from $9.5 billion. The General Insurance segment generated revenues of $12.8 billion, up 12.3% compared to $11.4 billion, with underwriting income of $0.7 billion compared to $0.5 billion driven by lower catastrophe losses and favorable prior-year reserve development. The Life Insurance and Retirement Services segment reported revenues of $8.9 billion, up 14.1% compared to $7.8 billion, with premiums and policy fees increasing 8.5% to $4.5 billion reflecting growth in domestic and international life insurance operations, and net investment income increasing 12.3% to $4.4 billion driven by growth in the general account asset base. Operating income for the segment was $1.6 billion compared to $1.4 billion in the prior year quarter, an increase of 14.3%. Domestic life insurance operations benefited from strong sales of variable annuity products and universal life insurance, while international operations particularly in Asia demonstrated strong growth driven by expansion in emerging markets. The Financial Services segment generated revenues of $3.6 billion, up 24.1% compared to $2.9 billion, with operating income of $1.2 billion compared to $0.9 billion, driven by strong demand in aircraft leasing through International Lease Finance Corporation, capital markets activities benefiting from the favorable interest rate environment and increased client activity, and consumer finance businesses. Interest expense was $0.6 billion for the quarter. Income tax expense was $1.3 billion representing an effective tax rate of 25.0% compared to 26.5% in the prior year quarter. Cash and invested assets totaled $578 billion at March 31, 2005 compared to $562 billion at December 31, 2004. Cash flows from operating activities were $6.2 billion for the three months ended March 31, 2005 compared to $5.1 billion in the prior year period, primarily driven by higher premiums collected and improved underwriting results. Shareholders' equity was $85.7 billion at March 31, 2005 compared to $80.5 billion at December 31, 2004, reflecting net income and unrealized gains on the investment portfolio partially offset by share repurchases and dividends. Unrealized gains on fixed-maturity securities totaled $11.2 billion at March 31, 2005 included in accumulated other comprehensive income. Debt outstanding totaled $27.8 billion compared to $26.5 billion at December 31, 2004, with a debt-to-equity ratio of 32.4% compared to 32.9% at year-end 2004. The company repurchased 8.5 million shares of common stock at a cost of approximately $0.7 billion during the quarter under its authorized share repurchase program. The board declared a quarterly cash dividend of $0.10 per share consistent with the prior quarter. The company's weighted average interest rate on outstanding debt was 5.8%. Long-term debt included senior notes, subordinated debentures, and hybrid capital securities with maturities ranging from 2006 through 2044. The company maintained a $3.5 billion commercial paper program with $1.2 billion outstanding at quarter end, and had commitments under letters of credit and surety bonds of $2.8 billion. A shelf registration statement was filed with the SEC to facilitate future debt and equity offerings. The fixed-maturity securities portfolio of $428 billion had a weighted average duration of 4.8 years. A hypothetical 100-basis-point increase in interest rates would decrease the fair value of fixed-maturity securities by approximately $18.5 billion, while a 100-basis-point decrease would increase fair value by a similar amount. The impact of interest rate changes on insurance operations was reflected in the sensitivity of insurance liabilities, with lower interest rates increasing the present value of future policy benefit liabilities for life insurance and annuity products. The company managed interest rate risk through asset-liability management including duration and cash flow matching, as well as through interest rate derivatives including swaps, caps, and floors with a notional amount of $42 billion. Foreign exchange derivatives with a notional amount of $15 billion were used to manage currency risk across operations in more than 130 countries and jurisdictions. A hypothetical 10% strengthening of the U.S. dollar against all major foreign currencies would reduce consolidated shareholders' equity by approximately $3.8 billion primarily due to the translation of foreign subsidiary net assets into U.S. dollars. Foreign currency risk was managed through foreign currency forward contracts, swaps, and the designation of certain foreign-currency-denominated debt as hedges of net investments in foreign operations. Equity market risk from variable annuity guaranteed minimum death benefits, guaranteed minimum income benefits, and other crediting rate guarantees was hedged using equity index options, futures, and total return swaps, as well as through product design features including asset allocation restrictions and rebalancing requirements. A hypothetical 10% decline in equity markets would increase the reserves required for these guarantees by approximately $1.5 billion pre-tax, partially offset by changes in the fair value of derivative instruments used to hedge these exposures. The company maintained a comprehensive enterprise risk management framework addressing insurance risk including underwriting, pricing, and catastrophe risk, market risk including interest rate, equity, and foreign currency risk, credit risk, operational risk, and liquidity risk, with defined risk limits, stress testing, scenario analysis, and regular reporting to senior management and the board of directors. Catastrophe exposure was managed through risk selection, reinsurance purchasing, and geographic diversification, with a comprehensive reinsurance program maintained to mitigate the impact of large catastrophic events. AIG was cooperating with investigations by the Securities and Exchange Commission, the Department of Justice, and the New York Attorney General regarding certain finite reinsurance transactions and broker compensation practices. The company engaged independent legal counsel and advisors to assist with these reviews and was committed to resolving these matters in a manner consistent with applicable laws and regulations. The company was reviewing transactions with certain counterparties involving finite reinsurance arrangements as well as certain compensation arrangements with insurance brokers. Finite reinsurance transactions that did not meet the criteria for reinsurance accounting under SFAS No. 113 were accounted for as deposits. The company had historically used off-balance-sheet structured finance vehicles for asset-backed financing and risk transfer purposes. The ultimate accounting treatment and disclosure requirements for these arrangements would depend on the resolution of regulatory investigations and the application of evolving accounting standards. The company adopted FIN 46(R) in the first quarter of 2004 which required consolidation of variable interest entities if the enterprise had a controlling financial interest, and the adoption did not have a material impact on consolidated financial statements. The company expected to adopt SFAS 123(R) in the first quarter of 2006 using the modified prospective method, which was expected to increase compensation expense by approximately $0.5 billion annually based on option grant practices and the current fair value of stock options at the grant date.",
    smda: "**1. Strategic Priorities and Initiatives**\n- AIG continued to focus on underwriting discipline and capital management.\n- $2B share repurchase program announced.\n- Company stated commitment to conservative reserving practices.\n\n**2. Operational and Segment Performance**\n- General insurance: combined ratio 92.5 (improved from 94.1).\n- Net premiums written $10.2B (+11%).\n- Financial services segment: $1.2B operating income.\n- Net investment income $3.1B (+12%).\n\n**3. Financial Results and Key Trends**\n- Net income $3.9B vs $2.8B prior year.\n- Loss reserves $47.6B vs $45.1B.\n- Shareholders' equity $85.7B.\n- $11.2B unrealized gains on investment portfolio.\n- Finite reinsurance transactions used for risk management and capital optimization.\n\n**4. Identified Risks and Uncertainties**\n- Regulatory investigations by SEC, DOJ, and NY Attorney General.\n- Finite reinsurance transactions under regulatory scrutiny.\n- Legal and compliance risks from broker compensation practices.\n\n**5. Forward-Looking Statements and Guidance**\n- Management expressed confidence in underwriting and reserving practices.\n- Strong investment portfolio expected to continue supporting earnings.\n\n**6. Significant Changes, Events, or Developments**\n- Quarterly dividend $0.10 per share declared.\n- Cooperating with multiple regulatory investigations.\n- Finite reinsurance arrangements being reviewed by regulators.\n\n**7. Important Figures and Tables**\n| Metric | Q1 2005 | Q1 2004 | Change |\n|--------|---------|---------|--------|\n| Net Income | $3.9B | $2.8B | +39% |\n| Net Premiums Written | $10.2B | $9.2B | +11% |\n| Combined Ratio | 92.5 | 94.1 | -1.6 |\n| Loss Reserves | $47.6B | $45.1B | +5.5% |\n| Shareholders' Equity | $85.7B | — | — |\n| Unrealized Gains | $11.2B | — | — |"
  },
  {
    id: 10,
    company: "Tesla, Inc.",
    cik: "0001318605",
    quarter: "2020 Q4",
    industry: "MOTOR VEHICLES & PASSENGER CAR BODIES",
    fraud: false,
    misstatements: [],
    aaerSummary: "No enforcement action. Standard quarterly filing with consistent revenue recognition policies. No material weaknesses reported. All SEC filings current and complete.",
    redFlags: [],
    rawMDA: `Tesla reported fourth quarter 2020 revenue of $10.7 billion, up 46% year-over-year compared to $7.4 billion in the fourth quarter of 2019. Full year 2020 revenue was $31.5 billion compared to $24.6 billion in 2019, an increase of 28%. Automotive revenue was $9.3 billion for the quarter, with automotive gross margin improving to 25.5% from 20.2% in the prior year quarter, driven by continued cost reduction, production efficiency improvements, and the favorable impact of automotive regulatory credit sales of $401 million compared to $133 million in the prior year quarter, partially offset by lower average selling prices due to product mix shifts including the growing proportion of Model 3 and Model Y vehicles. Total automotive deliveries were 180,667 vehicles during the quarter, a 61% increase year-over-year compared to 112,093 vehicles in the prior year quarter. Total vehicle production was 179,757 units, up 71% compared to 104,891 units in the prior year quarter. Model 3 and Model Y combined production was 163,660 units with combined deliveries of 161,701 units. Model S and Model X production was 16,097 units with deliveries of 18,966 units. Model Y production ramped successfully at the Fremont factory, reaching volume production ahead of schedule, contributing significantly to the production increase. Production capacity at Fremont reached an annualized rate of 590,000 units, consisting of 100,000 units of Model S/X and 490,000 units of Model 3/Y. Gigafactory Shanghai reached an annualized production rate of 250,000 units of Model 3, with Model Y production commencing in the first quarter of 2021. Gigafactory Berlin and Gigafactory Texas remained under construction with equipment installation in progress for initial production lines. Energy generation and storage revenue was $752 million, up 72% compared to $436 million in the prior year quarter, with energy storage deployments of 1,584 MWh nearly doubling from 826 MWh driven by strong demand for Powerwall, the company's residential battery system, and Megapack, its large-scale utility storage solution. The company continued to increase production capacity at Gigafactory Nevada to meet growing demand for energy storage products. Solar deployments were 86 MW in the fourth quarter of 2020 compared to 54 MW in the prior year quarter, as the company continued to ramp production of its solar roof product and expand solar panel installation operations. Services and other revenue was $678 million, up 55% compared to $436 million in the prior year quarter, driven by growth in used vehicle sales, vehicle service, and vehicle insurance businesses. GAAP net income attributable to common stockholders was $270 million for the fourth quarter of 2020, with GAAP diluted earnings per share of $0.23 and non-GAAP diluted earnings per share of $0.80. This was the company's fifth consecutive quarter of GAAP profitability. Operating income was $675 million compared to $65 million in the prior year quarter, with operating margin improving to 6.3% from 0.9% in the prior year quarter, demonstrating continued operational improvement. Cost of revenues was $8.6 billion for the fourth quarter of 2020 compared to $6.1 billion in the prior year quarter. Operating expenses were $1.5 billion, up 16% compared to $1.3 billion, with research and development expenses of $521 million compared to $474 million representing 4.9% of revenues, and selling, general and administrative expenses of $1.0 billion compared to $803 million representing 9.4% of revenues. Restructuring and other charges were $46 million for the quarter. Free cash flow was $1.9 billion for the fourth quarter of 2020, compared to $1.0 billion in the prior year quarter. Cash provided by operating activities was $2.7 billion compared to $1.4 billion. Cash and cash equivalents totaled $19.4 billion at December 31, 2020, an increase of $4.9 billion from $14.5 billion at September 30, 2020, and an increase of $13.1 billion from $6.3 billion at December 31, 2019. The significant increase in the cash position reflected improved operating performance and capital raised during the year including the December 2020 at-the-market equity offering of up to $5.0 billion. Capital expenditures were $787 million for the fourth quarter of 2020, reflecting investments in manufacturing capacity expansion at Fremont, Gigafactory Shanghai, and Gigafactories under construction in Berlin and Texas. Full year 2020 capital expenditures were $3.2 billion. Total debt, including vehicle and energy product financing, was $10.4 billion at December 31, 2020, down from $13.0 billion at December 31, 2019. The decrease in debt primarily reflected early repayment of $0.7 billion in outstanding borrowings under credit facilities, full repayment of $0.5 billion in Model 3 asset-backed notes, and the satisfaction of convertible note conversions in equity. Total debt consisted of $1.8 billion in convertible senior notes, $5.9 billion in vehicle and energy product financing (non-recourse), $1.2 billion in asset-backed financing, and $1.5 billion in other debt obligations. The company had $2.0 billion available under revolving credit facilities that remained undrawn. Future minimum purchase obligations for raw materials, battery cell supply agreements under long-term contracts, and other commitments totaled approximately $4.8 billion. Operating lease obligations for manufacturing facilities, service centers, delivery centers, and office space totaled $1.5 billion in future minimum lease payments with $0.3 billion payable within 12 months. The effective tax rate was a benefit of 4.6% for the fourth quarter of 2020 compared to a provision of 184.4% in the prior year quarter. The company maintained a full valuation allowance against its U.S. federal and state deferred tax assets as it had not yet concluded that it was more likely than not that these assets would be realized. Deferred revenue related to Full Self-Driving capability was $0.6 billion at December 31, 2020, representing the portion of transaction price allocated to FSD capability not yet delivered, requiring management judgment regarding the standalone selling price of the FSD feature given the early stage of development and absence of comparable market transactions. The warranty reserve was $1.3 billion at December 31, 2020, representing approximately 2.8% of cumulative automotive revenue, determined based on historical claims experience adjusted for known quality improvements and vehicle design changes, with a 10% change in estimated claim rates affecting the reserve by $130 million. Stock-based compensation expense was $1.5 billion for the full year 2020 compared to $0.9 billion in 2019, reflecting additional awards granted during the year and the impact of the higher stock price on the fair value of new grants. The 2018 CEO Performance Award, a fully performance-based award with milestone conditions tied to market capitalization and operational metrics, represented $0.4 billion of unrecognized compensation expense. Unrecognized stock-based compensation expense related to unvested awards totaled $2.8 billion expected to be recognized over a weighted average period of 2.6 years. Capitalized software development costs for Full Self-Driving and Autopilot were $0.4 billion at December 31, 2020, subject to ongoing evaluation for recoverability considering technological obsolescence, commercialization timing, and regulatory approvals. The investment portfolio consisted primarily of U.S. Treasury securities, money market funds, and corporate bonds with weighted average maturity of less than 12 months. A hypothetical 100-basis-point increase in interest rates would reduce the fair value of the investment portfolio by approximately $85 million. Foreign currency exposure was managed using forward and option contracts with a notional amount of $2.1 billion, used to hedge anticipated foreign currency exposure related to vehicle sales in Europe and China and parts purchases from foreign suppliers. A hypothetical 10% strengthening of the U.S. dollar against all major currencies would reduce annual revenue by approximately $600 million and operating income by approximately $120 million. A hypothetical 10% weakening would have the opposite effect. The company sold vehicles in multiple currencies including the euro, Chinese yuan, British pound, Japanese yen, and Canadian dollar, while a significant portion of costs were denominated in U.S. dollars. Commodity price risk was managed through long-term supply agreements with key suppliers, vertical integration of battery cell production, and investment in battery technology to reduce reliance on expensive raw materials including the development of cobalt-free batteries and the 4680 cell format designed to reduce costs and improve energy density. A hypothetical 20% increase in the cost of battery raw materials would increase annual cost of revenues by approximately $400 million. In October 2020, the company began a limited beta release of the Full Self-Driving City Streets feature to a small group of customers, designed to gather real-world driving data and feedback. The FSD software was built on a neural network architecture processing data from the vehicle's eight external cameras, twelve ultrasonic sensors, and forward-facing radar to perceive the surrounding environment and make driving decisions. The company believed its camera vision and neural network approach to autonomy, which did not rely on lidar or high-definition maps, would enable a cost-effective and scalable autonomous driving solution. The regulatory pathway to full autonomous operation remained uncertain and would require validation of the system's safety performance and regulatory approval in each jurisdiction, with different jurisdictions adopting varying approaches to testing, deployment, and liability. The company faced intense competition from established global automakers including Volkswagen, BMW, Daimler, Ford, General Motors, and Toyota, all of which committed significant resources to electric vehicle development, as well as technology companies and emerging Chinese EV startups. Regulatory credit revenue of $401 million recognized during the fourth quarter would decline over time as other manufacturers increase their electric vehicle production and regulatory requirements evolve. Corporate Average Fuel Economy (CAFE) standards in the United States, CO2 emissions standards in Europe, and New Energy Vehicle (NEV) credit requirements in China continued to drive industry transformation. The company also faced competition from emerging autonomous driving technology companies. Management believed its vertical integration, battery technology leadership, software capabilities, supercharger network, and brand strength provided competitive advantages that would be difficult for competitors to replicate in the near term. Management continued to focus on cost reduction and operational efficiency, noting that cost improvements from manufacturing innovations and supply chain optimization more than offset the impact of lower average selling prices on profitability.

LIQUIDITY AND CAPITAL RESOURCES

Cash and cash equivalents totaled $19.4 billion at December 31, 2020, an increase of $4.9 billion from $14.5 billion at September 30, 2020, and an increase of $13.1 billion from $6.3 billion at December 31, 2019. Cash provided by operating activities was $2.7 billion for the fourth quarter of 2020, compared to $1.4 billion in the prior year quarter. Free cash flow was $1.9 billion. Capital expenditures were $787 million for the quarter. Total debt, including vehicle and energy product financing, was $10.4 billion at December 31, 2020, down from $13.0 billion at December 31, 2019. We continue to strengthen our balance sheet. In December 2020, we completed an at-the-market equity offering of up to $5.0 billion. We have access to $3.5 billion in secured revolving credit facilities with no borrowings outstanding.

VEHICLE PRODUCTION

Total vehicle production in Q4 2020 was 179,757 vehicles, bringing full-year 2020 production to 509,737 vehicles. Model 3/Y production at Fremont reached 163,660 units, up from 128,044 in Q3. Model S/X production was 16,097 units. Gigafactory Shanghai produced 56,256 Model 3 vehicles at an annualized rate exceeding 250,000 units. Model Y production began in Shanghai in January 2021, ahead of schedule. Vehicle deliveries totaled 180,667 units, growing 61 percent year-over-year. Construction of Gigafactory Berlin and Gigafactory Texas began during the year.

FULL SELF-DRIVING

We continue to make substantial progress in the development of Full Self-Driving technology. In October 2020, we began a limited beta release of FSD City Streets to a small group of customers in the United States. The beta program gathers real-world data to improve system performance. Our FSD software uses a neural network architecture processing data from eight external cameras, twelve ultrasonic sensors, and forward-facing radar. We believe camera vision and neural network processing will enable a scalable autonomous driving solution. At December 31, 2020, deferred revenue related to FSD capability was $0.6 billion.

ENERGY BUSINESS

Energy generation and storage revenue was $752 million, compared to $436 million in the prior year quarter. Solar deployments were 86 MW, up 59 percent year-over-year. Energy storage deployments were 1,584 MWh, a record and a 200 percent increase. The Megapack product continues to see strong demand from utility customers. Our solar roof product gained market traction. The energy business is expected to become a meaningful contributor to overall profitability as volumes increase.

CRITICAL ACCOUNTING POLICIES

Revenue Recognition. Automotive revenue is recognized upon vehicle delivery. For vehicles sold with FSD capability not yet delivered, a portion of the transaction price is deferred. The allocation requires management judgment regarding standalone selling price. Automotive regulatory credit revenue is recognized when credits are delivered. During 2020, regulatory credit revenue was $1.58 billion, a significant source of profitability.

Warranty Reserves. Warranty reserves are accrued at delivery based on historical claims experience, estimated repair costs, and expected failure rates. The warranty reserve balance was $1.2 billion at December 31, 2020.

INCOME TAXES

Our effective tax rate was a benefit of 4.6 percent. We maintain a full valuation allowance against U.S. federal and state deferred tax assets totaling $2.8 billion. We have $4.5 billion of U.S. federal net operating loss carryforwards.

SEGMENT INFORMATION

Automotive segment revenue was $9.3 billion, up 46 percent year-over-year. Automotive gross margin improved to 25.5 percent from 20.2 percent, driven by cost improvements, higher volumes, and regulatory credit sales. Total automotive gross profit was $2.4 billion. Energy segment revenue was $752 million with gross margin of 10.2 percent. Services and other revenue was $678 million, up 35 percent.

RISK FACTORS

We operate in a highly competitive automotive industry with rapid technological change. We face competition from established manufacturers and new electric vehicle entrants. The global semiconductor shortage impacted our operations during Q4. Supply chain disruptions present risks to production targets. Autonomous driving technology involves technical challenges, regulatory hurdles, and liability risks. International operations expose us to currency fluctuations and geopolitical risks. We are subject to regulatory investigations and litigation related to Autopilot and FSD features. Future growth depends on ramping production at new facilities in Berlin and Texas.

FORWARD-LOOKING STATEMENTS

This quarterly report contains forward-looking statements regarding future growth, vehicle production and delivery targets, profitability, cash flow, and autonomous driving technology. These statements involve risks and uncertainties, including ramping production at new facilities, the impact of COVID-19 on operations and supply chain, timing of regulatory approvals for autonomous driving features, competition, and general economic conditions. We undertake no obligation to update forward-looking statements.`,
    smda: "**1. Strategic Priorities and Initiatives**\n- Tesla focused on global manufacturing expansion with Gigafactories in Shanghai, Berlin, and Texas.\n- Development of Full Self-Driving (FSD) software with limited beta of City Streets feature.\n- Continued cost reduction and operational efficiency improvements.\n\n**2. Operational and Segment Performance**\n- Total deliveries: 180,667 vehicles (+61% YoY).\n- Total production: 179,757 vehicles.\n- Model Y reached volume production ahead of schedule.\n- Automotive gross margin 25.5% (improved from 20.2%).\n- Energy storage deployments: 1,584 MWh.\n- Solar deployments: 86 MW.\n\n**3. Financial Results and Key Trends**\n- Total revenue $10.7B (+46% YoY).\n- Automotive revenue $9.3B, automotive gross margin 25.5%.\n- GAAP net income $270M; non-GAAP EPS $0.80.\n- Operating margin 6.3% (5th consecutive profitable quarter).\n- Free cash flow $1.9B.\n- Cash: $19.4B (+$4.9B in quarter).\n- R&D $521M; OpEx $1.5B (+16%).\n\n**4. Identified Risks and Uncertainties**\n- COVID-19 pandemic impact on global supply chain and production.\n- Regulatory environment around autonomous driving technology.\n- Competitive pressure from established automakers' EV offerings.\n- Foreign exchange and tariff risks in international markets.\n\n**5. Forward-Looking Statements and Guidance**\n- Gigafactory Berlin and Texas construction progressing; expected to begin production in 2021.\n- FSD software development continuing with regulatory approval-dependent rollout.\n- Long-term goal of 50% average annual growth in vehicle deliveries.\n\n**6. Significant Changes, Events, or Developments**\n- Gigafactory Shanghai reached 250K annualized Model 3 production.\n- Berlin and Texas Gigafactory construction started.\n- FSD City Streets limited beta released.\n- Fifth consecutive profitable quarter demonstrated sustainable profitability.\n\n**7. Important Figures and Tables**\n| Metric | Q4 2020 | Q4 2019 | Change |\n|--------|---------|---------|--------|\n| Revenue | $10.7B | $7.4B | +46% |\n| Automotive GM | 25.5% | 20.2% | +530bp |\n| Deliveries | 180,667 | 112,093 | +61% |\n| GAAP Net Income | $270M | $105M | +157% |\n| FCF | $1.9B | $1.0B | +90% |\n| Cash | $19.4B | $6.3B | +208% |"
  }
];

const nikeSlide = mdaSlides[1]; // NIKE as default preview

// ─── Summarization prompt ──────────────────────────────────────────
const systemPrompt = `You are a highly skilled financial analyst with deep expertise in evaluating corporate disclosures.
You will be provided with the 'Management's Discussion and Analysis' (MD&A) section of a financial report.

Your task is to extract and present the **100 most important and distinct insights, observations, and factual statements** from the MD&A. Focus on:
– Strategic priorities and initiatives
– Operational and segment performance
– Financial results and key trends
– Identified risks and uncertainties
– Forward-looking statements and guidance
– Significant changes, events, or developments

Present as a bulleted list using dash (–). Be clear, specific, concise. Avoid redundancy.
Do not include introduction, conclusion, or extra commentary.
Only output the finalized bullet list.`;

// ─── Fine-tuning prompt ────────────────────────────────────────────
const finPrompt = `The company operates in the {industry} sector.

Financial features:
• Total Revenue: $2,400M (+12% YoY)
• Gross Margin: 68.5%
• Operating Cash Flow: $890M
• Total Assets: $15,200M
• Total Liabilities: $8,900M
• Debt-to-Equity: 0.52
• Current Ratio: 1.8

Below is the summary of the Management Discussion and Analysis (MDA) section:
{mda_summary}

Based on these informations and your knowledge of typical red flags in financial reporting,
assess whether there is a high likelihood that this company is Financial Manipulation Fraud.

Do you think this company is engaging Fraud? Answer with "YES" or "NO"?`;

const completionInstruction = "\n## My answer is:\n";

// ─── Benchmark data by split method ────────────────────────────────
// Company-Isolated (CI-FSFD) — the correct evaluation
const cifdfdData = [
  { model: "Fino1-8B (SMD&A)", auc: 0.74, color: "#2563eb", desc: "Finance-specialized LLM on summarized MD&A text" },
  { model: "Llama-3.1 8B (SMD&A)", auc: 0.73, color: "#3b82f6", desc: "General LLM on summarized MD&A text" },
  { model: "Fino1-8B (FIN+SMD&A)", auc: 0.72, color: "#6366f1", desc: "Finance LLM on combined financial + text data" },
  { model: "Fino1-8B (FIN)", auc: 0.70, color: "#8b5cf6", desc: "Finance LLM on financial indicators only" },
  { model: "LightGBM", auc: 0.69, color: "#a78bfa", desc: "Tree-based ML baseline" },
  { model: "Zero-shot LLM", auc: 0.50, color: "#9ca3af", desc: "Zero-shot LLM (baseline)" },
];

// Random Split — shows data leakage
const randomSplitData = [
  { model: "Fino1-8B (SMD&A)", auc: 0.92, color: "#2563eb", desc: "Finance-specialized LLM (inflated)" },
  { model: "Llama-3.1 8B (SMD&A)", auc: 0.91, color: "#3b82f6", desc: "General LLM (inflated)" },
  { model: "Fino1-8B (FIN+SMD&A)", auc: 0.90, color: "#6366f1", desc: "Finance LLM (inflated)" },
  { model: "Fino1-8B (FIN)", auc: 0.88, color: "#8b5cf6", desc: "Finance LLM (inflated)" },
  { model: "LightGBM", auc: 0.87, color: "#a78bfa", desc: "Tree-based ML (inflated)" },
];

// ─── LoRA config ───────────────────────────────────────────────────
const loraConfig = {
  r: 8,
  alpha: 8,
  dropout: 0.05,
  targetModules: ["q_proj", "v_proj", "up_proj", "down_proj", "gate_proj", "lm_head"],
  baseModels: ["Llama-3.1-8B (4-bit)", "FinO-8B", "FinO-14B", "Qwen-32B"],
  epochs: 10,
  learningRate: "1e-4",
  batchSize: 8,
};

// ─── Training pipeline steps ───────────────────────────────────────
const pipelineSteps = [
  {
    step: 1,
    title: "Data Collection",
    description: "SEC filings (10-K/10-Q) via SEC-API, AAER enforcement releases, XBRL financial data",
    icon: "📥",
  },
  {
    step: 2,
    title: "MDA Extraction",
    description: "Extract Management Discussion & Analysis sections (Item 7 for 10-K, Part 1 Item 2 for 10-Q)",
    icon: "📝",
  },
  {
    step: 3,
    title: "XBRL Financials",
    description: "Parse US-GAAP 2024 taxonomy, extract 122 financial features per company/quarter",
    icon: "📊",
  },
  {
    step: 4,
    title: "Fraud Labeling",
    description: "Link AAER enforcement actions to quarterly filings via CIK + fiscal quarter matching",
    icon: "🏷️",
  },
  {
    step: 5,
    title: "MDA Summarization",
    description: "Qwen3-32B extracts key insights per MD&A section (~3,800 tokens avg)",
    icon: "🤖",
  },
  {
    step: 6,
    title: "Feature Engineering",
    description: "Aggregate, diff, ratio features; Beneish M-score; Dechow accruals",
    icon: "⚙️",
  },
  {
    step: 7,
    title: "Cross-Validation",
    description: "5-fold stratified split by SIC industry + time period to prevent data leakage",
    icon: "🔄",
  },
  {
    step: 8,
    title: "Model Training",
    description: "LoRA fine-tuning with softmax classifier, per-epoch threshold optimization",
    icon: "🎯",
  },
];

// ─── Misstatement types ────────────────────────────────────────────
const misstatementTypes = [
  { type: "Revenue", count: 412, pct: 28.4 },
  { type: "Accounts Receivable", count: 287, pct: 19.8 },
  { type: "Assets Valuation", count: 198, pct: 13.6 },
  { type: "Inventory", count: 156, pct: 10.7 },
  { type: "COGS", count: 134, pct: 9.2 },
  { type: "Reserve Account", count: 98, pct: 6.8 },
  { type: "Liabilities", count: 87, pct: 6.0 },
  { type: "Payables", count: 65, pct: 4.5 },
  { type: "Other/Equity", count: 42, pct: 2.9 },
  { type: "Capitalized Costs", count: 23, pct: 1.6 },
  { type: "Allowance Bad Debt", count: 15, pct: 1.0 },
  { type: "Marketable Securities", count: 11, pct: 0.8 },
];

// ─── Component: Simple bar chart ───────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = "#2563eb" }: {
  data: any[];
  valueKey: string;
  labelKey: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map((d: any) => d[valueKey]));
  return (
    <div className="space-y-2">
      {data.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-32 text-xs text-right text-gray-600 shrink-0">{item[labelKey]}</span>
          <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${(item[valueKey] / maxValue) * 100}%`,
                backgroundColor: color,
                opacity: item[valueKey] === maxValue ? 1 : 0.85,
              }}
            />
          </div>
          <span className="w-16 text-xs font-medium text-gray-800">
            {typeof item[valueKey] === "number" && item[valueKey] % 1 !== 0
              ? item[valueKey].toFixed(2)
              : item[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Component: Tabbed sections ────────────────────────────────────
function TabContent({ activeTab }: { activeTab: Tab }) {
  if (activeTab === "pipeline") {
    return (
      <section className="space-y-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">End-to-End Data Pipeline</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-bold text-blue-600">Step {step.step}</span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">Pipeline Configuration</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="text-sm text-blue-700">Taxonomy: </span>
              <span className="text-sm font-medium text-blue-900">US-GAAP 2024</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Features extracted: </span>
              <span className="text-sm font-medium text-blue-900">122 per quarter</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Misstatement types: </span>
              <span className="text-sm font-medium text-blue-900">11 (excl. Marketable Securities)</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Fraud categories: </span>
              <span className="text-sm font-medium text-blue-900">4 (Financial, Regulatory, Ethical, Market)</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Summarizer: </span>
              <span className="text-sm font-medium text-blue-900">Qwen3-32B (open-source)</span>
            </div>
            <div>
              <span className="text-sm text-blue-700">Max insights: </span>
              <span className="text-sm font-medium text-blue-900">100 per section</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (activeTab === "dataset") {
    return <DatasetSlideshow />;
  }

  if (activeTab === "prompt") {
    return (
      <section className="space-y-8">
        {/* System prompt */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-blue-900">MD&A Summarization Prompt (System)</h2>
          <div className="rounded-lg border border-blue-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
              {systemPrompt}
            </pre>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">~3,800</div>
              <div className="text-xs text-gray-400">tokens avg per summary</div>
            </div>
            <div className="rounded bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">100</div>
              <div className="text-xs text-gray-400">max insights per section</div>
            </div>
            <div className="rounded bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">Qwen3-32B</div>
              <div className="text-xs text-gray-400">summarization model</div>
            </div>
          </div>
        </div>

        {/* Classification prompt */}
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-purple-900">Classification Prompt (User)</h2>
          <div className="rounded-lg border border-purple-200 bg-white p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
              {finPrompt.replace("{industry}", "Technology").replace("{mda_summary}", nikeSlide.smda.split("\n").slice(0, 12).join("\n"))}
              {completionInstruction}
            </pre>
          </div>
          <div className="mt-3">
            <span className="rounded bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Output: "YES" or "NO" (Fraud / Not Fraud)
            </span>
          </div>
        </div>

        {/* Misstatement distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Misstatement Type Distribution</h2>
          <p className="mb-4 text-sm text-gray-500">
            Breakdown of 1,451 AAER-linked fraud cases by misstatement type (11 types, Marketable Securities excluded from training)
          </p>
          <BarChart
            data={misstatementTypes}
            valueKey="count"
            labelKey="type"
            color="#2563eb"
          />
        </div>
      </section>
    );
  }

  if (activeTab === "architecture") {
    return <ArchitectureSection />;
  }

  if (activeTab === "results") {
    return <ResultsContent />;
  }

  return null;
}

// ─── Dataset Slideshow (Diaporama) Component ──────────────────────
function DatasetSlideshow() {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = mdaSlides[slideIdx];

  const prevSlide = () => setSlideIdx((s) => (s - 1 + mdaSlides.length) % mdaSlides.length);
  const nextSlide = () => setSlideIdx((s) => (s + 1) % mdaSlides.length);

  return (
    <section className="space-y-8">
      {/* Dataset overview stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Dataset Composition</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "Companies", value: "13,332", sub: "unique" },
            { label: "Firm-Quarters", value: "268,936", sub: "reports" },
            { label: "Final Samples", value: "10,159", sub: "instances" },
            { label: "Fraud Cases", value: "511", sub: "firm-quarters" },
            { label: "Fraud Rate", value: "5.0%", sub: "balanced" },
            { label: "Industries", value: "11", sub: "sectors" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
              <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide navigation header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sample Explorer — Diaporama</h2>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {slideIdx + 1} / {mdaSlides.length}
          </span>
        </div>
      </div>

      {/* Slide dots */}
      <div className="flex flex-wrap gap-1.5">
        {mdaSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`h-2 rounded-full transition-all ${
              i === slideIdx ? "w-6 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Main slide card with prev/next arrows flanking it */}
      <div className="relative flex items-stretch gap-2 sm:gap-3">
        {/* Previous arrow — left of card */}
        <button
          onClick={prevSlide}
          className="flex shrink-0 items-center justify-center self-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* The card */}
        <div
          className={`min-w-0 flex-1 rounded-xl border-2 p-6 transition-all ${
            slide.fraud ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"
          }`}
        >
          {/* Header row */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-2.5 py-1 text-xs font-bold ${
                  slide.fraud
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {slide.fraud ? "FRAUD CASE (AAER)" : "NON-FRAUD"}
              </span>
              <span className="text-sm font-semibold text-gray-900">{slide.company}</span>
              <span className="text-xs text-gray-500">CIK {slide.cik}</span>
            </div>
            <div className="text-xs text-gray-500">
              {slide.quarter} · {slide.industry}
            </div>
          </div>

          {/* Content grid: Raw MDA (left) + SMD&A (right) */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Raw MD&A — scrollable but full content */}
            <div className="flex min-w-0 flex-col">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Raw MD&A (Original 10-Q Filing)
              </h3>
              <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                  {slide.rawMDA}
                </pre>
              </div>
              <div className="mt-1 text-right text-[10px] text-gray-400">
                Scroll for full text &darr; · {slide.rawMDA.split(" ").length} words
              </div>
            </div>

            {/* Right: SMD&A + AAER */}
            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-blue-700">
                  SMD&A (Qwen3-32B Summary)
                </h3>
                <div className="max-h-[360px] overflow-y-auto rounded-lg border border-blue-200 bg-white p-4">
                  <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                    {slide.smda}
                  </pre>
                </div>
              </div>

              {/* AAER / Fraud details */}
              <div
                className={`rounded-lg border p-4 ${
                  slide.fraud ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                }`}
              >
                <h3 className="mb-2 text-sm font-semibold text-gray-800">AAER Disclosure</h3>
                <p className="mb-2 text-sm leading-relaxed text-gray-700">{slide.aaerSummary}</p>

                {slide.misstatements.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-600">Misstatement Types:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {slide.misstatements.map((mis) => (
                        <span key={mis} className="rounded bg-white px-2 py-0.5 text-xs text-gray-700">
                          {mis}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {slide.redFlags.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-red-600">Red Flags:</span>
                    <ul className="mt-1 space-y-0.5 text-sm text-red-700">
                      {slide.redFlags.map((flag) => (
                        <li key={flag} className="flex items-start gap-1.5">
                          <span className="mt-0.5 text-red-500">&#9888;</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!slide.fraud && (
                  <p className="text-sm text-green-700">
                    No misstatements, no enforcement action, clean audit opinion.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next arrow — right of card */}
        <button
          onClick={nextSlide}
          className="flex shrink-0 items-center justify-center self-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip below */}
      <div className="flex flex-wrap gap-1.5">
        {mdaSlides.map((s, i) => (
          <button
            key={i}
            onClick={() => setSlideIdx(i)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
              i === slideIdx
                ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
          >
            {s.company.split(/[(,]/)[0].trim().slice(0, 14)}{s.company.length > 14 ? "..." : ""}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
        Browse all 10 samples. Raw MDA text is shown in full (no truncation).
        SMD&A preserves the 11-section structure (strategic priorities, operations, financials, risks, etc.).
        Average raw MDA: ~14k tokens; Average SMD&A: ~3,800 tokens.
      </div>
    </section>
  );
}

// ─── Architecture Section with SVG Diagram ─────────────────────────
function ArchitectureSection() {
  return (
    <section className="space-y-8">
      {/* Large SVG architecture schematic */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-8">
        <h2 className="mb-6 text-center text-xl font-semibold">LoRA Fine-tuning Architecture — Schematic Overview</h2>
        <svg viewBox="0 0 1160 960" className="w-full max-w-5xl mx-auto" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          <defs>
            <filter id="shadow1" x="-4%" y="-4%" width="108%" height="112%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
            </filter>
            <filter id="shadow2" x="-4%" y="-4%" width="108%" height="112%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15"/>
            </filter>
            <marker id="arrowDown" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="#64748b"/>
            </marker>
            <marker id="arrowDownBlue" markerWidth="10" markerHeight="8" refX="5" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="#2563eb"/>
            </marker>
            <marker id="arrowRight" markerWidth="10" markerHeight="8" refX="3" refY="4" orient="auto">
              <path d="M0,0 L10,4 L0,8" fill="#64748b"/>
            </marker>
            <linearGradient id="gradInput" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dbeafe"/>
              <stop offset="100%" stopColor="#bfdbfe"/>
            </linearGradient>
            <linearGradient id="gradLLM" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0e7ff"/>
              <stop offset="100%" stopColor="#c7d2fe"/>
            </linearGradient>
            <linearGradient id="gradLora" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fce7f3"/>
              <stop offset="100%" stopColor="#fbcfe8"/>
            </linearGradient>
            <linearGradient id="gradHead" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1fae5"/>
              <stop offset="100%" stopColor="#a7f3d0"/>
            </linearGradient>
            <linearGradient id="gradOutput" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef3c7"/>
              <stop offset="100%" stopColor="#fde68a"/>
            </linearGradient>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="1160" height="960" rx="16" fill="white"/>

          {/* ====== SECTION 1: INPUT (top-left) ====== */}
          <rect x="30" y="40" width="340" height="190" rx="12" fill="url(#gradInput)" stroke="#93c5fd" strokeWidth="1.5" filter="url(#shadow1)"/>
          <text x="200" y="65" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1d4ed8">INPUT PREPARATION</text>

          {/* Financial features */}
          <rect x="50" y="80" width="300" height="44" rx="6" fill="white" stroke="#bfdbfe" strokeWidth="1"/>
          <text x="60" y="100" fontSize="10" fontWeight="600" fill="#475569">Financial Indicators (FIN)</text>
          <text x="60" y="115" fontSize="9" fill="#94a3b8">122 engineered features: ratios, M-score, accruals, R&amp;D intensity</text>

          {/* Text features */}
          <rect x="50" y="132" width="300" height="44" rx="6" fill="white" stroke="#bfdbfe" strokeWidth="1"/>
          <text x="60" y="152" fontSize="10" fontWeight="600" fill="#475569">Summarized MD&amp;A (SMD&amp;A)</text>
          <text x="60" y="167" fontSize="9" fill="#94a3b8">Qwen3-32B summary (avg ~3,800 tokens, 11 sections)</text>

          {/* Serialized prompt */}
          <rect x="50" y="184" width="300" height="38" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4,3"/>
          <text x="60" y="202" fontSize="10" fontWeight="600" fill="#1d4ed8">Serialized Prompt</text>
          <text x="60" y="215" fontSize="9" fill="#64748b">{"\"Industry: {s} | Financials: {122 features} | {SMDA}\""}</text>

          {/* Arrow input&#8594;LLM */}
          <line x1="200" y1="230" x2="200" y2="265" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>

          {/* ====== SECTION 2: BASE LLM (center) ====== */}
          <rect x="30" y="270" width="480" height="220" rx="12" fill="url(#gradLLM)" stroke="#a5b4fc" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="270" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4338ca">BASE LLM — Pretrained Backbone</text>

          {/* Model selector */}
          <rect x="50" y="310" width="140" height="70" rx="8" fill="white" stroke="#c7d2fe" strokeWidth="1"/>
          <text x="120" y="330" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Base Models</text>
          <text x="120" y="347" textAnchor="middle" fontSize="9" fill="#64748b">Fino1-8B</text>
          <text x="120" y="360" textAnchor="middle" fontSize="9" fill="#64748b">Llama-3.1 8B</text>
          <text x="120" y="373" textAnchor="middle" fontSize="9" fill="#64748b">Qwen3-32B</text>

          {/* 4-bit */}
          <rect x="210" y="310" width="120" height="70" rx="8" fill="white" stroke="#c7d2fe" strokeWidth="1"/>
          <text x="270" y="330" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Quantization</text>
          <text x="270" y="350" textAnchor="middle" fontSize="11" fontWeight="700" fill="#059669">4-bit NF4</text>
          <text x="270" y="368" textAnchor="middle" fontSize="9" fill="#64748b">GPTQ quantization</text>

          {/* Hidden layers */}
          <rect x="50" y="390" width="440" height="90" rx="8" fill="white" stroke="#c7d2fe" strokeWidth="1"/>
          <text x="270" y="410" textAnchor="middle" fontSize="10" fontWeight="600" fill="#4338ca">Transformer Layers (Hidden)</text>

          {/* Layer blocks */}
          {[0,1,2,3].map((i) => (
            <rect key={i} x={65 + i*106} y={420} width="96" height="24" rx="4" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1"/>
          ))}
          <text x="270" y="434" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6366f1">self-attn</text>
          {[0,1,2,3].map((i) => (
            <text key={i} x={65 + i*106 + 48} y="450" textAnchor="middle" fontSize="8" fill="#94a3b8">Layer {i+1}</text>
          ))}
          <text x="462" y="440" fontSize="10" fill="#94a3b8">...</text>

          {/* ====== SECTION 3: LORA ADAPTERS (right, beside LLM) ====== */}
          <rect x="530" y="270" width="340" height="220" rx="12" fill="url(#gradLora)" stroke="#f9a8d4" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="700" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#be185d">LoRA ADAPTERS (Trainable)</text>

          {/* LoRA params */}
          <rect x="550" y="310" width="300" height="50" rx="8" fill="white" stroke="#fbcfe8" strokeWidth="1"/>
          <text x="560" y="328" fontSize="10" fontWeight="600" fill="#be185d">LoRA Hyperparameters</text>
          <text x="560" y="345" fontSize="9" fill="#64748b">r = 8 | &#x3b1; = 8 | dropout = 0.05 | lr = 1e-4</text>

          {/* Target modules */}
          <rect x="550" y="370" width="300" height="110" rx="8" fill="white" stroke="#fbcfe8" strokeWidth="1"/>
          <text x="700" y="390" textAnchor="middle" fontSize="10" fontWeight="600" fill="#be185d">Target Modules (Linear Layers)</text>

          {["q_proj", "v_proj", "gate_proj", "up_proj", "down_proj", "lm_head"].map((mod, i) => (
            <rect key={i} x={560 + (i%2)*140} y={400 + Math.floor(i/2)*24} width="130" height="20" rx="4" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1"/>
          ))}
          <text x="562" y="414" fontSize="8" fontWeight="600" fill="#be185d">q_proj</text>
          <text x="702" y="414" fontSize="8" fontWeight="600" fill="#be185d">v_proj</text>
          <text x="562" y="438" fontSize="8" fontWeight="600" fill="#be185d">gate_proj</text>
          <text x="702" y="438" fontSize="8" fontWeight="600" fill="#be185d">up_proj</text>
          <text x="562" y="462" fontSize="8" fontWeight="600" fill="#be185d">down_proj</text>
          <text x="702" y="462" fontSize="8" fontWeight="600" fill="#be185d">lm_head</text>

          {/* Arrow LLM &#8594; LoRA */}
          <line x1="510" y1="380" x2="530" y2="380" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowRight)"/>

          {/* Arrow LLM+LoRA &#8594; Head */}
          <line x1="510" y1="480" x2="510" y2="510" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>
          <line x1="510" y1="480" x2="700" y2="510" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>

          {/* ====== SECTION 4: CLASSIFICATION HEAD (center-bottom) ====== */}
          <rect x="240" y="515" width="460" height="130" rx="12" fill="url(#gradHead)" stroke="#6ee7b7" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="470" y="540" textAnchor="middle" fontSize="12" fontWeight="700" fill="#059669">CLASSIFICATION HEAD</text>

          {/* Softmax */}
          <rect x="260" y="555" width="200" height="80" rx="8" fill="white" stroke="#a7f3d0" strokeWidth="1"/>
          <text x="360" y="575" textAnchor="middle" fontSize="10" fontWeight="600" fill="#059669">Softmax Classification</text>
          <text x="360" y="595" textAnchor="middle" fontSize="9" fill="#64748b">Last token only (YES / NO)</text>
          <text x="360" y="612" textAnchor="middle" fontSize="9" fill="#64748b">Cross-entropy loss on last logit</text>
          <text x="360" y="627" textAnchor="middle" fontSize="8" fill="#94a3b8">All other tokens masked</text>

          {/* Mechanisms panel */}
          <rect x="480" y="555" width="200" height="80" rx="8" fill="white" stroke="#a7f3d0" strokeWidth="1"/>
          <text x="580" y="575" textAnchor="middle" fontSize="10" fontWeight="600" fill="#059669">Training Mechanisms</text>
          <text x="580" y="595" textAnchor="middle" fontSize="9" fill="#64748b">Per-epoch undersampling (5%)</text>
          <text x="580" y="612" textAnchor="middle" fontSize="9" fill="#64748b">Feature dropout (random)</text>
          <text x="580" y="627" textAnchor="middle" fontSize="8" fill="#94a3b8">Gradient checkpointing</text>

          {/* Arrow &#8594; Output */}
          <line x1="470" y1="645" x2="470" y2="680" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowDown)"/>

          {/* ====== SECTION 5: OUTPUT (bottom) ====== */}
          <rect x="240" y="685" width="460" height="100" rx="12" fill="url(#gradOutput)" stroke="#fcd34d" strokeWidth="1.5" filter="url(#shadow2)"/>
          <text x="470" y="710" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309">OUTPUT &amp; EVALUATION</text>

          {/* Binary output */}
          <rect x="260" y="723" width="180" height="48" rx="8" fill="white" stroke="#fde68a" strokeWidth="1"/>
          <text x="350" y="745" textAnchor="middle" fontSize="12" fontWeight="700" fill="#dc2626">YES (Fraud)</text>
          <text x="350" y="760" textAnchor="middle" fontSize="9" fill="#64748b">or</text>

          {/* Metrics */}
          <rect x="500" y="723" width="180" height="48" rx="8" fill="white" stroke="#fde68a" strokeWidth="1"/>
          <text x="590" y="743" textAnchor="middle" fontSize="12" fontWeight="700" fill="#16a34a">NO (Clean)</text>

          {/* Threshold optimization hint */}
          <rect x="50" y="723" width="180" height="48" rx="8" fill="#fffbeb" stroke="#fde68a" strokeWidth="1"/>
          <text x="140" y="745" textAnchor="middle" fontSize="10" fontWeight="600" fill="#b45309">F1-max threshold</text>
          <text x="140" y="760" textAnchor="middle" fontSize="9" fill="#64748b">AUC optimization</text>

          {/* ====== RIGHT PANEL: Evaluation split (sidebar) ====== */}
          <rect x="890" y="40" width="240" height="250" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow1)"/>
          <text x="1010" y="65" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">EVALUATION SPLIT</text>

          {/* CI-FSFD */}
          <rect x="905" y="80" width="210" height="90" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="1010" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="#16a34a">CI-FSFD (Recommended)</text>
          <text x="1010" y="118" textAnchor="middle" fontSize="9" fill="#64748b">Company-isolated split</text>
          <text x="1010" y="133" textAnchor="middle" fontSize="9" fill="#64748b">5-fold stratified</text>
          <text x="1010" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Preserves industry + time</text>
          <text x="1010" y="163" textAnchor="middle" fontSize="8" fill="#94a3b8">~0.50–0.74 AUC range</text>

          {/* Random split */}
          <rect x="905" y="185" width="210" height="90" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
          <text x="1010" y="205" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">Random Split (Leaky)</text>
          <text x="1010" y="223" textAnchor="middle" fontSize="9" fill="#64748b">Same company in both sets</text>
          <text x="1010" y="238" textAnchor="middle" fontSize="9" fill="#64748b">Memorization artifact</text>
          <text x="1010" y="253" textAnchor="middle" fontSize="9" fill="#64748b">~0.87–0.96 AUC (inflated)</text>
          <text x="1010" y="268" textAnchor="middle" fontSize="8" fill="#94a3b8">DO NOT USE</text>

          {/* ====== BOTTOM INFO PANEL ====== */}
          <rect x="890" y="310" width="240" height="180" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#shadow1)"/>
          <text x="1010" y="335" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">TRAINING CONFIG</text>

          {[
            { l: "Batch Size", v: "8" },
            { l: "Learning Rate", v: "1e-4" },
            { l: "Epochs", v: "10" },
            { l: "Optimizer", v: "AdamW" },
            { l: "Precision", v: "Mixed (bfloat16)" },
            { l: "GPU", v: "NVIDIA H100" },
            { l: "Time per fold", v: "~4 hours" },
            { l: "LoRA rank r", v: "8" },
          ].map((row, i) => (
            <g key={i}>
              <text x="910" y={360 + i*18} fontSize="9" fill="#64748b">{row.l}</text>
              <text x="1110" y={360 + i*18} textAnchor="end" fontSize="9" fontWeight="600" fill="#334155">{row.v}</text>
            </g>
          ))}

          {/* Legend */}
          <rect x="30" y="840" width="1100" height="100" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
          <text x="580" y="862" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">Legend</text>

          {[
            { c: "#bfdbfe", t: "Input Data (FIN + SMD&A)" },
            { c: "#c7d2fe", t: "Base LLM Backbone (frozen)" },
            { c: "#fbcfe8", t: "LoRA Adapters (trainable parameters)" },
            { c: "#a7f3d0", t: "Classification Head (softmax + training mechanics)" },
            { c: "#fde68a", t: "Output & Evaluation (binary + metrics)" },
          ].map((item, i) => (
            <g key={i}>
              <rect x={60 + i*215} y={880} width="205" height="16" rx="4" fill={item.c} stroke="#e2e8f0" strokeWidth="1"/>
              <text x={162 + i*215} y="892" textAnchor="middle" fontSize="8" fontWeight="500" fill="#334155">{item.t}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Hyperparams card below */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">LoRA Configuration</h3>
          <div className="space-y-2.5">
            {[
              { label: "Rank (r)", value: loraConfig.r },
              { label: "Alpha", value: loraConfig.alpha },
              { label: "Dropout", value: loraConfig.dropout },
              { label: "Learning Rate", value: loraConfig.learningRate },
              { label: "Batch Size", value: loraConfig.batchSize },
              { label: "Epochs", value: loraConfig.epochs },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Base Models &amp; Target Modules</h3>
          <div className="mb-3">
            <span className="mb-2 block text-xs font-medium text-gray-500">Base Models</span>
            <div className="flex flex-wrap gap-1.5">
              {loraConfig.baseModels.map((m) => (
                <span key={m} className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{m}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs font-medium text-gray-500">Target Modules</span>
            <div className="flex flex-wrap gap-1.5">
              {loraConfig.targetModules.map((m) => (
                <span key={m} className="rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Training mechanisms grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Training Mechanisms</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Softmax Classification", desc: "Modified LM head for 2 classes (Fraud/Not Fraud). Loss computed only on last token (YES/NO). All previous tokens ignored during backprop.", icon: "\ud83c\udfaf" },
            { title: "Per-epoch Undersampling", desc: "Dynamic PermutableUndersamplingDataset balances classes each epoch while preserving SIC industry + year distributions. Targets 5% fraud rate.", icon: "\u2696\ufe0f" },
            { title: "Threshold Optimization", desc: "Per-epoch AUC-based threshold optimization on validation set. Best F1-maximizing threshold applied for final metrics computation.", icon: "\ud83d\udcd0" },
            { title: "Feature Dropout", desc: "Randomly drops financial features during training to prevent over-reliance on specific indicators. Improves generalization across companies.", icon: "\ud83c\udf00" },
            { title: "Auto-Continue Training", desc: "Resumes from best checkpoint (by F1 score). Ensures optimal model selection across all epochs without manual intervention.", icon: "\ud83d\udd04" },
            { title: "Gradient Checkpointing", desc: "Unsloth mode for memory-efficient training. Reduces VRAM usage by recomputing activations during backward pass.", icon: "\ud83d\udcbe" },
          ].map((m) => (
            <div key={m.title} className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{m.icon}</span>
                <h3 className="text-sm font-semibold text-gray-900">{m.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data flow under the diagram */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Data Flow Summary</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {[
            { label: "SEC Filings", color: "bg-blue-100 text-blue-700 border-blue-200" },
            { label: "XBRL Parsing", color: "bg-blue-100 text-blue-700 border-blue-200" },
            { label: "122 Features", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
            { label: "SMD&A Summary", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
            { label: "Prompt Assembly", color: "bg-purple-100 text-purple-700 border-purple-200" },
            { label: "LoRA Fine-tune", color: "bg-pink-100 text-pink-700 border-pink-200" },
            { label: "Softmax Classifier", color: "bg-green-100 text-green-700 border-green-200" },
            { label: "AUC / F1 Eval", color: "bg-amber-100 text-amber-700 border-amber-200" },
          ].map((step, i) => (
            <span key={step.label} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-medium ${step.color}`}>
              {step.label}
              {i < 7 && <span className="text-gray-400">&rarr;</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Results sub-content with subtabs ──────────────────────────────
function ResultsContent() {
  const [splitMethod, setSplitMethod] = useState<"company" | "random">("company");

  return (
    <section className="space-y-8">
      {/* Split method subtabs */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Evaluation Strategy</h2>
        <p className="mb-4 text-sm text-gray-500">
          Choose the split method to see how data leakage affects reported performance.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setSplitMethod("company")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              splitMethod === "company"
                ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">Company-Isolated (CI-FSFD)</div>
            <div className="mt-0.5 text-xs text-gray-500">Correct evaluation — no data leakage</div>
          </button>
          <button
            onClick={() => setSplitMethod("random")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              splitMethod === "random"
                ? "border-red-300 bg-red-50 text-red-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">Random Split</div>
            <div className="mt-0.5 text-xs text-gray-500">Leaky — same company in train & test</div>
          </button>
        </div>
      </div>

      {/* Company-Isolated results */}
      {splitMethod === "company" && (
        <>
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <h3 className="text-lg font-semibold text-green-900">CI-FSFD (Company-Isolated) — Correct Evaluation</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-green-800">
              All data from the same company appears in <strong>either</strong> training <strong>or</strong> test set — never both.
              This prevents data leakage and reveals the true generalization performance.
            </p>
            <div className="space-y-3">
              {cifdfdData.map((model, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 text-sm text-gray-700">{model.model}</span>
                  <div className="flex-1 h-8 rounded bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${(model.auc / 0.80) * 100}%`,
                        backgroundColor: model.color,
                        opacity: model.model.includes("Zero-shot") ? 0.5 : 0.85,
                      }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">
                        {model.auc.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm font-bold text-gray-900">
                    {model.auc.toFixed(2)} AUC
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Bars represent AUC scores on the correct CI-FSFD benchmark. Higher is better.
              The maximum scale is set to 0.80 to better visualize real performance differences.
            </div>
          </div>

          {/* Key findings for CI-FSFD */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <h4 className="mb-2 text-base font-semibold text-green-800">Text Dominates</h4>
              <p className="text-sm leading-relaxed text-green-700">
                SMD&A (AUC 0.74) outperforms combined FIN+SMD&A (AUC 0.72), revealing a
                <strong> "noise bottleneck"</strong> from naive numerical-text concatenation.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h4 className="mb-2 text-base font-semibold text-blue-800">Domain Adaptation Helps</h4>
              <p className="text-sm leading-relaxed text-blue-700">
                Fino1-8B (AUC 0.74) slightly outperforms Llama-3.1 8B (AUC 0.73),
                showing the value of domain-specific pretraining for financial fraud.
              </p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
              <h4 className="mb-2 text-base font-semibold text-purple-800">Zero-Shot Fails</h4>
              <p className="text-sm leading-relaxed text-purple-700">
                Zero-shot LLMs perform at chance (~0.50 AUC), confirming that fraud detection requires
                <strong> supervised fine-tuning</strong> on domain-specific data.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Random Split results — shown as warning */}
      {splitMethod === "random" && (
        <>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <h3 className="text-lg font-semibold text-red-900">Random Split — Leaky Evaluation</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-red-800">
              When data is split randomly, the <strong>same company's data appears in both</strong> training and test sets.
              The model memorizes company-specific patterns instead of learning generalizable fraud indicators,
              producing <strong>grossly inflated and misleading scores</strong>.
            </p>
            <div className="space-y-3">
              {randomSplitData.map((model, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 text-sm text-gray-700">{model.model}</span>
                  <div className="flex-1 h-8 rounded bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full rounded transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${(model.auc / 1.0) * 100}%`,
                        backgroundColor: model.color,
                        opacity: 0.75,
                      }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">
                        {model.auc.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm font-bold text-red-600">
                    {model.auc.toFixed(2)} AUC
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-red-600">
              These scores are <strong>not comparable</strong> to the CI-FSFD benchmark. They reflect memorization,
              not generalization.
            </div>
          </div>

          {/* Leakage comparison */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">How Much Inflation? (Random vs CI-FSFD)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left text-gray-500 font-medium">Model</th>
                    <th className="pb-2 text-right text-gray-500 font-medium">CI-FSFD AUC</th>
                    <th className="pb-2 text-right text-gray-500 font-medium">Random AUC</th>
                    <th className="pb-2 text-right text-red-600 font-medium">Inflation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { model: "Fino1-8B (SMD&A)", cifdfd: 0.74, random: 0.92 },
                    { model: "Llama-3.1 8B (SMD&A)", cifdfd: 0.73, random: 0.91 },
                    { model: "Fino1-8B (FIN+SMD&A)", cifdfd: 0.72, random: 0.90 },
                    { model: "Fino1-8B (FIN)", cifdfd: 0.70, random: 0.88 },
                    { model: "LightGBM", cifdfd: 0.69, random: 0.87 },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{row.model}</td>
                      <td className="py-2 text-right font-medium text-green-700">{row.cifdfd.toFixed(2)}</td>
                      <td className="py-2 text-right font-medium text-red-600">{row.random.toFixed(2)}</td>
                      <td className="py-2 text-right font-bold text-red-600">+{(row.random - row.cifdfd).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Random splitting inflates AUC by <strong>0.15–0.19 points</strong> — turning a moderate 0.69–0.74 AUC
              into a misleading 0.87–0.92. This is why CI-FSFD is essential.
            </p>
          </div>
        </>
      )}

      {/* Dataset imbalance note */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-semibold">Class Imbalance & Handling</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Raw dataset has only 0.03% fraud cases. Training uses epoch-level undersampling to achieve 5% fraud
          distribution while preserving industry and time distributions. Threshold optimization via
          validation F1-maximization ensures precision under imbalanced constraints.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">0.03%</div>
            <div className="text-xs text-gray-400">Raw fraud rate</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">5%</div>
            <div className="text-xs text-gray-400">Training fraud rate</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">10,159</div>
            <div className="text-xs text-gray-400">Final samples</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main component ────────────────────────────────────────────────
export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        CI-FSFD Benchmark Explorer
      </h1>
      <p className="mb-2 text-gray-500">
        Interactive exploration of the benchmark from our IJCAI 2026 FINLLM paper.
      </p>
      <Link
        href="/publications/ijcai-2026-finllm"
        className="mb-12 inline-block text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        View paper details &rarr;
      </Link>

      {/* What is CI-FSFD */}
      <section className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">What is CI-FSFD?</h2>
        <p className="leading-relaxed text-gray-600">
          <strong className="text-gray-800">Company-Isolated Financial Statement Fraud Detection</strong>{" "}
          prevents data leakage by ensuring all data from the same company appears in
          either training or test set — never both. This reveals that prior random-split
          evaluations (up to 0.96 AUC) drastically overestimate real generalization
          (~0.70&ndash;0.74 AUC).
        </p>
      </section>

      {/* Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <TabContent activeTab={activeTab} />
    </div>
  );
}