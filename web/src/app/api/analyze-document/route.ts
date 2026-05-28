import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docId = formData.get("docId") as string | null;
    const docName = formData.get("docName") as string | null;
    const applicantName = formData.get("applicantName") as string | null;
    const travelStartDate = formData.get("travelStartDate") as string | null;
    const photoSpecStr = formData.get("photoSpec") as string | null;
    const tipsStr = formData.get("tips") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const photoSpec = photoSpecStr ? JSON.parse(photoSpecStr) : null;
    const tips: string[] = tipsStr ? JSON.parse(tipsStr) : [];

    // 1. Convert the file into an ArrayBuffer, and then to a Base64 string
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    // 2. Classify document type and resolve the correct AI instructions
    const isPhoto =
      docId?.toLowerCase().includes("photo") ||
      docName?.toLowerCase().includes("photo") ||
      docName?.toLowerCase().includes("photograph");

    const isPassport =
      !isPhoto &&
      (docId?.toLowerCase().includes("passport") ||
        docName?.toLowerCase().includes("passport"));

    let systemPrompt = "";

    if (isPhoto) {
      const backgroundRule = photoSpec?.background || "plain white or light off-white";
      const widthRule = photoSpec?.widthMm ? `${photoSpec.widthMm}mm` : "standard passport photo size";
      const heightRule = photoSpec?.heightMm ? `${photoSpec.heightMm}mm` : "standard passport photo size";
      const extraRules = photoSpec?.requirements ? photoSpec.requirements.join(", ") : "";

      systemPrompt = `You are an expert visa application auditor. Analyze this Passport Photograph.
Verify if it meets standard embassy visa photograph requirements:
1. Background: The background must be ${backgroundRule}. Check if it is uniform and plain, with no patterns, shadows, or objects.
2. Aspect Ratio / Framing: The photo represents a target print size of ${widthRule} width by ${heightRule} height. Verify if the aspect ratio and crop are standard and face is centered, looking straight forward. Head and shoulders visible.
3. Quality & Lighting: No red-eye, no glare/reflection on face or glasses, no deep shadows on the face or background. Face must be clear and in sharp focus.
4. Compliance: No hats, caps, or hair covering facial features.
${extraRules ? `5. Country Specific Rules: ${extraRules}` : ""}
${tips && tips.length > 0 ? `6. Extra Checklist Notes: ${tips.join("; ")}` : ""}

You must return a JSON response with the following keys:
{
  "passed": boolean (true only if ALL critical criteria are met),
  "reason": string (a friendly summary explaining what is wrong if passed is false, or confirming it's perfect if true),
  "checks": {
    "correctBackground": boolean,
    "faceCentered": boolean,
    "goodLighting": boolean,
    "clearFocus": boolean,
    "noObscurations": boolean
  }
}`;
    } else if (isPassport) {
      const extraRules = tips && tips.length > 0 ? `Specific checklist rules to check:\n${tips.map((t: string, idx: number) => `- ${t}`).join("\n")}` : "";

      systemPrompt = `You are an expert visa application auditor. Analyze this Passport Page scan.
Verify if it is a valid passport bio page (or travel document):
1. Legibility: The name, passport number, dates of birth, issue date, and expiry date must be clear and easy to read.
2. Expiration Date Check: The passport must be valid for at least 6 months after the planned travel date. The planned travel date is: ${travelStartDate || "not provided"}.
3. Name Match: Verify if the name on the passport matches the applicant's name: "${applicantName || "not provided"}". If the names match closely (allowing minor spacing or formatting differences), set nameMatches to true.
4. Not Expired: Ensure the passport is currently valid and not expired.
${extraRules ? `5. Country Specific Rules:\n${extraRules}` : ""}

You must return a JSON response with the following keys:
{
  "passed": boolean (true only if it is a readable passport and is valid for travel),
  "reason": string (explain why it failed or confirm it passed),
  "checks": {
    "isReadable": boolean,
    "notExpired": boolean,
    "validForSixMonths": boolean,
    "nameMatches": boolean
  }
}`;
    } else {
      const tipsRules = tips && tips.length > 0
        ? `Specific requirements to verify:\n${tips.map((t: string, idx: number) => `- ${t}`).join("\n")}`
        : "";

      systemPrompt = `You are an expert visa application auditor. Analyze this uploaded document for a visa application.
The document type the user is submitting is: "${docName || "Supporting Document"}".
Verify if this document matches the requirements:
1. Correct Document Type: Does the uploaded file look like a "${docName}" (e.g. if it is a Bank Statement, does it show account transactions, balances, bank name? If it is a Flight Ticket, does it show flights?).
2. Name Match: Does the document show the applicant's name: "${applicantName || "not provided"}"?
3. Legibility: Is the document clear and legible (not blurry, not cut off)?
${tipsRules ? `4. Specific Guidelines:\n${tipsRules}` : ""}

You must return a JSON response with the following keys:
{
  "passed": boolean,
  "reason": string (explain why it failed or confirm it passed),
  "checks": {
    "correctDocType": boolean,
    "nameMatches": boolean,
    "isReadable": boolean,
    "meetsGuidelines": boolean
  }
}`;
    }

    // 3. Construct the Google Gemini REST API request body
    const geminiPayload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: file.type || "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    // 4. Send request to Gemini API (2.5 Flash is standard, fast, and multimodal in 2026)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error status:", geminiResponse.status, errorText);
      return NextResponse.json(
        { error: `Gemini API returned status ${geminiResponse.status}.` },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json(
        { error: "Could not retrieve audit results from the AI response." },
        { status: 500 }
      );
    }

    // 5. Parse the structured JSON returned from Gemini
    const auditResult = JSON.parse(responseText);

    return NextResponse.json(auditResult);
  } catch (error: any) {
    console.error("Error in analyze-document handler:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during document analysis." },
      { status: 500 }
    );
  }
}
