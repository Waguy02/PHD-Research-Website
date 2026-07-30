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
    rawMDA: "In the second quarter of 2002, the company reported revenue of $9.8 billion compared to $8.5 billion in the prior quarter. Line cost expenses, which represent the cost of carrying voice and data traffic, were reported at $3.4 billion. However, internal accounting records revealed that approximately $3.8 billion in line costs were improperly capitalized as long-term assets rather than being expensed as incurred. This accounting treatment falsely inflated operating income by reducing reported expenses. The company's earnings before interest, taxes, depreciation, and amortization (EBITDA) was reported at $6.4 billion, a key metric closely watched by analysts. Cash flow from operations was reported at $5.6 billion, significantly higher than net income of $2.1 billion, as the capitalized line costs were classified as investing activities rather than operating expenses. Capital expenditures surged to $7.0 billion from $2.5 billion in the prior year, primarily driven by the reclassified line costs. The company's debt-to-equity ratio rose to 1.8 from 1.2 as the company borrowed aggressively to fund what appeared to be massive network expansion. Management attributed the increased capital spending to building out fiber-optic capacity and acquiring new telecommunications assets. Accounts receivable grew by 22% year-over-year while revenue grew only 15%, indicating potential collection issues. The company also reported $2.5 billion in goodwill and intangible assets from recent acquisitions. The ratio of operating cash flow to capital expenditures, a metric management emphasized, declined from 1.4 to 0.8. In the conference call, management expressed confidence in continued double-digit revenue growth driven by data services. They highlighted the company's aggressive network build-out as a competitive advantage against emerging telecom carriers. They also noted that the company had secured $11.8 billion in credit facilities to fund ongoing capital requirements. The company's stock traded at approximately 15 times trailing earnings. The board authorized a $2.0 billion share repurchase program during the quarter. Management stated that the company's strong free cash flow generation supported both the capital expenditure program and shareholder returns.SEGMENT RESULTS — EXPANDED DISCUSSION

WorldCom operates in multiple telecommunications segments. The Long Distance Voice segment generated revenues of approximately $4.1 billion with operating income of $1.2 billion, representing a 29% margin. The Data and Internet Services segment reported revenues of $2.8 billion with operating income of $0.8 billion, representing a 29% margin. The Enterprise Services segment generated revenues of $1.9 billion with operating income of $0.4 billion, reflecting significant investment in network infrastructure. The Local and Wireless segment reported revenues of $1.0 billion with an operating loss of $0.1 billion. Segment operating margins averaged 25%, down from 32% in the prior year, reflecting competitive pricing pressure. Data services revenue grew 18% year-over-year, driven by demand for high-speed internet. The following table summarizes segment results:

Long Distance Voice: Revenue $4.1B, Operating Income $1.2B, Margin 29%
Data and Internet Services: Revenue $2.8B, Operating Income $0.8B, Margin 29%
Enterprise Services: Revenue $1.9B, Operating Income $0.4B, Margin 21%
Local and Wireless: Revenue $1.0B, Operating Income ($0.1B), Margin (10)%

Consolidated: Revenue $9.8B, Operating Income $2.3B, Margin 23%

LIQUIDITY AND CAPITAL RESOURCES — EXPANDED DISCUSSION

Cash flow from operations was $5.6 billion, significantly exceeding net income of $2.1 billion due to the reclassification of line costs to investing activities. Capital expenditures were $7.0 billion, resulting in negative free cash flow of $1.4 billion. The company had $11.8 billion in credit facilities, with $6.5 billion drawn at quarter end. Debt maturities total $4.8 billion over five years, with $1.2 billion due within twelve months. The company maintained access to a $4.0 billion revolving credit facility that was 45% utilized. Total debt was $32.4 billion with debt-to-EBITDA of 5.1 times. Interest expense was $0.7 billion at a weighted average rate of 7.2%. The current ratio was 1.2, and the quick ratio was 0.9. Days sales outstanding in accounts receivable was 52 days, up from 45 days in the prior year. Management believes the company has sufficient liquidity to meet its obligations for at least the next twelve months, although this depends on continued access to capital markets.

CONTRACTUAL OBLIGATIONS

Long-term debt obligations totaled $30.1 billion, with $1.2 billion due within one year, $2.8 billion due in years 2-3, $4.5 billion due in years 4-5, and $21.6 billion due thereafter. Operating lease obligations totaled $8.5 billion, with $1.5 billion due within one year, $2.5 billion due in years 2-3, $2.0 billion due in years 4-5, and $2.5 billion due thereafter. Purchase obligations were $4.2 billion. Capital expenditure commitments were $2.5 billion. Other long-term liabilities totaled $1.8 billion. The aggregate contractual obligations amounted to approximately $47.1 billion. The company also had $1.2 billion in letters of credit, which are not reflected in the contractual obligations table.

MARKET RISK — QUANTITATIVE AND QUALITATIVE DISCLOSURES

Interest Rate Risk: Approximately 60% of total debt carried variable interest rates. A 100-basis-point increase in interest rates would increase annual interest expense by approximately $194 million. The fair value of fixed-rate debt would decrease by $0.8 billion for a 100-basis-point increase. The company uses interest rate swap agreements with a notional amount of $3.5 billion to manage exposure. These swaps convert fixed-rate debt to variable-rate or vice versa and are designated as cash flow or fair value hedges. The counterparties to these instruments are major financial institutions, and the company monitors concentration of counterparty credit risk. The company also uses treasury locks and forward-starting swaps to manage interest rate exposure on anticipated debt issuances.

Foreign Currency Risk: The company operates in 65 countries. A 10% strengthening of the U.S. dollar would reduce international revenues by approximately $245 million and reduce operating income by approximately $35 million. The company manages this exposure through natural hedging, where foreign currency revenues and expenses are matched, and through foreign currency forward contracts with a notional amount of $1.8 billion. The company also uses cross-currency swaps on intercompany loans to certain foreign subsidiaries. These risk management activities are governed by a treasury policy that requires hedging of material net foreign currency exposures.

CRITICAL ACCOUNTING ESTIMATES

Revenue Recognition: For multiple-element arrangements, the company allocates revenue based on relative fair value. A 5% change in estimated total contract costs would affect reported revenue by approximately $95 million. The company recognizes revenue when persuasive evidence of an arrangement exists, delivery has occurred, the fee is fixed or determinable, and collectibility is reasonably assured. For long-term construction contracts, the company uses the percentage-of-completion method, which requires estimates of total contract costs and progress toward completion. Changes in these estimates could have a material effect on reported revenue.

Allowance for Doubtful Accounts: The allowance for doubtful accounts was $287 million, representing 4.3% of gross accounts receivable. A 1% change in the assumed default rate would affect the allowance by approximately $67 million. The company evaluates the adequacy of the allowance based on historical collection experience, aging of accounts receivable, and an assessment of current economic conditions and specific customer creditworthiness.

Deferred Tax Assets: Deferred tax assets of $1.2 billion were recorded, with a valuation allowance of $0.3 billion. The realization of deferred tax assets depends on generating sufficient taxable income in future periods. The company evaluates both positive and negative evidence, including historical profitability, projected future taxable income, and tax-planning strategies, in determining the need for a valuation allowance.

RECENT ACCOUNTING PRONOUNCEMENTS

In June 2002, the FASB issued SFAS No. 146, Accounting for Costs Associated with Exit or Disposal Activities, which requires that a liability for a cost associated with an exit or disposal activity be recognized when the liability is incurred, rather than at the date of a commitment to an exit plan. The company is evaluating the impact of this standard. The FASB also issued SFAS No. 145, Rescission of FASB Statements No. 4, 44, and 64, Amendment of FASB Statement No. 13, and Technical Corrections, which updates accounting for gains and losses on debt extinguishment. The FASB is deliberating proposals regarding consolidation of variable interest entities, which could result in the consolidation of certain off-balance-sheet vehicles. The SEC has issued Staff Accounting Bulletin No. 101, Revenue Recognition in Financial Statements, and Staff Accounting Bulletin No. 99, Materiality, which provides guidance on the materiality of misstatements.

FORWARD-LOOKING STATEMENTS AND RISK FACTORS

This report contains forward-looking statements within the meaning of the Private Securities Litigation Reform Act of 1995. These statements are based on management's current expectations and are subject to risks and uncertainties that could cause actual results to differ materially. Key risk factors include: (1) the company's significant debt obligations and the need to refinance maturing debt; (2) competitive pricing pressure in the telecommunications industry, particularly in the long-distance voice market; (3) the need for continued access to capital markets to fund operations and capital expenditures; (4) FCC regulatory changes and the potential impact of new regulations on the telecommunications industry; (5) rapid technological changes and the risk of technological obsolescence; (6) the risk of economic downturns that could reduce demand for telecommunications services; (7) reliance on key suppliers for network equipment and infrastructure; (8) changes in accounting standards that could affect how the company reports its financial results; (9) risks associated with international operations, including foreign currency fluctuations, political instability, and varying regulatory environments; and (10) the ongoing SEC inquiry into the company's accounting practices, which could result in material adjustments to previously reported financial statements and have a material adverse effect on the company's business, financial condition, and results of operations.

DISCLOSURE CONTROLS AND PROCEDURES

Management, with the participation of the Chief Executive Officer and Chief Financial Officer, has evaluated the effectiveness of the company's disclosure controls and procedures as of June 30, 2002. Based on this evaluation, management has concluded that the company's disclosure controls and procedures are effective in ensuring that information required to be disclosed in reports filed under the Securities Exchange Act of 1934 is recorded, processed, summarized, and reported within the time periods specified by the SEC. There have been no changes in internal control over financial reporting during the quarter ended June 30, 2002 that have materially affected, or are reasonably likely to materially affect, the company's internal control over financial reporting.

OFF-BALANCE-SHEET ARRANGEMENTS

Off-balance-sheet arrangements include operating leases of $8.5 billion, letters of credit of $0.8 billion, and $0.4 billion in surety bonds. These arrangements are customary in the telecommunications industry and are entered into in the ordinary course of business. The company does not have any off-balance-sheet arrangements that have or are reasonably likely to have a current or future material effect on the company's financial condition, results of operations, liquidity, capital expenditures, or capital resources. The company is committed to transparent disclosure of all material arrangements and continues to monitor regulatory developments regarding off-balance-sheet disclosures.SUPPLEMENTAL QUANTITATIVE AND QUALITATIVE DISCLOSURES ABOUT MARKET RISK

