import type { VerificationReport } from "./types";

interface RealWorldClaim {
  claim: string;
  verdict: VerificationReport["analysis"]["verdict"];
  confidence: number;
  subClaims: VerificationReport["analysis"]["subClaims"];
  redFlags: VerificationReport["analysis"]["redFlags"];
  contextNote: string;
  isRecirculation: boolean;
  sources: VerificationReport["analysis"]["sources"];
  directFactCheckLinks: VerificationReport["analysis"]["directFactCheckLinks"];
}

const REAL_CLAIMS: RealWorldClaim[] = [
  {
    claim: "The AIDS virus HIV has never been proven to cause AIDS",
    verdict: "FAKE",
    confidence: 88,
    contextNote: "The HIV-to-AIDS causal link is one of the most well-established scientific facts in medicine, supported by decades of research, animal studies, and successful treatment outcomes.",
    isRecirculation: true,
    subClaims: [
      {
        assertion: "HIV has never been proven to cause AIDS",
        rating: "FALSE",
        explanation: "The causal relationship between HIV and AIDS has been definitively established through multiple lines of evidence including animal models, transmission studies, and antiretroviral treatment outcomes.",
        supportingSources: ["https://aidsinfo.nih.gov/hiv-aids-basics/understanding-hiv-aids/facts-about-hiv-aids"],
      },
    ],
    redFlags: [
      { type: "sensational", text: "Conspiracy-style language typical of HIV/AIDS denialism", severity: "high" },
      { type: "no_attribution", text: "No named scientific source or study referenced", severity: "high" },
    ],
    sources: [
      { title: "NIH — HIV and AIDS: The Basics", url: "https://aidsinfo.nih.gov/hiv-aids-basics/understanding-hiv-aids/facts-about-hiv-aids", tier: "T1", verdict: "DENY", snippet: "HIV weakens a person's immune system by destroying important cells that fight disease and infection." },
      { title: "CDC — HIV Treatment", url: "https://www.cdc.gov/hiv/basics/livingwithhiv/treatment.html", tier: "T1", verdict: "DENY", snippet: "Effective HIV treatment involves taking HIV medicine that prevents HIV from replicating." },
      { title: "Snopes — HIV/AIDS Denialism", url: "https://snopes.com/news/fact-check/hiv-aids-denialism", tier: "T1", verdict: "DENY", snippet: "HIV/AIDS denialism is a conspiracy theory that contradicts the scientific consensus on HIV and AIDS." },
    ],
    directFactCheckLinks: [
      { title: "Snopes — HIV/AIDS Denialism", url: "https://snopes.com/news/fact-check/hiv-aids-denialism" },
      { title: "WHO — HIV/AIDS Fact Sheet", url: "https://www.who.int/news-room/fact-sheets/detail/hiv-aids" },
    ],
  },
  {
    claim: "Vaccines cause autism and other neurological disorders",
    verdict: "FAKE",
    confidence: 91,
    contextNote: "The claim that vaccines cause autism originated from a fraudulent 1998 study by Andrew Wakefield that was later retracted. Over a dozen large-scale studies involving millions of children have found no link between vaccines and autism.",
    isRecirculation: true,
    subClaims: [
      {
        assertion: "Vaccines cause autism in children",
        rating: "FALSE",
        explanation: "Extensive research involving millions of children across multiple countries has consistently found no causal link between vaccines and autism. The original study was based on fabricated data and was retracted by The Lancet.",
        supportingSources: ["https://www.cdc.gov/vaccinesafety/concerns/autism.html"],
      },
      {
        assertion: "The original Wakefield study was legitimate science",
        rating: "FALSE",
        explanation: "Andrew Wakefield's 1998 study was found to be fraudulent — he had undisclosed financial conflicts of interest and manipulated data. His medical license was revoked.",
        supportingSources: ["https://www.thelancet.com/journals/lancet/article/PIIS0140673610601754/abstract"],
      },
    ],
    redFlags: [
      { type: "sensational", text: "Common anti-vaccine claim using debunked study as evidence", severity: "high" },
      { type: "no_attribution", text: "No reference to specific study, date, or author", severity: "high" },
    ],
    sources: [
      { title: "CDC — Vaccines Do Not Cause Autism", url: "https://www.cdc.gov/vaccinesafety/concerns/autism.html", tier: "T1", verdict: "DENY", snippet: "Many studies have looked at the possible link between thimerosal and autism. Results have shown that thimerosal does NOT cause autism." },
      { title: "Snopes — vaccines-autism link", url: "https://snopes.com/news/fact-check/vaccines-autism/", tier: "T1", verdict: "DENY", snippet: "Claims that vaccines cause autism are based on a retracted 1998 study by Andrew Wakefield that was found to be fraudulent." },
      { title: "PolitiFact — vaccine-autism", url: "https://www.politifact.com/factchecks/2019/mar/01/vaccines-and-autism/", tier: "T2", verdict: "DENY", snippet: "The claim that vaccines cause autism is supported by no credible scientific evidence." },
      { title: "Reuters — autism and vaccines", url: "https://www.reuters.com/article/factcheck/autism-vaccines", tier: "T1", verdict: "DENY", snippet: "The link between vaccines and autism has been thoroughly debunked by scientific studies." },
    ],
    directFactCheckLinks: [
      { title: "CDC — Vaccines Do Not Cause Autism", url: "https://www.cdc.gov/vaccinesafety/concerns/autism.html" },
      { title: "PolitiFact — Vaccine-autism claim", url: "https://www.politifact.com/factchecks/2019/mar/01/vaccines-and-autism/" },
    ],
  },
  {
    claim: "The 2020 US presidential election was stolen through widespread voter fraud",
    verdict: "FAKE",
    confidence: 93,
    contextNote: "No evidence of widespread fraud that could have changed the election outcome has been found. Multiple courts, including those with Republican judges, rejected over 60 lawsuits alleging fraud. The Department of Justice found no systemic fraud.",
    isRecirculation: false,
    subClaims: [
      {
        assertion: "Widespread voter fraud occurred in the 2020 US election",
        rating: "FALSE",
        explanation: "Multiple audits, recounts, and court cases found no evidence of widespread fraud. The Department of Homeland Cybersecurity review concluded the election was 'the most secure in American history.'",
        supportingSources: ["https://www.cisa.gov/news-events/news/statement-dhs-and-odni-elections"],
      },
      {
        assertion: "Audit evidence proves the election was stolen",
        rating: "FALSE",
        explanation: "The Arizona Cyber Ninjas audit (disputed) and similar efforts in other states found no evidence of fraud sufficient to change results. Courts dismissed multiple claims for lack of evidence.",
        supportingSources: ["https://www.nytimes.com/2021/08/13/us/politics/arizona-recount-results.html"],
      },
    ],
    redFlags: [
      { type: "no_attribution", text: "No specific evidence or official source cited", severity: "high" },
      { type: "sensational", text: "Loaded language used to support unverified fraud claims", severity: "high" },
      { type: "emotional", text: "Appeal to political identity rather than evidence", severity: "medium" },
    ],
    sources: [
      { title: "CISA — Election Security Statement", url: "https://www.cisa.gov/news-events/news/statement-dhs-and-odni-elections", tier: "T1", verdict: "DENY", snippet: "The November 3rd election was the most secure in American history. There is no evidence that any voting system deleted or changed votes." },
      { title: "AP News — 2020 Election Fact Check", url: "https://apnews.com/article/fact-check-biden-win-6bc01fc4d30e8c9d", tier: "T1", verdict: "DENY", snippet: "The 2020 election was free and fair with no evidence of systematic fraud that changed the outcome." },
      { title: "Reuters — Election Fraud Claims", url: "https://www.reuters.com/article/factcheck/usa-election-2020/", tier: "T1", verdict: "DENY", snippet: "Extensive fact-checking has found no evidence of widespread voter fraud in the 2020 US election." },
      { title: "PolitiFact — Election Fraud Rulings", url: "https://www.politifact.com/factchecks/2021/jan/06/donald-trump/fact-check-trumps-stolen-election-claims/", tier: "T2", verdict: "DENY", snippet: "Over 60 court cases alleging election fraud were dismissed, many by Republican-appointed judges." },
    ],
    directFactCheckLinks: [
      { title: "AP News — 2020 Election Fact Check", url: "https://apnews.com/article/fact-check-biden-win-6bc01fc4d30e8c9d" },
      { title: "Reuters — Election Fraud Fact Check", url: "https://www.reuters.com/article/factcheck/usa-election-2020/" },
    ],
  },
  {
    claim: "Global warming is a hoax and Earth's climate has not been changing",
    verdict: "FAKE",
    confidence: 96,
    contextNote: "Global warming is unequivocally supported by temperature records, ice core data, satellite measurements, and ocean heat content measurements. 2023 was the hottest year on record, and the warming trend has accelerated dramatically since the Industrial Revolution.",
    isRecirculation: true,
    subClaims: [
      {
        assertion: "Earth's climate has not been warming over the past century",
        rating: "FALSE",
        explanation: "Global average temperatures have risen approximately 1.1°C since pre-industrial times. Multiple independent datasets (NASA, NOAA, UK Met Office, satellite) all show the same trend.",
        supportingSources: ["https://climate.nasa.gov/evidence/"],
      },
      {
        assertion: "Global warming is a hoax with no scientific basis",
        rating: "FALSE",
        explanation: "The warming trend is supported by 97%+ of climate scientists and every major scientific organization on Earth. Ice cores, tree rings, and coral records all corroborate the temperature record.",
        supportingSources: ["https://www.ipcc.ch/report/sixth-assessment-report/"],
      },
    ],
    redFlags: [
      { type: "no_attribution", text: "No scientific source or data referenced", severity: "high" },
      { type: "sensational", text: "Dismissive language ignoring overwhelming scientific consensus", severity: "high" },
    ],
    sources: [
      { title: "NASA — Climate Change Evidence", url: "https://climate.nasa.gov/evidence/", tier: "T1", verdict: "DENY", snippet: "Climate change evidence includes global temperature rise, warming oceans, shrinking ice sheets, and rising sea levels." },
      { title: "IPCC AR6 Report", url: "https://www.ipcc.ch/report/sixth-assessment-report/", tier: "T1", verdict: "DENY", snippet: "Human-caused climate change is unequivocally real and poses severe risks to ecosystems and human societies." },
      { title: "Reuters — Climate Fact Check", url: "https://www.reuters.com/article/factcheck/climate/", tier: "T1", verdict: "DENY", snippet: "The scientific consensus on climate change is overwhelming, with 97%+ of climate scientists agreeing on human-caused warming." },
      { title: "Snopes — Climate Change Denial", url: "https://snopes.com/news/fact-check/climate-change-denial/", tier: "T1", verdict: "DENY", snippet: "Claims that climate change is a hoax contradict the settled science and multiple independent lines of evidence." },
    ],
    directFactCheckLinks: [
      { title: "NASA — Climate Change Evidence", url: "https://climate.nasa.gov/evidence/" },
      { title: "IPCC Sixth Assessment Report", url: "https://www.ipcc.ch/report/sixth-assessment-report/" },
    ],
  },
  {
    claim: "The Earth is flat and NASA feeds the public fake space footage",
    verdict: "FAKE",
    confidence: 98,
    contextNote: "The flat Earth claim is one of the most thoroughly debunked conspiracy theories. There is direct photographic evidence from space, GPS satellites that only work with a spherical Earth model, and thousands of flights daily that confirm spherical geometry.",
    isRecirculation: false,
    subClaims: [
      {
        assertion: "The Earth is flat, not a sphere",
        rating: "FALSE",
        explanation: "The Earth is an oblate spheroid. This is proven by: circumnavigation, lunar eclipses, varying star constellations by latitude, GPS, and direct photographs from space.",
        supportingSources: ["https://www.nasa.gov/fundamentals/flat-earth/"],
      },
      {
        assertion: "NASA creates fake footage of space",
        rating: "FALSE",
        explanation: "Space agencies from multiple countries (Russia, China, ESA, Japan) independently provide space imagery. Airlines use spherical Earth calculations for navigation — they would fail on a flat Earth model.",
        supportingSources: ["https://www.nasa.gov/fundamentals/space-derived-benefits-0/"],
      },
    ],
    redFlags: [
      { type: "sensational", text: "Conspiracy theory language with no verifiable evidence", severity: "high" },
      { type: "no_attribution", text: "No specific source given for any claim", severity: "high" },
    ],
    sources: [
      { title: "NASA — Space Place", url: "https://www.nasa.gov/fundamentals/flat-earth/", tier: "T1", verdict: "DENY", snippet: "NASA's space exploration has given us an accurate understanding of Earth's shape — an oblate spheroid, not flat." },
      { title: "Snopes — Flat Earth", url: "https://snopes.com/news/fact-check/flat-earth-conspiracy/", tier: "T1", verdict: "DENY", snippet: "The flat Earth theory contradicts centuries of scientific evidence, photography, and basic physics." },
      { title: "Reuters — Space Facts", url: "https://www.reuters.com/article/factcheck/space/", tier: "T1", verdict: "DENY", snippet: "Multiple independent space agencies provide consistent evidence of Earth's spherical shape." },
    ],
    directFactCheckLinks: [
      { title: "NASA — Earth Facts", url: "https://www.nasa.gov/fundamentals/flat-earth/" },
      { title: "Snopes — Flat Earth Conspiracy", url: "https://snopes.com/news/fact-check/flat-earth-conspiracy/" },
    ],
  },
];

