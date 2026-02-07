const PdfParse = require("pdf-parse");
const chat = require("./chat");

const readResume = async (buffer) => {
    try {
        const pdfData = await PdfParse({ data: buffer });
        const resumeText = pdfData.text
        return (resumeText)
    } catch (error) {
        return new Error(error)
    }
}
const resumeParser = async (resumeTxt) => {
    const userPrompt = `you are an ai resume analysis engine , you need to extract data from this resume: ${resumeTxt} do not make assumestions `
    const resumeBasicSchema = {
        name: "resume_basic_info",
        schema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Full name of the candidate"
                },
                email: {
                    type: "string",
                    description: "Email address of the candidate"
                },
                phone: {
                    type: "string",
                    description: "Phone number with or without country code"
                },
                skills: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "List of technical or professional skills"
                },
                experience_years: {
                    type: "number",
                    description: "Total years of professional experience if there is no clear experiance than use 0 for fresher"
                },
                education: {
                    type: "string",
                    description: "Highest education qualification"
                },
                projects: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "List of notable projects"
                },
                profile: {
                    type: "string",
                    description: "what ever the person is saying about him"
                },
                socials: {
                    type: "object",
                    properties: {
                        linkedin: { type: "string" },
                        github: { type: "string" },
                        portfolio: { type: "string" }
                    }
                },
            },
            required: [
                "name",
                "email",
                "phone",
                "skills",
                "experience_years",
                "education",
                "projects",
                "socials",
            ],
            additionalProperties: false
        }
    };

    const Analysis = await chat(userPrompt, null, resumeBasicSchema)
    return Analysis
}
const assessResume = async (structuredResume) => {
    const systemPrompt = `you are an ai resume analyzer system. can you provide a score out of 100 % depending on skill relevance, experaince depth ,clarity,Consistency 
                AI Resume Score = 
Relevance (40%) +
Experience Depth (30%) +
Clarity (20%) +
Consistency (10%)
            `
    const userPrompt = `resume : ${JSON.stringify(structuredResume)}`

    const assessResumeSchema = {
        name: "assess",
        schema: {
            type: "object",
            properties: {
                score: {
                    type: "number",
                    description: "assess the resume and give the score outof 100 "
                },
                breakdown: {
                    type: 'object',
                    skills_relevance: {
                        type: "number",
                        description: "Score for relevance of skills (out of 40)"
                    },
                    experience_depth: {
                        type: "number",
                        description: "Score for depth of experience (out of 30)"
                    },
                    clarity: {
                        type: "number",
                        description: "Score for resume clarity and readability (out of 20)"
                    },
                    consistency: {
                        type: "number",
                        description: "Score for formatting and consistency (out of 10)"
                    }
                }
            },
            required: [
                "score", "skills_relevance", "experience_depth", "clarity", "consistency"
            ],
            additionalProperties: false
        }
    };

    const Score = await chat(userPrompt, systemPrompt, assessResumeSchema)
    return Score

}
const analyzeATS = async (structuredResume) => {
    const userPrompt = `resume: ${JSON.stringify(structuredResume)}`
    const systemPrompt = `you are an ai resume analyzer system. you have to analyze and return the ats score of provided resume outof 100`
    const atsSchema = {
        name: "ats",
        schema: {
            type: "object",
            properties: {
                ATS_Score: {
                    type: "number",
                    description: "provide the ats score outof 100 "
                },
                missing_keywords: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    discription: "what are the keywords can be skills or other words"
                },
                recommendations: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    discription: "what words should be added"
                },
                percentage: {
                    type: "number",
                    description: "what percentage of ats keywords do match"
                }
            },
            required: [
                "ATS_Score", "missing_keywords", "recommendations"
            ],
            additionalProperties: false
        }
    }

    const atsScore = await chat(userPrompt, systemPrompt, atsSchema)
    return atsScore
}
const Feedback = async (structuredResume, atsScore, score) => {

    const systemPrompt = `you are an ai resume analyzer system. you are provided with the structured resume ,ats score and overall score of a resume provide relevant feedback if experiance is less than 1 year dont mention it`
    const userPrompt = ``
    const FeedbackSchema = {
        name: "feedback",
        schema: {
            type: "object",
            properties: {
                pros: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "what are the goodthings about the resume ,identify for which this resume is applicable"
                },
                cons: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "what are the bad things about the resume"
                },
                Resume_Section_Prioritization: {
                    type: "string",
                    description: "what section should be where and which should go down or up for recuriters "
                },
                Score_Suggestion: {
                    type: "string",
                    description: "provide suggestion if needed for score betterment"
                },
                grammer_Suggestion: {
                    type: "string",
                    description: "if there are grammer error tell which one and what to replace with"
                },
                suggestions: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "general suggestion about design structure if there are"
                }
            },
            required: ["pros", "cons", "suggestions", "Resume_Section_Prioritization"],
            additionalProperties: false
        }
    }

    const FeedbackData = await chat(userPrompt, systemPrompt, FeedbackSchema, 0.3)
    return FeedbackData

}
const jdMatching = async (structuredResume, jd) => {

    const systemPrompt = `you are an ai resume analyzer system. you are provided with the resume text structured in json formate also the jobe description 
        reply : is resume matches the job description , what should be the changes in order to match it to
    `
    const userPrompt = `resume : ${JSON.stringify(structuredResume)} ,job description:${jd}`
    const jdSchema = {
        name: "jd",
        schema: {
            type: "object",
            properties: {
                percentage: {
                    type: "number",
                    description: "how much percentage the resume matches to the job description"
                },
                matched_skills: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "how many skills matched"
                },
                missing_skills: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: "what skills are missing in order to meet the job discription"
                },


            },
            required: ["percentage", "missing_skills"],
            additionalProperties: false
        }
    }
    let data = await chat(userPrompt, systemPrompt, jdSchema)
    return data


}
module.exports = { readResume, resumeParser, assessResume, analyzeATS, Feedback, jdMatching }