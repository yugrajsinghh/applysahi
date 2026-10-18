export type ExamPreset = {
  maximumKb: number;
  width?: number;
  height?: number;
  format: 'JPG' | 'PNG';
};

export type ExamAsset = {
  name: string;
  requirement: string;
  dimensions?: string;
  dimensionNote?: string;
  preset?: ExamPreset;
};

export type ExamRequirement = {
  name: string;
  authority: string;
  family: string;
  cycle: string;
  confidence: 'Exact bulletin' | 'Authority guide' | 'Portal check needed';
  sourceLabel: string;
  sourceUrl: string;
  note: string;
  assets: ExamAsset[];
};

const ntaStandardAssets: ExamAsset[] = [
  {
    name: 'Photograph',
    requirement: 'JPG · 10–200 KB · recent colour or clear black-and-white',
    preset: { maximumKb: 200, format: 'JPG' },
  },
  {
    name: 'Signature',
    requirement: 'JPG · 4–30 KB · clear full signature',
    preset: { maximumKb: 30, format: 'JPG' },
  },
  {
    name: 'Certificates',
    requirement:
      'PDF · commonly 10–300 KB or 50–300 KB; check the named bulletin',
  },
];

const sscSignature6: ExamAsset[] = [
  {
    name: 'Photograph',
    requirement:
      'Captured live in the SSC form · good light · plain background · eye-level camera · full frontal face · no cap, mask or glasses',
  },
  {
    name: 'Signature',
    requirement: 'JPG/JPEG · 10–20 KB · about 6 × 2 cm',
    preset: { maximumKb: 20, format: 'JPG' },
  },
];

const sscSignature4: ExamAsset[] = [
  {
    name: 'Photograph',
    requirement:
      'Captured live in the SSC form · good light · plain background · eye-level camera · full frontal face · no cap, mask or glasses',
  },
  {
    name: 'Signature',
    requirement: 'JPG/JPEG · 10–20 KB · about 4 × 2 cm',
    preset: { maximumKb: 20, format: 'JPG' },
  },
];

const upscAssets: ExamAsset[] = [
  {
    name: 'Photograph',
    requirement:
      'JPG · 20–300 KB · recent photo on white background; current notice may add recency/name-date rules',
    preset: { maximumKb: 300, format: 'JPG' },
  },
  {
    name: 'Signature',
    requirement: 'JPG · 20–300 KB',
    preset: { maximumKb: 300, format: 'JPG' },
  },
];

const bankAssets: ExamAsset[] = [
  {
    name: 'Photograph',
    requirement: 'JPG/JPEG · 20–50 KB · 200 × 230 px preferred',
    preset: { maximumKb: 50, width: 200, height: 230, format: 'JPG' },
  },
  {
    name: 'Signature',
    requirement:
      'JPG/JPEG · 10–20 KB · 140 × 60 px preferred · black ink · no capitals',
    preset: { maximumKb: 20, width: 140, height: 60, format: 'JPG' },
  },
  {
    name: 'Left thumb',
    requirement: 'JPG/JPEG · 20–50 KB · 240 × 240 px preferred',
    preset: { maximumKb: 50, width: 240, height: 240, format: 'JPG' },
  },
  {
    name: 'Declaration',
    requirement:
      'JPG/JPEG · 50–100 KB · 800 × 400 px preferred · handwritten in English',
    preset: { maximumKb: 100, width: 800, height: 400, format: 'JPG' },
  },
];

const verifyAssets: ExamAsset[] = [
  {
    name: 'Photograph / signature',
    requirement:
      'The public official page does not state a safe reusable size. Check the active application portal before editing.',
  },
];

function exam(
  name: string,
  authority: string,
  family: string,
  cycle: string,
  confidence: ExamRequirement['confidence'],
  sourceLabel: string,
  sourceUrl: string,
  note: string,
  assets: ExamAsset[],
): ExamRequirement {
  return {
    name,
    authority,
    family,
    cycle,
    confidence,
    sourceLabel,
    sourceUrl,
    note,
    assets,
  };
}