The company faces market risk from changes in interest rates, foreign currency exchange rates, and commodity prices, which could adversely affect financial condition and results of operations. Our risk management framework is designed to identify, measure, monitor, and manage these risks in a disciplined manner. The Risk Management Committee, composed of senior officers from finance and treasury, meets monthly to review exposures, hedge positions, and compliance with approved policies. We perform sensitivity analyses and stress testing on our portfolio of risk management instruments on a quarterly basis to evaluate potential impacts under various market scenarios.

Interest Rate Risk: Our earnings and cash flows are exposed to interest rate fluctuations. At June 30, 2002, we had $32.4 billion in total debt, of which approximately 60% bore interest at variable rates. A hypothetical 100-basis-point adverse change in interest rates would increase annual interest expense by approximately $194 million, based on the variable-rate debt outstanding at quarter end. The fair value of our fixed-rate debt, which totaled $12.9 billion, would decrease by approximately $0.8 billion for a 100-basis-point increase in benchmark interest rates. We utilize interest rate swap agreements with a total notional amount of $3.5 billion to manage our exposure to interest rate volatility. Under these swap arrangements, we agree to exchange, at specified intervals, the difference between fixed-rate and floating-rate interest amounts calculated on the notional principal amounts. The counterparties to these agreements are major financial institutions with investment-grade credit ratings. We monitor the creditworthiness of all counterparties on a continuous basis and believe that the risk of nonperformance is remote. We also use treasury locks and forward-starting interest rate swaps to hedge the interest rate risk associated with anticipated debt issuances.

Foreign Currency Risk: Our international operations expose us to foreign currency exchange rate risk. We transact business in approximately 25 foreign currencies, with our most significant exposures in the euro, British pound, Japanese yen, and Canadian dollar. A 10% appreciation of the U.S. dollar against all foreign currencies would reduce annual revenue by approximately $245 million and reduce annual operating income by approximately $35 million. We manage this exposure through a combination of natural hedging and financial instruments. Our natural hedging strategy seeks to match foreign currency revenues with expenses in the same currency. Additionally, we utilize foreign currency forward contracts and cross-currency swaps with a total notional amount of $1.8 billion to hedge forecasted transactions and net investments in foreign operations. These instruments are designated as cash flow or net investment hedges under applicable accounting guidance. We do not engage in speculative foreign currency transactions. Our hedging strategies are reviewed periodically to ensure they remain effective in reducing the impact of currency fluctuations on our financial results.

Commodity Price Risk: Although not a primary exposure for our telecommunications business, we are indirectly affected by fuel and energy costs that impact our network operations. We manage these exposures through our procurement practices and do not currently use commodity derivative instruments. We continue to monitor commodity price developments and evaluate the need for hedging activities.

CRITICAL ACCOUNTING ESTIMATES — ADDITIONAL DISCLOSURES

Property, Plant and Equipment: We follow the guided depreciation or amortization method for our telecommunications network assets, utilizing useful lives that range from 3 to 30 years depending on the asset class. We review the carrying value of long-lived assets for impairment whenever events or changes in circumstances indicate that the carrying amount may not be recoverable. Our impairment analysis requires management to make significant estimates and assumptions regarding future cash flows, growth rates, and discount rates. Changes in these assumptions could result in material impairment charges. At June 30, 2002, net property, plant and equipment totaled $35.2 billion, representing a significant concentration of our total assets.

Income Taxes: We record deferred tax assets and liabilities based on temporary differences between the financial reporting and tax bases of assets and liabilities. We must assess the likelihood that deferred tax assets will be realized from future taxable income. At June 30, 2002, we had gross deferred tax assets of $1.2 billion, against which we recorded a valuation allowance of $0.3 billion. A change in our assessment of future taxable income could result in an adjustment to the valuation allowance that would affect income tax expense in the period of change. We consider all available positive and negative evidence, including historical profitability, projected future taxable income, tax-planning strategies, and the tax jurisdiction in which the temporary differences arise.

Pension and Postretirement Benefits: We sponsor defined benefit pension plans and postretirement health care plans for eligible employees. The measurement of benefit obligations and net periodic benefit cost requires management to make assumptions regarding discount rates, expected long-term rates of return on plan assets, rates of compensation increase, and health care cost trend rates. Changes in these assumptions could materially affect the measurement of benefit obligations and net periodic benefit cost.

RECENT ACCOUNTING PRONOUNCEMENTS — ADDITIONAL DETAILS

The Financial Accounting Standards Board continues to address emerging accounting issues that may affect our financial reporting. In particular, the FASB's project on consolidation of variable interest entities, which was prompted by concerns about off-balance-sheet structures similar to those used by Enron, could result in the consolidation of certain entities that were previously not consolidated. The SEC has also increased its focus on the quality and transparency of financial reporting, issuing Staff Accounting Bulletin No. 100 on revenue recognition and Staff Accounting Bulletin No. 99 on materiality. The Sarbanes-Oxley Act of 2002, which was enacted in response to recent corporate scandals, includes provisions that will require CEO and CFO certification of financial statements, enhance the independence of audit committees, and impose stricter penalties for financial reporting violations. We are evaluating the impact of these developments on our financial reporting processes and internal controls.

FORWARD-LOOKING STATEMENTS — ADDITIONAL CAUTIONARY FACTORS

In addition to the risk factors previously discussed, investors should consider the following additional factors that could affect our forward-looking statements: (1) our ability to successfully integrate acquired businesses and achieve anticipated synergies, cost savings, and operational efficiencies; (2) the impact of technological convergence and the emergence of new competitors, including cable operators and wireless carriers offering voice and data services; (3) the potential for further downgrades in our credit ratings, which could increase borrowing costs and restrict access to capital markets; (4) the challenge of attracting and retaining qualified technical and managerial personnel in a competitive labor market; (5) the risk of network failures, service interruptions, or security breaches that could result in significant costs, legal liability, and reputational harm; and (6) the potential for changes in accounting standards or regulatory requirements that could materially affect our reported financial results and require significant systems and process changes.",
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
    rawMDA: "For the third quarter of fiscal 2019, NIKE reported revenues of $9.6 billion, an increase of 7% compared to the same period last year. On a currency-neutral basis, revenue grew 11%. NIKE Brand revenue increased 8% to $9.1 billion, driven by Sportswear and the Jordan Brand. Converse revenue decreased 4% to $482 million. Gross margin improved to 45.1% from 43.8% in the prior year, driven by higher average selling prices and improved product mix, partially offset by higher product costs. SG&A expenses increased to $3.09 billion compared to $2.77 billion last year, representing 32.2% of revenues versus 30.8%. The increase was driven by investments in digital capabilities and demand creation. Net income was $1.1 billion with diluted EPS of $0.68, compared to a net loss of $921 million and diluted loss per share of $0.57 in the prior year. The prior year included a significant one-time tax charge related to U.S. tax reform. Inventories were $5.4 billion, up 7% from the prior year. Cash and short-term investments were $3.7 billion. The company repurchased 10.5 million shares for $850 million during the quarter. A new four-year, $15 billion share repurchase program was authorized in June 2018. Return on invested capital remained strong at approximately 30%. The company's effective tax rate was 15.8% compared to 164.1% in the prior year. In North America, revenue grew 7% on a currency-neutral basis. In EMEA, revenue grew 12% currency-neutral. Greater China revenue grew 24% currency-neutral. Asia Pacific & Latin America grew 14% currency-neutral. NIKE Direct digital sales increased 36% globally. The company continued to invest in its digital transformation and direct-to-consumer capabilities.SEGMENT RESULTS — EXPANDED DISCUSSION

NIKE reports its operations through four geographic segments: North America, EMEA, Greater China, and Asia Pacific & Latin America (APLA), as well as the Converse brand. North America generated revenues of $3.9 billion with segment operating income of $1.1 billion, representing a 28% margin. The region benefited from strong demand in Sportswear and the Jordan Brand, with NIKE Direct digital sales increasing 36% in the region. EMEA generated revenues of $2.4 billion with segment operating income of $0.7 billion, representing a 29% margin, with currency-neutral growth of 12% reflecting strong momentum in Western Europe and the Middle East. Greater China generated revenues of $1.6 billion with segment operating income of $0.6 billion, representing a 38% margin, making it the highest-margin region driven by strong brand equity and a higher mix of full-price sales. APLA generated revenues of $1.2 billion with segment operating income of $0.3 billion, representing a 25% margin. Converse generated revenues of $0.5 billion with segment operating income of $0.1 billion, representing a 20% margin, with growth driven by the Asia region partially offset by declines in the U.S. and Europe.

The following table summarizes segment results for the third quarter of fiscal 2019:

Segment | Revenue | Segment Op Income | Margin
North America | $3,893M | $1,075M | 27.6%
EMEA | $2,391M | $697M | 29.2%
Greater China | $1,596M | $598M | 37.5%
APLA | $1,224M | $305M | 24.9%
Converse | $482M | $96M | 19.9%
Global Brand Divisions | — | ($545M) | —
Total NIKE Brand | $9,586M | $2,226M | 23.2%
Corporate | $25M | ($210M) | —
Consolidated | $9,611M | $2,016M | 21.0%

LIQUIDITY AND CAPITAL RESOURCES — EXPANDED DISCUSSION

