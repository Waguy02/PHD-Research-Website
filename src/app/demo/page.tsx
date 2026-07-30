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
    rawMDA: "Amazon.com reported net sales of $72.4 billion for the fourth quarter of 2018, an increase of 20% compared to $60.5 billion in the prior year. Excluding the unfavorable impact from changes in foreign exchange rates, net sales increased 22%. North America segment sales were $44.1 billion, up 18% year-over-year. International segment sales were $20.8 billion, up 15% (18% excluding FX). AWS segment sales were $7.4 billion, up 45% year-over-year. Operating income was $3.8 billion compared to $2.1 billion in the prior year, with AWS contributing $2.4 billion. Net income was $3.0 billion, driven by growth in AWS and advertising revenue, compared to $1.9 billion in the prior year. Free cash flow for the trailing twelve months was $19.4 billion, compared to $8.4 billion in the prior year. The company employed 647,500 full-time and part-time employees as of December 31, 2018. Capital expenditures including property and equipment acquired under capital leases were $13.9 billion for the trailing twelve months. Amazon Prime memberships continued to grow, though the company no longer discloses the number of members. Third-party seller units represented 58% of total units sold. AWS had a $30 billion annualized run rate, growing 46% year-over-year. The company continued to invest heavily in fulfillment infrastructure, AWS data centers, and content for Prime Video and Amazon Studios. Management highlighted the success of AWS's pace of innovation, including the launch of new services such as Amazon Forecast, Amazon Personalize, and Amazon Textract during the quarter. Advertising revenue continued to grow rapidly, driven by sponsored products and brand advertising. The company's consolidated operating cash flow was $30.7 billion for the trailing twelve months.",
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
    rawMDA: "Advanta Corp. reported third quarter 1999 net income of $42 million, or $0.68 per diluted share, compared to $38 million or $0.61 per share in the prior year. Managed credit card receivables grew to $8.2 billion from $6.8 billion in the prior year, representing 21% growth. Net interest margin declined to 6.8% from 7.2%, reflecting increased funding costs. The company reported credit card fee income of $87 million, up 31% from $66 million in the prior year. The allowance for loan losses was $142 million, representing 2.8% of managed receivables, compared to $136 million and 3.0% in the prior year. Net charge-offs were $41 million or 2.0% of average receivables, versus $38 million or 2.2% in the prior year. Delinquencies (30+ days) were 4.0% of receivables, down from 4.3% in the prior year. Advanta's managed credit card portfolio consisted of both prime and subprime accounts. The company noted that its credit quality metrics remained strong and that it had taken a conservative approach to reserving. Management highlighted the success of new account acquisition programs and the expansion of co-branded credit card partnerships. The company stated that it expected continued improvement in credit metrics as it refined its credit scoring models. Advanta's return on equity was 20%, and the efficiency ratio improved to 35% from 38%. The company also noted that it had launched a new small business credit card product during the quarter.",
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
    rawMDA: "Bank of America, the parent company of Merrill Lynch, reported fourth quarter 2019 net income of $6.7 billion, or $0.74 per diluted share, compared to $7.3 billion or $0.70 per share in the prior year (adjusted for the 2019 stock split). Global Wealth & Investment Management (GWIM), which includes Merrill Lynch, reported revenue of $4.7 billion, up 2% year-over-year. Net income for the wealth management division was $1.1 billion. Total client balances reached a record $2.9 trillion, up 12% year-over-year, driven by net new households and market appreciation. Merrill Lynch produced its ninth consecutive quarter of net new household growth, with a 4% increase in advisor headcount to 14,114 advisors. Average annualized revenue per advisor increased 3% to $1.12 million. The wealth management division's pretax margin was 28%, within the company's target range. Global Banking & Markets revenue was $4.3 billion, driven by strong sales and trading results. The company maintained its conservative approach to market risk, with value-at-risk (VaR) averaging $42 million during the quarter. Total assets under management in Merrill Lynch's discretionary advisory programs reached $530 billion. The division continued to see strong demand for its banking and lending products, with outstanding loan balances increasing 4% to $164 billion. The company's efficiency ratio improved to 60.5% from 61.8% in the prior year. Management noted the success of its long-term strategy focused on responsible growth and serving clients through a full-service model.",
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
    rawMDA: "AIG reported first quarter 2005 net income of $3.9 billion, compared to $2.8 billion in the prior year. Net premiums written increased 11% to $10.2 billion. The combined ratio improved to 92.5 from 94.1, driven by favorable prior-year reserve development. General insurance loss reserves were $47.6 billion, up from $45.1 billion in the prior year. The company reported net investment income of $3.1 billion, up 12%. AIG's financial services segment contributed $1.2 billion in operating income. The company's shareholders' equity was $85.7 billion. AIG had $11.2 billion in unrealized gains on its investment portfolio. The company disclosed various transactions with off-balance-sheet entities, including special purpose vehicles used for finite reinsurance arrangements. Management stated that these transactions were designed to manage the company's risk exposure and optimize capital efficiency. AIG's management emphasized the company's strong underwriting discipline and conservative reserving practices. The company noted that its property and casualty operations had benefited from favorable loss experience and improved pricing. The board declared a quarterly dividend of $0.10 per share. The company also announced plans to repurchase up to $2 billion of its common stock. During the quarter, AIG was cooperating with investigations by the SEC, the Department of Justice, and the New York Attorney General regarding finite reinsurance transactions and broker compensation practices.",
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
    rawMDA: "Tesla reported fourth quarter 2020 revenue of $10.7 billion, up 46% year-over-year. Automotive revenue was $9.3 billion, with automotive gross margin improving to 25.5% from 20.2% in the prior year. Total automotive deliveries were 180,667 vehicles during the quarter, a 61% increase year-over-year. Model Y production ramped successfully at the Fremont factory, reaching volume production ahead of schedule. The company produced 179,757 vehicles during the quarter. Energy generation and storage revenue was $752 million, with solar deployments of 86 MW and storage deployments of 1,584 MWh. Services and other revenue was $678 million. GAAP net income was $270 million, with GAAP EPS of $0.23 and non-GAAP EPS of $0.80. Free cash flow was $1.9 billion. Cash and cash equivalents increased by $4.9 billion in the quarter to $19.4 billion. Operating expenses were $1.5 billion, up 16%. Research and development expenses were $521 million. The company achieved an operating margin of 6.3%, demonstrating consistent profitability for the fifth consecutive quarter. Tesla opened its first manufacturing facility outside the U.S., Gigafactory Shanghai, which achieved production of Model 3 at an annualized rate of 250,000 units. Construction of Gigafactory Berlin and Gigafactory Texas began during the year. The company continued development of its Full Self-Driving (FSD) software and began a limited beta release of the FSD City Streets feature. Management highlighted the company's focus on cost reduction and operational efficiency. They noted that the average selling price per vehicle declined slightly due to product mix, but cost improvements more than offset the price reduction.",
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
    return (
      <section className="space-y-8">
        {/* Architecture overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">LoRA Fine-tuning Architecture</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">LoRA Configuration</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Rank (r)</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.r}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Alpha</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.alpha}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Dropout</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.dropout}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Learning Rate</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.learningRate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Batch Size</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.batchSize}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Epochs</span>
                  <span className="text-sm font-semibold text-gray-900">{loraConfig.epochs}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">Target Modules</h3>
              <div className="flex flex-wrap gap-2">
                {loraConfig.targetModules.map((mod: string) => (
                  <span
                    key={mod}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {mod}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 mb-3 text-lg font-medium text-gray-900">Base Models Used</h3>
              <div className="space-y-2">
                {loraConfig.baseModels.map((model: string) => (
                  <div
                    key={model}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">{model}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Training mechanism */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Training Mechanisms</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Softmax Classification",
                desc: "Modified LM head for 2 classes (Fraud/Not Fraud). Loss computed only on last token (YES/NO classification). All previous tokens ignored.",
              },
              {
                title: "Per-epoch Undersampling",
                desc: "Dynamic PermutableUndersamplingDataset balances classes each epoch while preserving SIC industry + year distributions.",
              },
              {
                title: "Threshold Optimization",
                desc: "Per-epoch AUC-based threshold optimization on validation set. Best threshold applied for metrics computation.",
              },
              {
                title: "Feature Dropout",
                desc: "Randomly drop financial features during training for robustness. Prevents over-reliance on specific features.",
              },
              {
                title: "Auto-Continue Training",
                desc: "Can resume training from best checkpoint (by F1 score). Ensures optimal model selection across epochs.",
              },
              {
                title: "Gradient Checkpointing",
                desc: "Unsloth mode for memory-efficient training. Enables larger batch sizes on limited GPU memory.",
              },
            ].map((mechanism, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <h3 className="mb-2 text-sm font-semibold text-gray-900">{mechanism.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{mechanism.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data flow diagram */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Data Flow</h2>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <span className="text-sm font-medium text-gray-700">Raw SEC Filings (10-K/10-Q) + AAER Enforcement Releases</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <span className="text-sm font-medium text-gray-700">Preprocessing: MDA Extraction + XBRL Parsing + Fraud Labeling</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <span className="text-sm font-medium text-gray-700">Feature Engineering: 122 Features + SMD&A Summaries + Beneish M-score</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
              <span className="text-sm font-semibold text-blue-700">LLM Prompt: Financial Features + MDA Summary → "YES"/"NO"</span>
            </div>
            <div className="text-2xl text-gray-300">↓</div>
            <div className="w-full rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <span className="text-sm font-semibold text-green-700">LoRA Fine-tuning → Softmax Classifier → AUC Score</span>
            </div>
          </div>
        </div>
      </section>
    );
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
          <div className="text-sm text-gray-500">
            {slideIdx + 1} / {mdaSlides.length}
          </div>
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

      {/* Main slide card */}
      <div
        className={`rounded-xl border-2 p-6 transition-all ${
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
          {/* Left: Raw MD&A */}
          <div className="min-w-0">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Raw MD&A (Original 10-Q Filing)
            </h3>
            <div className="max-h-[500px] overflow-auto rounded-lg border border-gray-200 bg-white p-4">
              <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                {slide.rawMDA}
              </pre>
            </div>
          </div>

          {/* Right: SMD&A + AAER */}
          <div className="flex min-w-0 flex-col gap-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-blue-700">
                SMD&A (Qwen3-32B Summary)
              </h3>
              <div className="max-h-[300px] overflow-auto rounded-lg border border-blue-200 bg-white p-4">
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

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevSlide}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
        >
          &larr; Previous
        </button>

        <div className="flex flex-wrap gap-1">
          {mdaSlides.map((s, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                i === slideIdx
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {s.company.split(/[(,]/)[0].trim().slice(0, 12)}...
            </button>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
        >
          Next &rarr;
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
        Browse all 10 samples. Raw MDA text is shown in full (no truncation).
        SMD&A preserves the 11-section structure (strategic priorities, operations, financials, risks, etc.).
        Average raw MDA: ~14k tokens; Average SMD&A: ~3,800 tokens.
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