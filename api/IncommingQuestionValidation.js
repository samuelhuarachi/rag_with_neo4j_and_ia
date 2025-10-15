import { z } from "zod";

export default class IncommingQuestionValidation {

    questionRules = z.object({
        question: z.string().optional(),
        dateInitial: z.preprocess(
            (val) => val ? new Date(val) : undefined, // converte string para Date
            z.date().optional() // valida que agora é Date
        ),
        dateFinish: z.preprocess(
            (val) => val ? new Date(val ) : undefined,
            z.date().optional()
        ),
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
        if (!result.success) {
            console.log(result.error.errors);
            return null;
        }

        return result.data;
    }
}