const ntaSource =
  'https://exams.nta.ac.in/CUET-PG/images/ib-of-cuet-pg-2025.pdf';
const sscCommonSource =
  'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf';
const upscSource =
  'https://upsc.gov.in/sites/default/files/FAQ-Examination-engl-090724.pdf';
const ibpsSource =
  'https://www.ibps.in/wp-content/uploads/DetailedNotification_CRP_CSA_XV_Final_for_Website_1.8.2025-1.pdf';
const sbiSource =
  'https://sbi.co.in/documents/77530/52947104/JA%2B2025%2B-Detailed%2BAdvt.pdf/8f7ff18f-1972-21c8-9212-5a8cf85a7099?t=1754398573326';

export const examRequirements: ExamRequirement[] = [
  exam(
    'NEET (UG)',
    'NTA',
    'Medical',
    '2026',
    'Exact bulletin',
    'NEET 2026 Information Bulletin',
    'https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602231394640855.pdf',
    'Live photo is also required. The uploaded passport photo must show about 80% of the face, including ears, on white background.',
    [
      {
        name: 'Passport photograph',
        requirement:
          'JPG/JPEG · 10–200 KB · taken after 1 Jan 2026 · colour or B/W · 80% face',
        dimensions: 'Not specified by NTA for 2026',
        dimensionNote:
          '200–300 px wide by 300–400 px high is common web guidance, but it is not stated in the official 2026 bulletin.',
        preset: { maximumKb: 200, format: 'JPG' },
      },
      {
        name: 'Signature',
        requirement: 'JPG/JPEG · 10–100 KB',
        preset: { maximumKb: 100, format: 'JPG' },
      },
      {
        name: 'Fingers & thumb impression',
        requirement: 'JPG/JPEG · 10–200 KB',
        preset: { maximumKb: 200, format: 'JPG' },
      },
      {
        name: 'Certificates / supporting documents',
        requirement: 'PDF · 50–300 KB',
      },
    ],
  ),
  exam(
    'JEE (Main)',
    'NTA',
    'Engineering',
    '2026',
    'Exact bulletin',
    'JEE Main 2026 Information Bulletin',
    'https://cdnbbsr.s3waas.gov.in/s3f8e59f4b2fe7c5705bf878bbd494ccdf/uploads/2025/11/202511021649722475.pdf',
    'Live photo is required. The uploaded passport photo must show about 80% of the face, including ears, on white background.',
    [
      {
        name: 'Passport photograph',
        requirement: 'JPG/JPEG · 10–200 KB · colour · 80% face',
        preset: { maximumKb: 200, format: 'JPG' },
      },
      {
        name: 'Signature',
        requirement: 'JPG/JPEG · 10–100 KB',
        preset: { maximumKb: 100, format: 'JPG' },
      },
      {
        name: 'Class X certificate / marksheet',
        requirement: 'PDF · 50–300 KB',
      },
      {
        name: 'Identity proof when required',
        requirement: 'JPG/JPEG · 10–200 KB',
        preset: { maximumKb: 200, format: 'JPG' },
      },
    ],
  ),
  exam(
    'JEE (Advanced)',
    'IIT Roorkee',
    'Engineering',
    '2026',
    'Portal check needed',
    'JEE Advanced 2026 Information Brochure',
    'https://jeeadv.ac.in/documents/IBEnglish_2026.pdf',
    'The brochure lists registration certificates but does not publish a separate reusable photo/signature file-size preset. Follow the registration portal.',
    verifyAssets,
  ),
  exam(
    'GATE',
    'IIT Guwahati',
    'Engineering',
    '2026',
    'Exact bulletin',
    'GATE 2026 photo and signature guide',
    'https://gate2026.iitg.ac.in/photograph-and-signature.html',
    'The photo must have a white background and the face must occupy 60–70%. The size ranges below are mandatory, not just preferred.',
    [
      {
        name: 'Photograph',
        requirement:
          'JPG/JPEG · 5–600 KB · 200×260 to 530×690 px · aspect ratio 0.66–0.89',
        dimensions: '200×260 to 530×690 px',
        preset: { maximumKb: 600, width: 530, height: 690, format: 'JPG' },
      },
      {
        name: 'Signature',
        requirement:
          'JPG/JPEG · 3–300 KB · 250×80 to 580×180 px · dark blue/black',
        dimensions: '250×80 to 580×180 px',
        preset: { maximumKb: 300, width: 580, height: 180, format: 'JPG' },
      },
    ],
  ),
  exam(
    'IIT JAM',
    'IIT Bombay',
    'Engineering',
    '2026',
    'Exact bulletin',
    'JAM 2026 document requirements',
    'https://jam2026.iitb.ac.in/DocReq.html',
    'The live requirements page and brochure differ on the signature minimum size. ApplySahi uses the live page range and flags this conflict.',
    [
      {
        name: 'Photograph',
        requirement:
          'JPG/JPEG · 50–200 KB · 240×320 to 480×640 px · 3.5×4.5 cm · light background',
        dimensions: '240×320 to 480×640 px',
        preset: { maximumKb: 200, width: 480, height: 640, format: 'JPG' },
      },
      {
        name: 'Signature',
        requirement:
          'JPG/JPEG · live page says 50–150 KB · 280×80 to 560×160 px · 7×2 cm',
        dimensions: '280×80 to 560×160 px',
        preset: { maximumKb: 150, width: 560, height: 160, format: 'JPG' },
      },
    ],
  ),
  exam(
    'UCEED',
    'IIT Bombay',
    'Design',
    '2026',
    'Exact bulletin',
    'UCEED 2026 registration requirements',
    'https://www.uceed.iitb.ac.in/2026/registration.html',
    'The official page specifies formats and composition but no public file-size limit, so there is no one-click size preset.',
    [
      {
        name: 'Photograph',
        requirement:
          'JPEG (.jpg) · recent colour · full frontal · head centred · face 70–80% · within six months',
      },
      {
        name: 'Signature',
        requirement: 'JPEG (.jpg) · full signature on white paper',
      },
      { name: 'Certificates', requirement: 'PDF (.pdf)' },
    ],
  ),
  exam(
    'CEED',
    'IIT Bombay',
    'Design',
    '2026',
    'Portal check needed',
    'CEED official website',
    'https://www.ceed.iitb.ac.in/2026/',
    'Use the current CEED registration portal. A safe reusable public size limit was not found in the brochure page reviewed.',
    verifyAssets,
  ),
  exam(
    'CUET (PG)',
    'NTA',
    'University',
    '2025',
    'Exact bulletin',
    'CUET PG 2025 Information Bulletin',
    ntaSource,
    'The official bulletin gives a complete NTA upload profile.',
    ntaStandardAssets,
  ),
  exam(
    'CUET (UG)',
    'NTA',
    'University',
    '2025',
    'Authority guide',
    'NTA exams portal — open the current CUET UG bulletin',
    'https://exams.nta.ac.in/',
    'NTA exams often use the profile shown below, but the current CUET UG bulletin must be checked before submission.',
    ntaStandardAssets,
  ),
  exam(
    'UGC NET',
    'NTA',
    'Eligibility test',
    'Dec 2024',
    'Exact bulletin',
    'UGC NET December 2024 Information Bulletin',
    'https://ugcnet.nta.ac.in/images/information-bulletin-for-ugc-net-december-hrvplurnzjd47qa6oja9ksy6m5x6aq19112024.pdf',
    'Photo must show about 80% of the face, including ears, on a white background.',
    ntaStandardAssets.slice(0, 2),
  ),
  exam(
    'Joint CSIR–UGC NET',
    'NTA',
    'Eligibility test',
    'June 2025',
    'Exact bulletin',
    'CSIR NET June 2025 Information Bulletin',
    'https://csirnet.nta.ac.in/images/infomration-bulletin-of-csir-june-2025.pdf',
    'The bulletin includes photograph, signature and certificate limits.',
    ntaStandardAssets,
  ),
  exam(
    'CMAT',
    'NTA',
    'Management',
    '2024',
    'Exact bulletin',
    'CMAT 2024 Information Bulletin',
    'https://exams.nta.ac.in/CMAT/images/Information-Bulletin-of-CMAT-2024.pdf',
    'Photo should show about 80% of the face, including ears, on white background.',
    ntaStandardAssets,
  ),
  exam(
    'GPAT',
    'NTA',
    'Pharmacy',
    '2025',
    'Authority guide',
    'GPAT official portal',
    'https://exams.nta.ac.in/GPAT/',
    'Open the current bulletin at the official portal because upload limits can change by cycle.',
    ntaStandardAssets,
  ),
  exam(
    'ICAR AIEEA (PG)',
    'NTA / ICAR',
    'Agriculture',
    '2025',
    'Exact bulletin',
    'ICAR AIEEA PG 2025 Information Bulletin',
    'https://exams.nta.ac.in/ICAR/images/ICAR-AIEEA-PG-2025-26.pdf',
    'This bulletin also asks for a left thumb impression.',
    [
      ...ntaStandardAssets.slice(0, 2),
      {
        name: 'Left thumb impression',
        requirement: 'JPG · 4–30 KB',
        preset: { maximumKb: 30, format: 'JPG' },
      },
      { name: 'Certificates', requirement: 'PDF · 50–300 KB' },
    ],
  ),
  exam(
    'ICAR AICE–JRF/SRF (PhD)',
    'NTA / ICAR',
    'Agriculture',
    '2025',
    'Authority guide',
    'ICAR official exam portal',
    'https://exams.nta.ac.in/ICAR/',
    'Confirm the active PhD bulletin. It is hosted alongside AIEEA and may reuse the NTA profile.',
    ntaStandardAssets,
  ),
  exam(
    'AIAPGET',
    'NTA',
    'Medical',
    '2025',
    'Authority guide',
    'AIAPGET 2025 official portal and FAQs',
    'https://exams.nta.ac.in/AIAPGET/',
    'The official FAQ confirms the portal and photo workflow; check its linked bulletin for the signature range before submission.',
    ntaStandardAssets,
  ),
  exam(
    'NCHM JEE',
    'NTA',
    'Hospitality',
    '2025',
    'Authority guide',
    'NCHM JEE official portal',
    'https://exams.nta.ac.in/NCHM/',
    'Check the current information bulletin. NTA profiles can change.',
    ntaStandardAssets,
  ),
  exam(
    'NCET',
    'NTA',
    'Teaching',
    '2025',
    'Authority guide',
    'NCET official portal',
    'https://exams.nta.ac.in/NCET/',
    'Check the current information bulletin. NTA profiles can change.',
    ntaStandardAssets,
  ),
  exam(
    'NIFT Entrance Examination',
    'NTA / NIFT',
    'Design',
    '2025',
    'Authority guide',
    'NIFT entrance official portal',
    'https://exams.nta.ac.in/NIFT/',
    'Check the current information bulletin because document categories differ by programme.',
    ntaStandardAssets,
  ),
  exam(
    'AISSEE',
    'NTA',
    'School',
    '2025',
    'Authority guide',
    'AISSEE official portal',
    'https://exams.nta.ac.in/AISSEE/',
    'Check the current information bulletin; school admissions may ask for additional certificates.',
    ntaStandardAssets,
  ),
  exam(
    'NSSNET',
    'NTA',
    'School',
    '2025',
    'Exact bulletin',
    'NSSNET 2025 Information Bulletin',
    'https://exams.nta.ac.in/NSSNET/images/information-bulletin-2025.pdf',
    'NSSNET uses smaller photo and thumb limits than the common NTA profile.',
    [
      {
        name: 'Photograph',
        requirement: 'JPG · 10–100 KB',
        preset: { maximumKb: 100, format: 'JPG' },
      },
      {
        name: 'Signature',
        requirement: 'JPG · 4–100 KB',
        preset: { maximumKb: 100, format: 'JPG' },
      },
      {
        name: 'Thumb impression',
        requirement: 'JPG · 3–30 KB',
        preset: { maximumKb: 30, format: 'JPG' },
      },
      { name: 'Certificates', requirement: 'PDF · 30–150 KB' },
    ],
  ),
  exam(
    'SSC CGL',
    'SSC',
    'Government jobs',
    '2026',
    'Exact bulletin',
    'SSC CGL 2026 Notice',
    sscCommonSource,
    'SSC captures the photograph live; ApplySahi is useful for the signature.',
    sscSignature6,
  ),
  exam(
    'SSC CHSL',
    'SSC',
    'Government jobs',
    '2026',
    'Authority guide',
    'SSC official notices',
    'https://ssc.gov.in/',
    'The new SSC application system uses live photo capture. Confirm the signature dimensions in the current CHSL notice.',
    sscSignature6,
  ),
  exam(
    'SSC MTS & Havaldar',
    'SSC',
    'Government jobs',
    '2026',
    'Authority guide',
    'SSC official notices',
    'https://ssc.gov.in/',
    'The new SSC application system uses live photo capture. Confirm the signature dimensions in the current MTS notice.',
    sscSignature6,
  ),
  exam(
    'SSC CPO',
    'SSC',
    'Government jobs',
    '2026',
    'Authority guide',
    'SSC official notices',
    'https://ssc.gov.in/',
    'The new SSC application system uses live photo capture. Confirm the signature dimensions in the current CPO notice.',
    sscSignature6,
  ),
  exam(
    'SSC Junior Engineer',
    'SSC',
    'Government jobs',
    '2026',
    'Authority guide',
    'SSC official notices',
    'https://ssc.gov.in/',
    'The new SSC application system uses live photo capture. Confirm the signature dimensions in the current JE notice.',
    sscSignature6,
  ),
  exam(
    'SSC Stenographer C & D',
    'SSC',
    'Government jobs',
    '2026',
    'Authority guide',
    'SSC official notices',
    'https://ssc.gov.in/',
    'The new SSC application system uses live photo capture. Confirm the signature dimensions in the current Stenographer notice.',
    sscSignature6,
  ),
  exam(
    'SSC Selection Post Phase XIV',
    'SSC',
    'Government jobs',
    '2026',
    'Exact bulletin',
    'SSC Selection Post Phase XIV 2026 Notice',
    'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_RHQ_2026_phase_xiv.pdf',
    'The notice explicitly gives the smaller 4 × 2 cm signature guide.',
    sscSignature4,
  ),
  exam(
    'SSC Combined Hindi Translators',
    'SSC',
    'Government jobs',
    '2026',
    'Exact bulletin',
    'SSC CHT 2026 Notice',
    'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cht_2026.pdf',
    'SSC captures the photograph live; ApplySahi is useful for the signature.',
    sscSignature6,
  ),
  exam(
    'SSC Constable GD',
    'SSC',
    'Government jobs',
    '2026',
    'Exact bulletin',
    'SSC Constable GD 2026 Notice',
    'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_CTGD_2026.pdf',
    'Signature guidance adds 300 DPI and horizontal alignment.',
    [
      sscSignature6[0],
      {
        name: 'Signature',
        requirement:
          'JPG/JPEG · 10–20 KB · about 6 × 2 cm · 300 DPI · horizontal',
        preset: { maximumKb: 20, format: 'JPG' },
      },
    ],
  ),
  ...[
    'Civil Services Examination',
    'Indian Forest Service',
    'Combined Defence Services',
    'NDA & Naval Academy',
    'CAPF (Assistant Commandants)',
    'Engineering Services Examination',
    'Combined Geo-Scientist',
    'Combined Medical Services',
    'Indian Economic / Statistical Service',
    'CISF AC(EXE) LDCE',
  ].map((name) =>
    exam(
      `UPSC ${name}`,
      'UPSC',
      'Government jobs',
      '2025 guide / check 2026 notice',
      'Authority guide',
      'UPSC examination application FAQ',
      upscSource,
      'UPSC notices share an online-application guide, but candidates must check the current exam notice for recency and any updated portal rules.',
      upscAssets,
    ),
  ),
  ...[
    'IBPS PO / MT',
    'IBPS Customer Service Associate',
    'IBPS Specialist Officer',
    'IBPS RRB Office Assistant',
    'IBPS RRB Officer Scale I–III',
  ].map((name) =>
    exam(
      name,
      'IBPS',
      'Banking',
      '2025–26',
      'Authority guide',
      'IBPS CRP CSA XV Detailed Notification',
      ibpsSource,
      'The banking upload profile is reused across many IBPS registrations; confirm the exact current notice and live-photo step.',
      bankAssets,
    ),
  ),
  ...[
    'SBI Probationary Officer',
    'SBI Junior Associate',
    'SBI Circle Based Officer',
    'SBI Specialist Cadre Officer',
  ].map((name) =>
    exam(
      name,
      'SBI',
      'Banking',
      '2025',
      'Authority guide',
      'SBI Junior Associate 2025 detailed advertisement',
      sbiSource,
      'SBI notices commonly use this scan profile. Confirm the exact advertisement for the role you apply to.',
      bankAssets,
    ),
  ),
  exam(
    'RBI Assistant',
    'RBI',
    'Banking',
    '2026',
    'Portal check needed',
    'RBI Opportunities — Assistant 2026',
    'https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4912',
    'The official page is protected by an interactive verification step, so ApplySahi does not claim a numeric preset. Use the instructions shown inside the active application.',
    verifyAssets,
  ),
  exam(
    'RBI Grade B',
    'RBI',
    'Banking',
    'Current portal',
    'Portal check needed',
    'RBI Opportunities',
    'https://opportunities.rbi.org.in/',
    'Use the detailed current advertisement and application upload screen; no safe current preset was publicly extractable.',
    verifyAssets,
  ),
  exam(
    'XAT',
    'XLRI',
    'Management',
    '2027',
    'Exact bulletin',
    'XAT 2027 registration guide',
    'https://xatonline.in/registration',
    'The official page contains duplicated, conflicting text for the photo and signature limit. The entries below report that conflict; follow the active upload validator.',
    [
      {
        name: 'Photograph',
        requirement:
          'JPG/JPEG/PNG · official page says within 1 MB (a duplicate line also mentions 50 KB)',
        preset: { maximumKb: 1024, format: 'JPG' },
      },
      {
        name: 'Signature',
        requirement:
          'JPG/JPEG/PNG · black ink · page shows both “within 1 MB” and “20–50 KB”',
        preset: { maximumKb: 50, format: 'JPG' },
      },
    ],
  ),
  exam(
    'CAT',
    'IIMs',
    'Management',
    'Current portal',
    'Portal check needed',
    'CAT official website',
    'https://iimcat.ac.in/',
    'The current public page did not expose a safe upload preset. Use the registration guide for the active cycle.',
    verifyAssets,
  ),
  exam(
    'BITSAT',
    'BITS Pilani',
    'Engineering',
    'Current portal',
    'Portal check needed',
    'BITS Admissions',
    'https://www.bitsadmission.com/',
    'Check the active BITSAT application upload screen; no stable public image-size rule should be assumed.',
    verifyAssets,
  ),
  exam(
    'VITEEE',
    'VIT',
    'Engineering',
    'Current portal',
    'Portal check needed',
    'VITEEE official website',
    'https://viteee.vit.ac.in/',
    'Check the active VITEEE application upload screen; no stable public image-size rule should be assumed.',
    verifyAssets,
  ),
  exam(
    'CLAT',
    'Consortium of NLUs',
    'Law',
    'Current portal',
    'Portal check needed',
    'Consortium of NLUs',
    'https://consortiumofnlus.ac.in/',
    'Check the active CLAT registration instructions; no safe current preset was found in the public page reviewed.',
    verifyAssets,
  ),
];