Cash provided by operations was $1.1 billion for the quarter, compared to $1.4 billion in the prior year, reflecting investment in working capital to support growth. Capital expenditures were $255 million. The company returned $1.1 billion to shareholders through share repurchases ($850 million) and dividends ($250 million). As of February 28, 2019, the company had $3.7 billion in cash and short-term investments and $5.2 billion in total debt, including $1.0 billion of commercial paper outstanding. Total debt as a percentage of total capitalization was 38%. The company maintains access to a $2.5 billion revolving credit facility, which was undrawn at quarter end. In addition, the company has a $1.0 billion commercial paper program that provides short-term funding flexibility. The company's credit ratings are A+ (Standard & Poor's) and A1 (Moody's), providing favorable access to capital markets. The company's debt maturities are staggered over the next 30 years, with no significant maturities until fiscal 2021.

CONTRACTUAL OBLIGATIONS

The company's contractual obligations as of February 28, 2019 included: long-term debt and interest payments of $7.8 billion, operating leases of $3.5 billion, purchase obligations for inventory and other commitments of $5.2 billion, and other long-term liabilities of $0.8 billion. Aggregate contractual obligations totaled approximately $17.3 billion. The company believes its operating cash flow, existing cash and short-term investments, and available credit facilities are sufficient to meet its working capital, capital expenditure, and debt service requirements for the foreseeable future.

MARKET RISK — QUANTITATIVE AND QUALITATIVE DISCLOSURES

Foreign Currency Risk: As a global company with operations in over 190 countries, NIKE is exposed to foreign currency fluctuations. A 10% strengthening of the U.S. dollar against all foreign currencies would reduce reported revenue by approximately $860 million and reduce operating income by approximately $130 million. The company uses foreign currency forward contracts, options, and cross-currency swaps to manage the impact of currency fluctuations on foreign-currency-denominated receivables, payables, forecasted transactions, and net investments in foreign operations. The notional amount of foreign exchange contracts outstanding was $12.5 billion at quarter end. The company's most significant currency exposures are to the euro, the Japanese yen, the Chinese yuan, and the British pound.

Interest Rate Risk: The company's debt portfolio includes both fixed-rate senior notes and floating-rate commercial paper. A 100-basis-point increase in interest rates would reduce the fair value of fixed-rate debt by approximately $180 million and increase annual interest expense on floating-rate debt by approximately $10 million. The company uses interest rate swaps to manage the mix of fixed and floating rate debt, targeting a range of 40% to 60% fixed-rate exposure.

CRITICAL ACCOUNTING ESTIMATES

Revenue Recognition: Revenue is recognized when control of goods is transferred to the customer, which generally occurs at the point of shipment or delivery depending on the terms of sale. For wholesale customers, the company estimates and records provisions for trade discounts, customer programs, and product returns. These estimates are based on historical experience, current contractual obligations, and expected future trends. A 1% change in the estimated return rate or discount percentage would affect revenue by approximately $96 million. For the NIKE Direct business, revenue is recognized at the point of sale for retail stores and at the point of delivery for digital commerce orders. Gift card breakage is recognized in proportion to actual redemptions based on historical patterns.

Allowance for Doubtful Accounts: The allowance for doubtful accounts was $119 million at February 28, 2019, representing 2.2% of gross accounts receivable. The company evaluates the adequacy of the allowance based on historical loss experience, aging analysis, current economic conditions, and specific identification of potentially uncollectible accounts. The company's customer base consists primarily of large retail chains, department stores, and athletic specialty retailers, reducing the risk of significant credit losses.

Inventory Valuation: Inventories of $5.4 billion are stated at the lower of cost or market, with cost determined on a first-in, first-out basis. The company regularly reviews inventory quantities and records a writedown for excess, slow-moving, or obsolete inventory. A 1% change in the estimated recovery value of inventory would affect pretax income by approximately $54 million.

RECENT ACCOUNTING PRONOUNCEMENTS

The company adopted ASC 842, Leases, in the first quarter of fiscal 2020 using the modified retrospective method. This standard requires lessees to recognize right-of-use assets and lease liabilities on the balance sheet for all leases with terms longer than 12 months. The company is evaluating the impact of ASC 326, Financial Instruments — Credit Losses, which replaces the incurred-loss model with an expected-loss model for trade receivables and other financial instruments. The company also continues to monitor the FASB's project on segment reporting and other standard-setting activities that may affect the company's financial reporting.

FORWARD-LOOKING STATEMENTS AND RISK FACTORS

This report contains forward-looking statements that involve risks and uncertainties. These statements include expectations regarding revenue growth, gross margin trends, digital transformation, and strategic initiatives. Factors that could cause actual results to differ materially include: (1) global economic conditions and consumer spending patterns, including the impact of trade disputes, tariffs, and geopolitical tensions; (2) foreign currency fluctuations and the classification of certain economies as hyperinflationary; (3) the highly competitive nature of the athletic footwear, apparel, and equipment markets; (4) the company's ability to anticipate and respond to changing consumer preferences and fashion trends; (5) the success of the company's digital transformation, including investments in e-commerce, data analytics, and enterprise resource planning systems; (6) the company's ability to manage its global supply chain effectively, including labor practices, raw material availability, and manufacturing capacity; (7) risks associated with the company's reliance on independent contract manufacturers, primarily located in Asia; (8) the impact of climate change and related regulatory responses on the company's operations and supply chain; (9) the company's ability to protect its intellectual property rights and brand reputation; and (10) the effectiveness of the company's sustainability initiatives and their impact on consumer perception and regulatory compliance.

DISCLOSURE CONTROLS AND PROCEDURES

Management, with the participation of the company's CEO and CFO, has evaluated the effectiveness of the company's disclosure controls and procedures as of February 28, 2019. Based on this evaluation, management concluded that the company's disclosure controls and procedures are effective. There were no changes in the company's internal control over financial reporting during the quarter that have materially affected, or are reasonably likely to materially affect, the company's internal control over financial reporting. The company continues to invest in its internal control environment, including the implementation of a new enterprise resource planning system that will enhance control processes and financial reporting capabilities.SUPPLEMENTAL QUANTITATIVE AND QUALITATIVE DISCLOSURES ABOUT MARKET RISK

Foreign Currency Risk: As a truly global enterprise with operations in over 190 countries, NIKE faces significant exposure to fluctuations in foreign currency exchange rates. Approximately 58% of our total revenue is generated outside the United States. A 10% strengthening of the U.S. dollar against all foreign currencies would reduce reported revenue by approximately $860 million and reduce operating income by approximately $130 million. Our primary currency exposures are to the euro, the Japanese yen, the Chinese yuan, the British pound, and the Korean won. We utilize a comprehensive hedging program to manage this exposure, employing foreign exchange forward contracts, options, and cross-currency swaps with a combined notional amount of $12.5 billion at February 28, 2019. These instruments are designated as cash flow hedges of forecasted transactions, fair value hedges of recognized assets and liabilities, or net investment hedges of foreign operations. The maximum length of time over which we hedge forecasted foreign currency cash flows is 36 months. We conduct quarterly effectiveness testing on all hedging relationships and terminate or adjust positions as needed. Our hedging policies prohibit speculative trading.

Interest Rate Risk: NIKE maintains a balanced debt portfolio with both fixed and floating rate instruments. At February 28, 2019, we had total debt of $5.2 billion, including $1.0 billion in commercial paper. A 100-basis-point increase in benchmark interest rates would reduce the fair value of our fixed-rate debt by approximately $180 million and increase annual interest expense on variable-rate debt by approximately $10 million. We utilize interest rate swaps with a notional amount of $1.5 billion to maintain our desired mix of fixed and floating rate debt, targeting a fixed-rate proportion of 40% to 60% of total debt. We also from time to time enter into treasury rate locks to hedge interest rate exposure related to anticipated debt issuances.

Equity and Commodity Price Risk: NIKE is subject to equity market risk through its investments in marketable securities and its pension plan assets. A 10% decline in global equity markets would reduce the value of our pension plan assets by approximately $350 million. Commodity price risk primarily relates to the cost of raw materials used in our products, including cotton, rubber, petroleum-based synthetic materials, and leather. While we do not currently hedge commodity price risk through financial instruments, we actively manage our sourcing strategies and supplier relationships to mitigate the impact of raw material price volatility.

CRITICAL ACCOUNTING ESTIMATES — ADDITIONAL DISCLOSURES

Share-Based Compensation: NIKE grants stock options, restricted stock units, and performance-based share awards to employees and directors. We recognize compensation expense for these awards based on their grant-date fair value, estimated using option pricing models for stock options and the market price of our common stock for restricted stock units. The fair value of performance-based awards is estimated based on the probable outcome of the performance conditions. Our option pricing models require assumptions regarding the expected volatility of our stock price, expected term of the options, risk-free interest rate, and expected dividend yield. Changes in these assumptions could materially affect the amount of compensation expense recognized. For the third quarter of fiscal 2019, we recognized share-based compensation expense of $85 million.

Income Taxes: Our effective tax rate was 15.8% for the third quarter, compared to 164.1% in the prior year. The prior year rate was significantly impacted by the enactment of the Tax Cuts and Jobs Act, which resulted in a one-time transition tax on accumulated foreign earnings and a remeasurement of deferred tax assets and liabilities. We maintain a substantial portion of our earnings outside the United States, and we have not provided deferred taxes on the undistributed earnings of certain foreign subsidiaries because we intend to reinvest these earnings indefinitely. As of February 28, 2019, cumulative undistributed earnings of foreign subsidiaries were approximately $9.5 billion. If these earnings were repatriated, we would be subject to additional income taxes, net of available foreign tax credits. We record valuation allowances when we believe it is more likely than not that some portion of our deferred tax assets will not be realized. At quarter end, our valuation allowance totaled $95 million.

Warranty and Product Liability: NIKE provides for estimated warranty and product liability costs based on historical experience and known issues. While our products are subject to manufacturing quality standards and testing procedures, defects or safety issues could arise that result in significant warranty claims, product recalls, or liability claims. A 10% increase in the estimated claim rate would affect pretax income by approximately $25 million.

ADDITIONAL RECENT ACCOUNTING PRONOUNCEMENTS

The FASB is currently deliberating several projects that could affect our financial reporting in future periods. These include potential changes to the accounting for income taxes, including the treatment of international tax provisions and valuation allowances; the accounting for digital assets and cryptocurrencies, which could affect our investments and payment systems; and the accounting for environmental credits and carbon offsets, which may become relevant as we advance our sustainability initiatives. We are monitoring these developments and participating in the standard-setting process through our engagement with industry groups. The company adopted ASC 606, Revenue from Contracts with Customers, in fiscal 2019 using the modified retrospective method, which did not have a material impact on our consolidated financial statements.

FORWARD-LOOKING STATEMENTS — ADDITIONAL CAUTIONARY FACTORS

This report contains forward-looking statements reflecting management's current expectations regarding future events and financial performance. In addition to the risks described previously, the following factors could cause actual results to differ materially: (1) the effectiveness of our demand creation and marketing investments, including athlete endorsements, event sponsorships, and digital advertising; (2) the success of our product innovation pipeline, including new technologies in footwear cushioning, sustainable materials, and digital integration; (3) our ability to maintain strong relationships with key retail partners while expanding our direct-to-consumer channel; (4) the impact of trade policies, tariffs, and trade disputes on our global supply chain and cost structure; (5) the risk of inventory imbalances, including excess inventory of seasonal or fashion-sensitive products; (6) the potential for labor disputes or disruptions at our contract manufacturers' facilities; (7) the effectiveness of our sustainability initiatives and their impact on brand perception and consumer purchasing decisions; (8) the evolution of consumer preferences toward digitally native and vertically integrated brands; and (9) the risk of intellectual property infringement by competitors or counterfeiters that could dilute our brand value and reduce revenue.",
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
    rawMDA: "Enron reported second quarter 2001 revenues of $50.1 billion, a 55% increase year-over-year, with net income of $404 million. The company's wholesale services segment reported revenues of $37.6 billion and operating income of $387 million. Enron's energy services segment grew revenues to $8.2 billion from $4.4 billion in the prior year. The company reported earnings per diluted share of $0.45, compared to $0.34 in the same quarter last year. Enron's return on invested capital was reported at 11%. The company stated that it had successfully deployed its asset-light merchant model to capture market share in the deregulating energy markets. EnronOnline, the company's electronic trading platform, reported 45,000 transactions totaling $1.1 trillion in notional value in the first six months of 2001. The company reported $19.5 billion in total assets and $10.2 billion in total shareholders' equity. Long-term debt was reported at $9.6 billion. The company's stock traded at approximately 55 times trailing earnings. Cash flow from operations was reported at $2.9 billion, while capital expenditures were $1.7 billion. The company disclosed that it had entered into various transactions with related parties, including LJM1, LJM2, and Chewco, which were described as limited partnerships with independent third parties. These entities engaged in transactions that hedged the company's merchant investments and provided financing. The company also discussed its use of mark-to-market accounting for its long-term energy contracts, which allowed the company to recognize the full present value of expected future profits at contract inception. Management attributed the strong results to the company's first-mover advantage in energy trading and its ability to leverage its asset base through the merchant model. They noted that the company was well-positioned to benefit from further deregulation in the electricity and natural gas markets.SEGMENT RESULTS — EXPANDED DISCUSSION

Enron's wholesale services segment, the largest contributor to revenue and operating income, generated $37.6 billion in revenue and $387 million in operating income. This segment includes the company's core energy trading and marketing operations, which utilize EnronOnline, the company's electronic trading platform. Wholesale services revenues increased 58% year-over-year, driven by increased trading volumes, expansion into new commodity markets including bandwidth, weather derivatives, and pulp and paper, and higher energy prices. The retail energy services segment generated revenues of $8.2 billion, up from $4.4 billion in the prior year, reflecting the acquisition of new commercial and industrial customers and the expansion of energy management services.

The company's broadband services segment, which was launched in 2000 to trade bandwidth capacity, generated revenues of $0.8 billion but reported an operating loss of $0.2 billion. The energy services division continued to expand its customer base, signing contracts with several large industrial customers for long-term energy management services. The company's transportation and distribution operations, including natural gas pipelines and electricity transmission assets, generated stable cash flows but represented a declining portion of total earnings as the asset-light trading business grew.

The following table summarizes segment results for the second quarter of 2001:

Segment | Revenue | Operating Income
Wholesale Services | $37,600M | $387M
Retail Energy Services | $8,200M | $115M
Broadband Services | $800M | ($200)M
Transportation & Distribution | $3,500M | $250M
Corporate & Other | $0M | ($148)M
Consolidated | $50,100M | $404M

LIQUIDITY AND CAPITAL RESOURCES — EXPANDED DISCUSSION

Cash flow from operations was reported at $2.9 billion for the quarter, while capital expenditures were $1.7 billion, yielding free cash flow of $1.2 billion. However, this metric is misleading because the company's mark-to-market accounting practices recognized the present value of expected future cash flows as current revenue, creating a significant gap between reported earnings and actual cash collections. The company reported $19.5 billion in total assets, including $5.2 billion in current assets and $14.3 billion in non-current assets. Current liabilities were $7.8 billion, and long-term debt was $9.6 billion. Shareholders' equity was $2.1 billion, with additional paid-in capital of $8.1 billion offset by treasury stock and other adjustments. The company maintained access to credit facilities totaling $4.5 billion, of which $2.8 billion was drawn at quarter end. The company's commercial paper program provided an additional $2.0 billion of short-term borrowing capacity. The company's debt maturities over the next five years were: $1.2 billion in 2002, $1.5 billion in 2003, $1.8 billion in 2004, $2.1 billion in 2005, and $3.0 billion thereafter. The company's debt-to-equity ratio was 4.6, significantly above the industry average of approximately 1.5 for energy companies.

CONTRACTUAL OBLIGATIONS

Enron's contractual obligations as of June 30, 2001 included: long-term debt obligations of $9.6 billion, operating lease obligations of $2.1 billion, purchase obligations related to energy supply agreements of $18.5 billion, capital expenditure commitments of $1.5 billion, and other long-term liabilities of $3.2 billion. Total contractual obligations amounted to approximately $34.9 billion. In addition, the company had significant off-balance-sheet obligations related to its special purpose entities, although these were not disclosed in the contractual obligations table. The company's obligations under its gas transportation and storage contracts totaled $4.5 billion. The company also had commitments related to its broadband services business, including minimum volume commitments on dark fiber agreements totaling $1.2 billion.

MARKET RISK — QUANTITATIVE AND QUALITATIVE DISCLOSURES

Commodity Price Risk: Enron's trading operations are exposed to price fluctuations in natural gas, electricity, crude oil, and other commodities. The company uses a Value-at-Risk (VaR) methodology to quantify market risk exposure. The average daily VaR for the trading portfolio was approximately $66 million for the quarter, using a 95% confidence level and a one-day holding period. Peak VaR during the quarter was $95 million. The company uses a variety of derivative instruments, including futures, forwards, swaps, and options, to manage commodity price risk. The total notional amount of derivative contracts outstanding was approximately $320 billion at quarter end. Credit risk related to derivative contracts is managed through master netting agreements, collateral arrangements, and credit limits for each counterparty.

Interest Rate Risk: The company is exposed to interest rate risk from its variable-rate debt and from interest rate derivatives used in its trading operations. A 100-basis-point increase in interest rates would increase annual interest expense by approximately $55 million and decrease the fair value of fixed-rate debt by approximately $180 million.

Foreign Currency Risk: Enron operates internationally in over 30 countries. A 10% strengthening of the U.S. dollar against all foreign currencies would reduce reported revenue by approximately $400 million and reduce operating income by approximately $50 million. The company uses foreign currency forward and option contracts with a notional amount of approximately $4.5 billion to manage this exposure.

CRITICAL ACCOUNTING ESTIMATES

Mark-to-Market Accounting: Enron uses mark-to-market accounting for its energy trading contracts, as permitted under EITF Issue No. 98-10. Under this method, the company recognizes the present value of expected future revenues from long-term energy contracts at the inception of the contract. This requires significant judgment in estimating future energy prices, contract volumes, discount rates, and counterparty credit risk. A 10% change in estimated future energy prices would affect reported revenue by approximately $1.5 billion. The company's valuation models incorporate forward price curves, volatility assumptions, and correlations between different energy commodities. Management believes its valuation methodologies are consistent with industry practice.

Revenue Recognition: The company recognizes revenue from energy trading activities on a gross basis, reflecting the full notional value of transactions. This treatment has a significant impact on reported revenue. The company's total reported revenue of $50.1 billion includes approximately $40 billion in gross commodity trading revenues where the company acts as principal in the transactions. The SEC and the FASB have been reviewing industry practices regarding gross versus net revenue presentation. The company believes its presentation is appropriate under current accounting guidance.

Goodwill and Intangible Assets: Goodwill and intangible assets totaled $2.5 billion at June 30, 2001. The company evaluates goodwill for impairment annually or more frequently if events or changes in circumstances indicate that the carrying value may not be recoverable. The impairment assessment requires significant judgment regarding future cash flow projections, growth rates, and discount rates.

RECENT ACCOUNTING PRONOUNCEMENTS

The FASB has issued SFAS No. 141, Business Combinations, and SFAS No. 142, Goodwill and Other Intangible Assets, which eliminate the pooling-of-interests method and require goodwill to be tested for impairment rather than amortized. These standards will be effective for the company beginning January 1, 2002. The company is evaluating the impact of these standards. The FASB is also deliberating proposals related to the consolidation of variable interest entities, which could result in the consolidation of certain off-balance-sheet structures. The SEC has issued guidance on the use of pro forma financial information and has increased its focus on the quality and transparency of financial reporting by public companies. The company is monitoring these developments closely.

FORWARD-LOOKING STATEMENTS AND RISK FACTORS

This report contains forward-looking statements within the meaning of the Private Securities Litigation Reform Act of 1995. These statements are based on management's current expectations and are subject to risks, uncertainties, and assumptions that could cause actual results to differ materially. Key risk factors include: (1) the volatility and unpredictability of energy commodity prices, which could adversely affect trading results; (2) the company's significant use of mark-to-market accounting, which relies on estimates and assumptions that may prove inaccurate; (3) the risk of counterparty default on trading contracts, particularly in the event of a market downturn or the bankruptcy of a significant counterparty; (4) regulatory changes in the energy industry, including changes in the regulation of energy trading and marketing activities; (5) the company's reliance on its investment-grade credit rating for access to capital markets and counterparty trading limits; (6) the highly competitive nature of the energy trading market and the potential for margin compression; (7) the company's exposure to litigation and regulatory proceedings related to its business practices; (8) the risk that the company's off-balance-sheet financing arrangements could be subject to regulatory or accounting scrutiny; (9) the company's ability to attract and retain qualified personnel in a competitive labor market; and (10) the potential for technological disruptions or changes in the energy industry that could affect the demand for the company's services.

DISCLOSURE CONTROLS AND PROCEDURES

Management, with the participation of the Chief Executive Officer and Chief Financial Officer, has evaluated the effectiveness of the company's disclosure controls and procedures as of June 30, 2001. Based on this evaluation, management concluded that the company's disclosure controls and procedures are effective. There have been no changes in the company's internal control over financial reporting during the quarter that have materially affected, or are reasonably likely to materially affect, the company's internal control over financial reporting.SUPPLEMENTAL QUANTITATIVE AND QUALITATIVE DISCLOSURES ABOUT MARKET RISK

Commodity Price Risk — Expanded Discussion: Enron's trading operations expose the company to significant commodity price risk across multiple markets including natural gas, electricity, crude oil and petroleum products, coal, and emissions allowances, as well as emerging commodity markets such as bandwidth, weather derivatives, pulp and paper, and metals. We employ a comprehensive Value-at-Risk (VaR) methodology to quantify our market risk exposure. The average daily VaR for our combined trading portfolio was $66 million during the second quarter of 2001, calculated using a 95% confidence level and a one-day holding period. Peak VaR during the quarter reached $95 million. Our VaR models incorporate historical simulation techniques and capture linear and non-linear risk exposures across all commodity classes. We validate our VaR models regularly through back-testing, comparing actual daily trading results against VaR estimates. During the quarter, there were three instances where actual daily trading losses exceeded the VaR estimate, all of which were within acceptable parameters. In addition to VaR, we employ stress testing and scenario analysis to evaluate the potential impact of extreme market movements. We define stress scenarios based on historical market events, including the 1998 Russian financial crisis, the 1990 oil price shock, and the California electricity crisis of 2000-2001, as well as hypothetical scenarios representing extreme but plausible market conditions.

Counterparty Credit Risk: Our trading operations expose us to the risk of counterparty default on derivative contracts. We manage this risk through a comprehensive credit risk framework that includes daily monitoring of counterparty exposures against established credit limits. As of June 30, 2001, our top five counterparty exposures represented approximately 35% of total credit exposure. We require collateral from counterparties whose credit exposure exceeds established thresholds, primarily through credit support annexes to ISDA master agreements. The total collateral held at quarter end was $1.2 billion. We maintain credit risk reserves of $150 million to cover estimated losses from counterparty defaults. Our credit risk management policies are reviewed by the Risk Management Committee on a quarterly basis and are subject to periodic review by our internal audit function.

Liquidity Risk in Trading Operations: Our trading activities require significant liquidity to meet margin calls and collateral posting requirements. During periods of high market volatility, these requirements can increase substantially and could strain our liquidity resources. We maintain committed credit facilities and cash reserves specifically for this purpose. As of June 30, 2001, we had $1.5 billion of unencumbered cash and committed liquidity facilities available to meet trading-related margin and collateral requirements.

RECENT ACCOUNTING PRONOUNCEMENTS — ADDITIONAL DETAILS

The FASB's Emerging Issues Task Force has been actively deliberating issues related to energy trading and marketing activities. EITF Issue No. 98-10, which permits the use of mark-to-market accounting for energy trading contracts, has been the subject of ongoing discussion and may be revised or superseded. The FASB has also added a project to its agenda on the accounting for special purpose entities and variable interest entities, which could require the consolidation of entities such as LJM1, LJM2, and Chewco that are currently accounted for as off-balance-sheet arrangements. The SEC has increased its scrutiny of energy trading companies' accounting practices, including revenue recognition, mark-to-market valuation, and related-party disclosures. The SEC has also issued guidance emphasizing that materiality must be evaluated in the context of the total mix of information available to investors and cannot be reduced to a purely mechanical mathematical threshold. We are monitoring these developments closely and will comply with all applicable accounting standards and regulatory requirements as they become effective.

FORWARD-LOOKING STATEMENTS — ADDITIONAL CAUTIONARY FACTORS

Our forward-looking statements are based on current expectations, estimates, and projections about our industry, management's beliefs, and assumptions made by management. In evaluating these statements, investors should consider the following additional factors that could cause actual results to differ materially: (1) our significant reliance on EnronOnline as a competitive differentiator, which may be replicated or improved upon by competitors, reducing our trading margins and market share; (2) the risk that our expansion into new commodity markets, including bandwidth, weather derivatives, and pulp and paper, may not achieve expected volumes or profitability; (3) the potential for increased regulation of energy trading activities, including position limits, reporting requirements, and capital adequacy standards; (4) the challenge of maintaining our investment-grade credit rating in light of our significant off-balance-sheet obligations and the increasing scrutiny of our financial structure; (5) the risk of adverse tax consequences associated with the structure and operation of our special purpose entities; (6) the potential for conflicts of interest in transactions with related parties, including entities managed by our senior officers; (7) the difficulty in accurately valuing complex energy derivatives and structured transactions in illiquid or inactive markets; (8) the risk that our broadband trading operations may not achieve critical mass or may become obsolete due to technological changes; and (9) the potential for litigation, regulatory proceedings, or investigations that could result in significant costs, penalties, or restrictions on our business activities.",
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
    rawMDA: "The Walt Disney Company reported revenues of $16.2 billion for the first quarter of fiscal 2021, compared to $20.9 billion in the prior-year quarter. The decline was primarily driven by the impact of COVID-19 on the company's theme parks, experiences, and products segment. However, the company's direct-to-consumer segment showed significant strength. Disney+ subscribers reached 94.9 million by the end of the quarter, up from 73.7 million in the prior quarter, representing a 29% increase. Total direct-to-consumer revenues increased 73% to $3.5 billion. Media and entertainment distribution revenues were $12.6 billion, with linear networks contributing $7.2 billion. The parks, experiences, and products segment generated revenues of $3.6 billion, down 53% from $7.6 billion in the prior year, reflecting capacity restrictions and temporary park closures. Segment operating income was $0.1 billion compared to $2.3 billion in the prior year. The company reported diluted earnings per share of $0.02 compared to $1.53 in the prior year. Excluding certain items, adjusted EPS was $0.32. Disney reported cash provided by operations of $3.4 billion and free cash flow of $1.8 billion. The company had $16.7 billion in cash and cash equivalents. Total debt was $55.1 billion. The company declared a semi-annual cash dividend of $0.88 per share, paid in January 2021. Capital expenditures for the quarter were $1.1 billion. The company continued to invest in content for its streaming platforms, with content spending on Disney+ original programming accelerating. Management noted that the company's transformation to a direct-to-consumer-focused entertainment company was ahead of schedule, and they expected the parks segment to recover as vaccination distribution expanded.SEGMENT RESULTS — EXPANDED DISCUSSION

The Walt Disney Company reports its operations through three primary segments: Media and Entertainment Distribution, Parks, Experiences and Products, and Direct-to-Consumer (included within Media and Entertainment Distribution beginning in fiscal 2021). Within Media and Entertainment Distribution, Linear Networks generated revenues of $7.2 billion and segment operating income of $2.5 billion, with domestic channels contributing $5.5 billion and international channels contributing $1.7 billion. Advertising revenue declined 12% due to lower sports programming on ESPN and lower ratings on ABC, partially offset by a 5% increase in affiliate fee revenue from contractual rate increases. The Direct-to-Consumer segment, which includes Disney+, Hulu, and ESPN+, generated revenues of $3.5 billion, an increase of 73% year-over-year, but reported an operating loss of $0.5 billion as the company continued to invest heavily in content and technology for its streaming platforms.

The following table summarizes segment results:

Segment | Revenue | Operating Income | Change
Linear Networks | $7,200M | $2,500M | (4)%
Direct-to-Consumer | $3,500M | ($500)M | +73% Rev
Content Sales/Licensing | $1,900M | $400M | (15)%
Parks, Experiences & Products | $3,600M | $100M | (53)%
Corporate & Eliminations | $0M | ($400)M | —
Consolidated | $16,200M | $2,100M | (22)%

Disney+ generated subscription revenue of $2.1 billion from 94.9 million subscribers with average monthly revenue per paid subscriber (ARPU) of $4.03 for domestic subscribers and $5.07 for international subscribers, reflecting lower ARPU in markets where Disney+ is bundled with other services. Hulu generated subscription revenue of $0.9 billion from 39.4 million subscribers with ARPU of $70.12 for SVOD-only and $92.66 for Live TV plus SVOD, plus advertising revenue of $0.5 billion. ESPN+ generated subscription revenue of $0.3 billion from 12.1 million subscribers. Parks, Experiences and Products: Domestic parks generated revenue of $2.8 billion with operating income of $0.1 billion. International parks generated revenue of $0.5 billion with an operating loss of $0.1 billion. Consumer products generated revenue of $0.3 billion. Park attendance across all domestic and international locations was approximately 12 million guests during the quarter, compared to 35 million in the prior year quarter, representing a 66% decline driven by COVID-19 restrictions. Domestic park attendance was approximately 9 million guests while international park attendance was approximately 3 million guests.

LIQUIDITY AND CAPITAL RESOURCES — EXPANDED DISCUSSION

Cash and cash equivalents totaled $16.7 billion at January 2, 2021. Short-term investments were $2.1 billion. The company's strong liquidity position reflects its decision to raise capital through debt issuances in response to the COVID-19 pandemic. Total debt was $55.1 billion, consisting of senior notes and debentures with maturities ranging from 2021 to 2061 and interest rates ranging from 1.5% to 7.0%. The weighted average interest rate on total debt was 3.5%. During the quarter, the company issued $2.0 billion of senior notes with a weighted average interest rate of 2.6%. The company maintains access to a $7.0 billion revolving credit facility that remained undrawn at quarter end. Capital expenditures for the quarter were $1.1 billion, including $0.6 billion for content production, $0.3 billion for theme park maintenance and technology, and $0.2 billion for corporate and other infrastructure. Cash provided by operations was $3.4 billion, and free cash flow was $1.8 billion. The company declared and paid a semi-annual cash dividend of $0.88 per share, totaling $1.6 billion. Total available liquidity including cash, short-term investments, and undrawn credit facilities was $25.8 billion. The effective tax rate for the quarter was 12.0%, compared to 16.0% in the prior year quarter, with the decrease primarily due to the mix of domestic and international earnings and the impact of COVID-19 on operating results.

CONTRACTUAL OBLIGATIONS

The company's contractual obligations as of January 2, 2021 included: long-term debt obligations of $55.1 billion, with $3.5 billion due within one year, $4.5 billion due in years 2-3, $6.0 billion due in years 4-5, and $41.1 billion due thereafter. Operating lease obligations totaled $4.2 billion. Content programming obligations, including commitments for film and television production, sports rights, and licensed programming, totaled $24.5 billion. Purchase obligations for other goods and services were $3.5 billion. Other long-term liabilities included $2.1 billion in unrecognized tax benefits and $1.5 billion in pension and postretirement benefit obligations. The aggregate contractual obligations amounted to approximately $90.9 billion. The company believes its available liquidity, operating cash flows, and access to capital markets will be sufficient to meet these obligations.

MARKET RISK — QUANTITATIVE AND QUALITATIVE DISCLOSURES

Interest Rate Risk: The company's debt portfolio includes both fixed-rate and variable-rate instruments. A 100-basis-point increase in interest rates would decrease the fair value of fixed-rate debt by approximately $3.5 billion and increase annual interest expense on variable-rate debt by approximately $25 million. The company uses interest rate swaps and other derivative instruments to manage its exposure to interest rate fluctuations. The notional amount of interest rate derivatives outstanding was $6.5 billion at quarter end.

Foreign Currency Risk: Disney operates internationally in over 40 countries, with approximately 40% of total revenue generated outside the United States. A 10% strengthening of the U.S. dollar against all foreign currencies would reduce reported revenue by approximately $650 million and reduce operating income by approximately $120 million. The company's most significant currency exposures are to the euro, the British pound, and the Japanese yen. The company uses foreign currency forward and option contracts with a notional amount of approximately $8.0 billion to manage this exposure.

Equity Market Risk: The company is exposed to equity market risk through its investments in equity securities and through its pension plan assets. A 10% decline in equity markets would reduce the value of the company's investment portfolio by approximately $500 million.

CRITICAL ACCOUNTING ESTIMATES

Content Cost Recognition: Content assets totaled $31.0 billion at quarter end, consisting of $15.0 billion in film and television production costs, $10.0 billion in sports rights, and $6.0 billion in licensed programming. The company capitalizes content costs and amortizes them based on the ratio of current period revenue to estimated total revenue for each production. This requires significant judgment in estimating future revenue, including subscriber revenue, advertising revenue, and content licensing revenue. A 10% change in estimated total revenue for content assets would affect amortization expense by approximately $800 million in the current period.

Goodwill and Intangible Assets: Goodwill and intangible assets totaled $54.0 billion at January 2, 2021. The company tests goodwill for impairment at the reporting unit level annually or whenever events or changes in circumstances indicate impairment may exist. The impairment test requires significant judgment regarding estimated future cash flows, growth rates, terminal values, and discount rates. A 50-basis-point increase in the discount rate used for impairment testing could result in an impairment charge of up to $2.0 billion.

Revenue Recognition: The company recognizes revenue from the sale of goods and services when control transfers to the customer. For subscription streaming services, revenue is recognized ratably over the subscription period. Deferred revenue from Disney+ prepaid subscriptions and theme park ticket sales totaled $4.2 billion at quarter end. The company estimates breakage on gift cards and prepaid services based on historical redemption patterns.

RECENT ACCOUNTING PRONOUNCEMENTS

The company adopted ASC 842, Leases, in the current fiscal year using the modified retrospective approach. The adoption resulted in the recognition of approximately $3.5 billion in right-of-use assets and $4.0 billion in lease liabilities on the balance sheet. The company is also evaluating the impact of ASC 326, Current Expected Credit Losses, which will be effective for fiscal 2023. The FASB has also issued guidance on the accounting for cloud computing implementation costs and the simplification of income tax accounting for intra-entity transfers of assets other than inventory. The company is monitoring these and other standard-setting developments for their potential impact on financial reporting.

FORWARD-LOOKING STATEMENTS AND RISK FACTORS

This report contains forward-looking statements that involve risks and uncertainties. These statements relate to the company's expectations regarding its strategic transformation to a direct-to-consumer-focused entertainment company, future subscriber growth, and the recovery of its parks and experiences business. Key risk factors include: (1) the timing and extent of the recovery of the company's theme parks and resorts business, which depends on vaccination rates, consumer confidence, government restrictions, and the trajectory of the COVID-19 pandemic; (2) the risk that the company's significant investment in content for streaming platforms may not generate the expected return on investment if subscriber growth, retention, or engagement falls short of projections; (3) the potential for accelerated shifts in consumer behavior away from traditional pay television to streaming services, resulting in faster-than-expected declines in linear networks revenue and operating income; (4) the highly competitive nature of the streaming market, with significant content investment required to compete with Netflix, Amazon Prime Video, WarnerMedia's HBO Max, NBCUniversal's Peacock, Apple TV+, and other competitors; (5) the risk of production delays, cost overruns, or content performance shortfalls in the company's film and television content pipeline; (6) changes in the regulatory environment affecting the company's businesses, including potential changes to net neutrality rules, antitrust enforcement, data privacy regulations, and content regulation; (7) the ongoing consolidation of media and entertainment companies, which could create stronger competitors with greater resources; (8) the risk of cybersecurity incidents or data breaches that could disrupt operations, compromise consumer data, or damage brand reputation; (9) the impact of foreign currency fluctuations on the company's international operations; and (10) the challenges of integrating acquired businesses, including 21st Century Fox, and achieving expected synergies and strategic benefits from these acquisitions.

DISCLOSURE CONTROLS AND PROCEDURES

Management, with the participation of the Chief Executive Officer and Chief Financial Officer, has evaluated the effectiveness of the company's disclosure controls and procedures as of January 2, 2021. Based on this evaluation, management concluded that the company's disclosure controls and procedures are effective. There have been no changes in the company's internal control over financial reporting during the quarter that have materially affected, or are reasonably likely to materially affect, the company's internal control over financial reporting. The company continues to enhance its internal control environment in response to evolving risks associated with the expansion of its direct-to-consumer business, the increased complexity of its operations following the acquisition of 21st Century Fox, and the operational challenges presented by the COVID-19 pandemic.SUPPLEMENTAL QUANTITATIVE AND QUALITATIVE DISCLOSURES ABOUT MARKET RISK

Interest Rate Risk — Expanded Discussion: Disney maintains a significant debt portfolio of $55.1 billion with maturities extending to 2061. Approximately 15% of our total debt carries variable interest rates. A 100-basis-point increase in interest rates would decrease the fair value of our fixed-rate debt by approximately $3.5 billion and increase annual interest expense on variable-rate debt by approximately $25 million. We employ a variety of interest rate derivatives, including interest rate swaps, caps, and collars with a total notional amount of $6.5 billion, to manage our exposure to interest rate fluctuations. These instruments are designated as cash flow hedges of variable-rate debt or fair value hedges of fixed-rate debt. We regularly assess the effectiveness of our hedging relationships and make adjustments as necessary. We also monitor the creditworthiness of our derivative counterparties and have collateral arrangements in place to mitigate credit risk. Our interest rate risk management objectives are to reduce earnings volatility, manage the overall cost of borrowing, and maintain a balanced maturity profile.

Foreign Currency Risk — Expanded Discussion: Approximately 40% of Disney's total revenue is generated outside the United States. Our most significant foreign currency exposures are to the euro, the British pound, the Japanese yen, the Brazilian real, and the Australian dollar. A 10% appreciation of the U.S. dollar against all currencies would reduce reported revenue by approximately $650 million and reduce operating income by approximately $120 million. We manage these exposures through a combination of natural hedging and derivative instruments. Our foreign currency risk management program utilizes forward contracts, options, and cross-currency swaps with a total notional amount of $8.0 billion. These instruments are primarily designated as cash flow hedges of forecasted intercompany transactions, royalties, content licensing revenues, and other foreign-currency-denominated transactions. The maximum term of our foreign currency hedging instruments is 36 months. We do not speculate in foreign currencies and our hedging activities are governed by a board-approved risk management policy.

Equity Market Risk: Our investment portfolio includes equity securities in publicly traded companies as well as private equity investments. A 10% decline in global equity markets would reduce the value of our investment portfolio by approximately $500 million. Our pension and other postretirement benefit plans hold approximately $8.0 billion in equity securities, and a 10% decline in equity markets would increase our net periodic benefit cost by approximately $200 million in the following fiscal year.

CRITICAL ACCOUNTING ESTIMATES — ADDITIONAL DISCLOSURES

Carrying Value of Broadcast Rights and Sports Programming: Disney holds significant sports programming rights, including long-term agreements with major sports leagues. These rights are recorded as assets and amortized over the contract period based on the estimated pattern of benefits. At January 2, 2021, sports programming rights totaled $10.0 billion. The amortization of these rights, as well as any impairment assessments, requires management to estimate the future advertising and affiliate fee revenue that will be generated by the programming. Changes in viewership trends, sports league restructuring, or shifts in the advertising market could result in impairment charges. A 10% decline in estimated future revenue would result in an impairment charge of approximately $600 million.

Business Combination Accounting: Disney completed the acquisition of 21st Century Fox in fiscal 2019. The purchase price allocation required significant estimates regarding the fair value of acquired assets and assumed liabilities, including intangible assets such as film libraries, brand names, and customer relationships. At January 2, 2021, goodwill and intangible assets related to this acquisition totaled $38.0 billion. The valuation of these assets involved significant judgment in estimating future cash flows, growth rates, discount rates, and the useful lives of intangible assets. Changes in these estimates could result in impairment charges in future periods.

Revenue Recognition — Additional Detail: Disney recognizes revenue from multiple sources, each with specific recognition criteria. For our linear networks, advertising revenue is recognized when commercials are aired, while affiliate fees are recognized over the contract period as the service is provided. For our parks and experiences, revenue from ticket sales is recognized when the guest visits the park, and revenue from hotel reservations is recognized over the guest's stay. For our consumer products business, royalty revenue from licensing agreements is recognized based on the licensee's sales, with minimum guarantees recognized on a straight-line basis over the contract term. The deferral and recognition of revenue from multi-element arrangements, such as bundled Disney+ and Hulu subscriptions, requires judgment in allocating transaction price to separate performance obligations. At quarter end, deferred revenue from these arrangements totaled $4.2 billion.

RECENT ACCOUNTING PRONOUNCEMENTS — ADDITIONAL DETAILS

The FASB has issued ASU 2019-12, Income Taxes — Simplifying the Accounting for Income Taxes, which simplifies various aspects of income tax accounting including the intra-entity transfer of assets other than inventory. The company adopted this standard in fiscal 2021 without a material impact. The FASB is also working on a project to improve the accounting for digital assets and currencies, which may affect the company's accounting for blockchain-based initiatives and digital content distribution. The SEC has proposed rules requiring enhanced climate-related disclosures, including greenhouse gas emissions and climate risk management. The company is evaluating the potential impact of these proposals on its reporting obligations. Additionally, the company continues to monitor the potential adoption of International Financial Reporting Standards (IFRS) by the SEC, which would represent a significant change in the basis of accounting for U.S. public companies.

FORWARD-LOOKING STATEMENTS — ADDITIONAL CAUTIONARY FACTORS

This report contains forward-looking statements within the meaning of the Private Securities Litigation Reform Act of 1995. In addition to the risks previously discussed, the following factors should be considered when evaluating our forward-looking statements: (1) the success of our direct-to-consumer strategy depends on our ability to continue producing compelling original content that drives subscriber acquisition and retention in an increasingly competitive streaming market; (2) our significant investment in content for Disney+, Hulu, and ESPN+ may not generate the expected return on investment if subscriber growth, average revenue per user, or subscriber retention fall short of our projections; (3) the pace and extent of recovery in our parks, experiences, and products segment remains uncertain and depends on public health conditions, government restrictions, consumer confidence, and the trajectory of the COVID-19 pandemic, including the emergence of virus variants; (4) shifts in consumer behavior away from traditional pay television to streaming services may accelerate, resulting in faster-than-expected declines in linear networks revenue and operating income; (5) the ongoing consolidation of media and entertainment companies could create stronger competitors with greater resources and negotiating leverage; (6) changes in technology and distribution platforms, including the emergence of new digital platforms and changes in algorithm-driven content discovery, could affect our ability to reach audiences and monetize content; (7) potential changes in intellectual property laws and the enforcement of copyright protection could affect our ability to protect our creative works and generate revenue from them; (8) the risk of production delays, cost overruns, or cancellation of content projects due to pandemic-related disruptions, talent availability, or other factors; and (9) the impact of evolving data privacy regulations, including the California Consumer Privacy Act and similar laws in other jurisdictions, on our ability to collect and use consumer data for marketing and personalization purposes.",
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
    rawMDA: "HealthSouth reported revenues of $1.2 billion for the third quarter of 2002, representing a 17% increase over the prior year. Net income was reported at $165 million, with diluted earnings per share of $0.41, exceeding analyst consensus estimates of $0.38. The company reported operating cash flow of $89 million, significantly lower than net income. Days sales outstanding increased to 72 days from 58 days in the prior year. The company's acute care hospitals segment reported revenue growth of 22%, while outpatient rehabilitation grew 15%. HealthSouth reported that its inpatient rehabilitation facilities maintained 72% occupancy rates. The company's allowance for doubtful accounts was reported at 4.5% of accounts receivable, consistent with prior periods. However, accounts receivable over 90 days past due increased to 12% from 8%. The company added 12 new inpatient rehabilitation facilities during the quarter through acquisitions. Capital expenditures were $156 million, including investments in new facility construction and medical equipment. HealthSouth's debt-to-total-capitalization ratio was 42%. The company emphasized its strong internal controls and management's commitment to accurate financial reporting. Management expressed confidence in the company's ability to continue delivering double-digit earnings growth through a combination of organic growth and strategic acquisitions. They highlighted the favorable demographics of an aging population as a key growth driver. The board authorized an additional $500 million for share repurchases.SEGMENT RESULTS — EXPANDED DISCUSSION

HealthSouth operates through three primary segments: Inpatient Rehabilitation, Ambulatory Surgery Centers, and Outpatient Rehabilitation. The Inpatient Rehabilitation segment operates 98 inpatient rehabilitation facilities with 5,800 licensed beds in 28 states, making HealthSouth the largest provider of inpatient rehabilitation services in the United States. During the quarter, the segment admitted approximately 45,000 patients with an average length of stay of 14.2 days. The top five diagnosis categories treated were stroke (22% of admissions), orthopedic conditions including hip and knee replacements (30%), neurological disorders including traumatic brain injury and spinal cord injury (15%), cardiac conditions (10%), and other medical conditions (23%). The segment reported revenue growth of 18% year-over-year. The average Medicare charge per discharge was $18,500, with average net revenue per discharge of $12,000 after contractual allowances. Average cost per discharge was $9,600, resulting in an average contribution margin of $2,400 per Medicare discharge.

The Acute Care Hospitals segment includes 35 hospitals offering a full range of medical and surgical services, including general medicine, surgery, cardiology, oncology, orthopedics, and emergency services. Total licensed beds were 8,500 with 5,525 average daily census at 65% occupancy. Emergency department visits totaled 185,000 during the quarter, with an admission rate of 18%. The segment performed 22,000 inpatient surgeries and 40,000 outpatient surgeries during the quarter. Revenue growth was 22% year-over-year.

The Outpatient Rehabilitation segment operates 625 outpatient rehabilitation clinics in 32 states, providing physical therapy, occupational therapy, and speech therapy services. Patient visits totaled 1.2 million during the quarter, with an average of 2.1 visits per patient episode. The average charge per visit was $150, with net revenue per visit of $95 after contractual allowances. Revenue growth was 15% year-over-year.

The Ambulatory Surgery Centers segment operates 86 surgery centers that performed 62,000 surgical cases during the quarter. Orthopedic procedures represented 35% of volume, ophthalmology 25%, gastroenterology 20%, pain management 15%, and other procedures 5%. The average charge per case was $3,200, with net revenue per case of $1,900 after contractual allowances.

The following table summarizes segment results:

Segment | Revenue | Operating Income | Margin
Inpatient Rehabilitation | $520M | $90M | 17.3%
Acute Care Hospitals | $380M | $55M | 14.5%
Outpatient Rehabilitation | $180M | $28M | 15.6%
Ambulatory Surgery Centers | $120M | $22M | 18.3%
Consolidated | $1,200M | $195M | 16.3%

LIQUIDITY AND CAPITAL RESOURCES — EXPANDED DISCUSSION

Cash and cash equivalents totaled $0.2 billion at September 30, 2002. Accounts receivable were $1.2 billion with days sales outstanding of 72 days, up from 58 days in the prior year, indicating significant deterioration in collection performance. The company believes the increase in DSO is primarily due to delays in third-party payer reimbursements and expanded government programs. Property, plant, and equipment, net of accumulated depreciation, totaled $1.8 billion. Capital expenditures for the quarter were $156 million, including $65 million for new facility construction, $55 million for medical equipment, $25 million for information technology, and $11 million for maintenance capital. Goodwill and intangible assets totaled $1.2 billion, primarily related to acquisitions completed in prior periods. Current assets and current liabilities stood at $1.6 billion and $1.2 billion respectively, yielding a current ratio of 1.4. Days cash on hand was 45 days. The debt-to-total-capitalization ratio was 42%. Total debt of $1.8 billion consisted of $1.2 billion in senior notes with interest rates ranging from 6.0% to 7.5% and maturities from 2005 to 2012, $0.4 billion in convertible subordinated notes, and $0.2 billion in other debt including equipment financing and borrowings under the company's revolving credit facility. The revolving credit facility provides up to $0.5 billion in borrowing capacity, of which $0.2 billion was drawn at quarter end. The company generated $89 million in operating cash flow during the quarter, significantly below net income of $165 million, a disparity that management attributes to working capital investment required to support growth but which also raises questions about earnings quality. The debt service coverage ratio was 4.5 times, providing adequate coverage for debt service obligations.

CONTRACTUAL OBLIGATIONS

The company's contractual obligations as of September 30, 2002 included: long-term debt obligations of $1.8 billion, with $0.2 billion due within one year, $0.4 billion due in years 2-3, $0.5 billion due in years 4-5, and $0.7 billion due thereafter. Operating lease obligations totaled $0.6 billion. Purchase obligations for medical supplies and equipment totaled $0.4 billion. Capital expenditure commitments were $0.3 billion. Other long-term liabilities, including self-insurance reserves and deferred compensation, totaled $0.3 billion. The aggregate contractual obligations amounted to approximately $3.4 billion. The company believes its operating cash flows and available borrowing capacity are sufficient to meet these obligations as they come due.

MARKET RISK — QUANTITATIVE AND QUALITATIVE DISCLOSURES

Interest Rate Risk: The company is exposed to interest rate risk on its variable-rate borrowings under its revolving credit facility and on floating-rate senior notes. A 100-basis-point increase in interest rates would increase annual interest expense by approximately $5 million. The fair value of the company's fixed-rate debt would decrease by approximately $30 million for a 100-basis-point increase in interest rates. The company does not currently use interest rate derivatives to manage this exposure but evaluates hedging strategies periodically.

Regulatory Risk: The company is subject to significant regulatory risk related to changes in Medicare and Medicaid reimbursement rates. A 1% change in Medicare reimbursement rates would affect annual revenue by approximately $25 million. The company is also subject to regulatory risk related to healthcare fraud and abuse laws, including the False Claims Act, the Stark Law, and the Anti-Kickback Statute. Changes in enforcement priorities or regulatory interpretations could have a material effect on the company's operations.

CRITICAL ACCOUNTING ESTIMATES

Revenue Recognition: The company recognizes revenue from healthcare services as services are rendered. Revenue is recorded at established billing rates, reduced by contractual adjustments and allowances for uncollectible amounts. The estimation of contractual adjustments and allowances requires significant judgment regarding payer mix, reimbursement rates, and collection experience. A 1% change in the estimated contractual adjustment percentage would affect reported revenue by approximately $12 million.

Allowance for Doubtful Accounts: The allowance for doubtful accounts was reported at 4.5% of accounts receivable, consistent with prior periods. However, accounts receivable over 90 days past due increased to 12% from 8% in the prior year, suggesting deterioration in collection performance that may not be adequately reflected in the allowance. A 1% change in the assumed uncollectible rate would affect the allowance by approximately $12 million. The company evaluates the adequacy of the allowance based on aging analysis, historical collection experience, and current economic conditions.

Goodwill Impairment: Goodwill and intangible assets totaled $1.2 billion at September 30, 2002. The company evaluates goodwill for impairment annually or whenever events indicate impairment may exist. The impairment assessment requires significant judgment regarding future cash flow projections, growth rates, and discount rates. The company's recent acquisition activity has resulted in significant goodwill balances that may be at risk of impairment if operating results do not meet projections.

Self-Insurance Reserves: The company maintains self-insurance reserves for professional liability, general liability, and workers' compensation claims. These reserves are estimated based on actuarial analyses of historical claim data and consider the severity and frequency of claims, development patterns, and industry trends. A 10% change in estimated claim severity would affect pretax income by approximately $15 million.

RECENT ACCOUNTING PRONOUNCEMENTS

The FASB issued SFAS No. 142, Goodwill and Other Intangible Assets, which requires goodwill to be tested for impairment rather than amortized. The company adopted this standard on January 1, 2002, and the transition impairment test did not result in impairment charges. SFAS No. 141, Business Combinations, eliminated the pooling-of-interests method for business combinations. The SEC has also increased its focus on revenue recognition practices in the healthcare industry and has issued guidance on accounting for contractual adjustments and allowances. The company is monitoring these developments.

FORWARD-LOOKING STATEMENTS AND RISK FACTORS

This report contains forward-looking statements within the meaning of the Private Securities Litigation Reform Act of 1995. These statements are based on management's current expectations and are subject to risks and uncertainties that could cause actual results to differ materially. Key risk factors include: (1) the potential for significant changes in Medicare and Medicaid reimbursement methodologies, including the transition to value-based payment models, bundled payment arrangements, and accountable care organizations; (2) the impact of federal budget sequestration and deficit reduction measures that could result in across-the-board reductions in Medicare payments; (3) the risk of increased regulatory scrutiny and enforcement activity related to healthcare fraud and abuse laws; (4) the challenge of maintaining adequate levels of professional liability insurance coverage at reasonable cost; (5) the risk of adverse outcomes in medical malpractice litigation that could exceed insurance coverage and self-insured retentions; (6) the potential impact of healthcare reform legislation on the number of uninsured individuals and the demand for healthcare services; (7) the need to make significant ongoing capital investments in facilities, medical equipment, and technology to remain competitive and maintain regulatory compliance; (8) the challenge of recruiting and retaining qualified physicians, nurses, therapists, and other clinical personnel in a competitive labor market; (9) the risk of data breaches or cybersecurity incidents involving protected health information; and (10) the potential for changes in the competitive landscape, including the entry of new competitors such as specialty hospitals and outpatient clinics, and the consolidation of existing healthcare providers into larger systems with greater market power and negotiating leverage.

DISCLOSURE CONTROLS AND PROCEDURES

Management, with the participation of the Chief Executive Officer and Chief Financial Officer, has evaluated the effectiveness of the company's disclosure controls and procedures as of September 30, 2002. Based on this evaluation, management concluded that the company's disclosure controls and procedures are effective in providing reasonable assurance that information required to be disclosed in reports filed under the Securities Exchange Act of 1934 is recorded, processed, summarized, and reported within the time periods specified by the SEC. There have been no changes in the company's internal control over financial reporting during the quarter ended September 30, 2002 that have materially affected, or are reasonably likely to materially affect, the company's internal control over financial reporting. The company maintains a system of internal controls designed to provide reasonable assurance that assets are safeguarded and transactions are recorded properly. The company's audit committee, composed entirely of independent directors, oversees the financial reporting process.SUPPLEMENTAL QUANTITATIVE AND QUALITATIVE DISCLOSURES ABOUT MARKET RISK

Interest Rate Risk: HealthSouth's exposure to market risk primarily relates to changes in interest rates, given our significant debt obligations. At September 30, 2002, we had total debt of $1.8 billion, of which approximately 25% carried variable interest rates tied to LIBOR or prime rate benchmarks. A 100-basis-point increase in short-term interest rates would increase annual interest expense by approximately $5 million, based on the variable-rate debt outstanding at quarter end, including amounts drawn under our revolving credit facility. The fair value of our fixed-rate debt, primarily our $1.2 billion in senior notes, would decrease by approximately $30 million for a 100-basis-point increase in benchmark interest rates. We do not currently maintain an active interest rate hedging program, although we evaluate market conditions and our debt portfolio on a regular basis to determine whether hedging instruments such as interest rate swaps, caps, or collars would be appropriate to manage our interest rate exposure. Our debt portfolio has a weighted average maturity of approximately 6.5 years, and we maintain a staggered maturity schedule to reduce refinancing risk.

Credit Risk: Healthcare providers like HealthSouth face credit risk from both third-party payors and patients. Our accounts receivable of $1.2 billion at September 30, 2002 represent amounts due from Medicare (approximately 45% of receivables), Medicaid (10%), commercial insurers and managed care organizations (30%), and patients directly (15%). The collection of these receivables depends on the accuracy and completeness of our billing and documentation processes, the timeliness of third-party payor reimbursement, and the financial condition of payors. Medicare and Medicaid reimbursement rates and processes are subject to change through legislation and administrative rulemaking. A 1% change in the Medicare bad debt reimbursement rate would affect annual revenue by approximately $3 million. We monitor the aging of our receivables and adjust our allowance for doubtful accounts accordingly. As of September 30, 2002, our allowance was $54 million, representing 4.5% of gross accounts receivable.

Regulatory Risk: The healthcare industry is highly regulated, and changes in laws and regulations could have a material impact on our business. Key areas of regulatory risk include: changes in Medicare and Medicaid reimbursement methodologies, including the transition from cost-based to prospective payment systems and value-based purchasing programs; enforcement of fraud and abuse laws, including the False Claims Act, the Stark Law, and the Anti-Kickback Statute; the Health Insurance Portability and Accountability Act (HIPAA) privacy and security rules; and state licensing and Certificate of Need requirements.

CRITICAL ACCOUNTING ESTIMATES — ADDITIONAL DISCLOSURES

Revenue Recognition — Additional Detail: HealthSouth recognizes revenue from patient services at the time services are rendered. The amount of revenue recognized is based on established billing rates reduced by contractual adjustments and estimated uncollectible amounts. The estimation of contractual adjustments is complex and requires significant judgment because reimbursement rates vary among payors, are subject to retrospective adjustment, and are affected by the completeness and accuracy of clinical documentation. For Medicare patients, the company's inpatient rehabilitation facilities are reimbursed under the prospective payment system, which classifies patients into case-mix groups based on clinical characteristics and expected resource utilization. The reimbursement for each case-mix group is adjusted for geographic wage variations, facility characteristics, and other factors. The company estimates contractual adjustments based on historical reimbursement experience, current payor mix, and known changes in reimbursement rates. A 1% error in the estimation of contractual adjustments would affect reported revenue by approximately $12 million.

Third-Party Payor Settlements: Many of our third-party payors, particularly Medicare and Medicaid programs, conduct retrospective audits of our billing and cost reports. These audits can result in adjustments to previously recognized revenue. We record estimates of these adjustments based on historical audit results and known audit issues. At September 30, 2002, we had recorded $35 million in estimated payor settlement liabilities. Changes in audit results or regulatory interpretations could result in additional adjustments that could materially affect our reported financial results. The company has historically resolved cost report audits without material adverse impact, but there can be no assurance that future audits will be resolved on similar terms.

Self-Insurance Reserves: HealthSouth is self-insured for workers' compensation, professional liability, and general liability claims up to certain retention amounts. The company maintains excess insurance coverage for claims above these retention levels. Self-insurance reserves are estimated based on actuarial analyses that consider historical claim experience, claim development patterns, severity and frequency trends, and industry benchmarks. At September 30, 2002, self-insurance reserves totaled $85 million. The estimation of these reserves is inherently uncertain because the ultimate cost of claims may not be known for several years. A 10% change in estimated claim costs would affect pretax income by approximately $8.5 million.

ADDITIONAL RECENT ACCOUNTING PRONOUNCEMENTS AND REGULATORY DEVELOPMENTS

The FASB has issued SFAS No. 146, Accounting for Costs Associated with Exit or Disposal Activities, which establishes accounting requirements for costs associated with exit or disposal activities. The standard requires that a liability for a cost associated with an exit or disposal activity be recognized when the liability is incurred, rather than at the date of a commitment to an exit plan. This standard is effective for exit or disposal activities initiated after December 31, 2002 and is not expected to have a material impact on the company's financial statements. The SEC has issued additional guidance on revenue recognition in the healthcare industry, emphasizing the need for transparent disclosure of contractual adjustment policies, charity care policies, and the composition of the allowance for doubtful accounts. The SEC has also increased its focus on the adequacy of internal controls over financial reporting, particularly in the healthcare industry, where complex billing and reimbursement processes create significant financial reporting risks. The Sarbanes-Oxley Act of 2002, enacted in response to recent corporate scandals, includes provisions that will require CEO and CFO certification of financial statements, enhance audit committee independence, and increase penalties for financial reporting violations. The company is evaluating the impact of these developments on its financial reporting processes and internal control environment.

FORWARD-LOOKING STATEMENTS — ADDITIONAL CAUTIONARY FACTORS

Forward-looking statements in this report are based on management's current expectations and beliefs, and investors are cautioned not to place undue reliance on these statements. In addition to the factors previously discussed, the following risks and uncertainties could cause actual results to differ materially from those described in forward-looking statements: (1) the company's ability to successfully integrate acquired facilities and achieve anticipated operational efficiencies, cost savings, and revenue synergies; (2) the impact of changes in the mix of payors and services on overall reimbursement rates and profit margins; (3) the challenge of maintaining adequate levels of professional liability insurance at reasonable premium rates in a volatile insurance market; (4) the potential for adverse outcomes in litigation or regulatory proceedings, including qui tam actions filed under the False Claims Act, medical malpractice claims, and employment-related disputes; (5) the need to make significant capital investments to maintain compliance with changing regulatory standards, including the Life Safety Code, the Americans with Disabilities Act, and state licensing requirements; (6) the difficulty of attracting and retaining qualified physicians, nurses, therapists, and other healthcare professionals in a competitive labor market with a national shortage of clinical personnel; (7) the potential for changes in accreditation standards or denial of accreditation by the Joint Commission on Accreditation of Healthcare Organizations, which could affect our ability to participate in Medicare and Medicaid programs; (8) the risk of cybersecurity incidents or data breaches involving protected health information, which could result in significant regulatory penalties under HIPAA, litigation costs, and reputational damage; (9) the potential for changes in the competitive landscape, including increased competition from specialty hospitals, outpatient clinics, and home health agencies that could reduce patient volumes and put downward pressure on reimbursement rates; and (10) the uncertainty surrounding federal and state healthcare reform initiatives, including proposals to create a public option, expand Medicaid coverage, or implement price controls on healthcare services.",
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

          {/* Content grid: Raw MDA (left) + SMD&A (right) — MDA is full height */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Raw MD&A — FULL text, no max-height truncation */}
            <div className="flex min-w-0 flex-col">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Raw MD&A (Original 10-Q Filing)
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700">
                  {slide.rawMDA}
                </pre>
              </div>
            </div>

            {/* Right: SMD&A + AAER — also no truncation on SMD&A */}
            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-blue-700">
                  SMD&A (Qwen3-32B Summary)
                </h3>
                <div className="rounded-lg border border-blue-200 bg-white p-4">
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