export function getMockReport(claim: string): VerificationReport {
  // Match exact or fuzzy match to real claim
  const lower = claim.toLowerCase();

  // Find matching claim
  const matched = REAL_CLAIMS.find((rc) =>
    rc.claim.toLowerCase().includes(lower.slice(0, 40)) ||
    lower.slice(0, 40).includes(rc.claim.toLowerCase().slice(0, 40))
  );

  const base = matched ?? REAL_CLAIMS[Math.floor(Math.random() * REAL_CLAIMS.length)];

  const queries = [
    { type: "raw_claim" as const, query: claim },
    { type: "fact_check_topic" as const, query: `fact check ${claim}` },
    { type: "named_entity" as const, query: `${claim} site:snopes.com OR site:reuters.com OR site:apnews.com OR site:politifact.com OR site:factcheck.org OR site:bbc.co.uk/reality-check` },
    { type: "fact_checker_sweep" as const, query: `${claim} false OR fake OR misleading OR debunked site:snopes.com OR site:reuters.com` },
  ];

  return {
    id: `demo-${Date.now()}`,
    claim,
    timestamp: new Date().toISOString(),
    queries,
    searchResults: queries.map((q) => ({ ...q, results: [] })),
    analysis: {
      verdict: base.verdict,
      confidence: base.confidence,
      subClaims: base.subClaims,
      redFlags: base.redFlags,
      sources: base.sources,
      directFactCheckLinks: base.directFactCheckLinks,
      contextNote: base.contextNote,
      isRecirculation: base.isRecirculation,
      rawResponse: JSON.stringify({ matched: !!matched, verdict: base.verdict }),
    },
    processingTimeMs: Math.floor(Math.random() * 1500) + 400,
  };
}
