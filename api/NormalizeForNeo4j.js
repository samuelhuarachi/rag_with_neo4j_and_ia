

export default class NormalizeForNeo4j {
    question;

    constructor(question) {
        this.question = question;
    }

    execute() {
        return this.normalize();
    }

    normalize() {
        const yesNoMap = { yes: "sim", no: "não" };

        return Object.fromEntries(
            Object.entries(this.question)
                .filter(([key, value]) =>
                    value !== "" && value !== undefined && !["question", "dateInitial", "dateFinish"].includes(key)
                )
                .map(([key, value]) => {
                    if (["oral", "anal", "kiss"].includes(key)) {
                        const newKey = key === "kiss" ? "mouth_kiss" : key; // renomeia kiss
                        return [newKey, yesNoMap[value] || value]; // converte yes/no
                    }
                    if (key === "grade") {
                        return [key, Number(value)]; // garante que grade é número
                    }
                    if (key === "tds") {
                        return ["total_tds", Number(value)];
                    }
                    if (key === "nick") {
                        return ["userId", value];
                    }
                    return [key, value];
                })
        );
    }
}
