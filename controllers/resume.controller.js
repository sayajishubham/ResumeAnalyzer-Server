const { readResume, resumeParser, assessResume, analyzeATS, jdMatching, Feedback } = require("../utils/Resume")

const resumeController = {
    completeAnalysis: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Please provide file" })
            }
            const buffer = req.file.buffer
            const resumeTxt = await readResume(buffer)
            const structuredResume = await resumeParser(resumeTxt)
            const atsResult = await analyzeATS(structuredResume)
            const resumeScore = await assessResume(structuredResume)
            const { jd } = req.body
            const jdMatch = await jdMatching(structuredResume, jd)
            const feedbackData = await Feedback(structuredResume, atsResult, resumeScore)
            return res.status(200).json({
                message: "resume assesment is completed", ResumeData: {
                    basicInfo: structuredResume,
                    ATS: atsResult,
                    Score: resumeScore,
                    feedback: feedbackData,
                    jobDesciption: jdMatch

                }
            })


        } catch (error) {
            res.status(500).json({ error: error })
        }
    },
}

module.exports = resumeController