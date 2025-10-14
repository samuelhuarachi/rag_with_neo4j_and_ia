import { z } from "zod";

export default class IncommingQuestionValidation {

    questionRules = z.object({
        dateInitial: z.date().optional(),
        dateFinish: z.date().optional(),
        nick: z.string().min(3).max(50).optional(),
        oral: z.enum(["yes", "no"]).optional(),
        anal: z.enum(["yes", "no"]).optional(),
        kiss: z.enum(["yes", "no"]).optional(),
        grade: z.number().min(0).max(10).optional()
    });

    constructor() {}

    execute(incoming) {
        const result = this.questionRules.safeParse(incoming);
        // if (!result.success) return res.status(400).json({ errors: result.error.errors });
        if (!result.success) return null;

        return result.data;
    }
}
