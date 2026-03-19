export interface PassengerRulesCountInterface{
    adt: number;
    inf: number;
    age_inf: number;
    mnr: {
        count: number;
        min_age: number | undefined;
        max_age: number | undefined;
    },
    mnr_rules: any;
}

export function getMaxCountsByRoom(data: RoomRuleInterface[]) {
    const result: Record<
        string,
        PassengerRulesCountInterface
    > = {};

    for (const roomKey of Object.keys(data)) {
        let maxAdt = 0;
        let maxInf = 0;
        let maxMnr = 0;
        let ageInf= 0;
        let minAge: number | undefined;
        let maxAge: number | undefined;
        let mnrRules = []

        // @ts-ignore
        for (const config of data[roomKey]) {
            // ADT
            if (config.adt) {
                maxAdt = Math.max(maxAdt, config.adt.count);
            }

            // INF
            if (config.inf) {
                maxInf = Math.max(maxInf, config.inf.count);
                if(config.inf?.rules.length) {
                    ageInf = config.inf.rules[0].value
                }
            }

            // MNR (cualquier key que empiece con "mnr")
            for (const key of Object.keys(config)) {
                if (key.startsWith("mnr")) {
                    const mnr = config[key];
                    if (mnr) {
                        maxMnr = Math.max(maxMnr, mnr.count);

                        // calcular edades mínimas y máximas
                        for (const rule of mnr.rules) {
                            const age = Number(rule.value);
                            if (rule.sign === ">") {
                                // regla de edad mínima
                                minAge = minAge === undefined ? age : Math.min(minAge, age);
                            }
                            if (rule.sign === ">=") {
                                // regla de edad mínima
                                minAge = minAge === undefined ? age : Math.min(minAge, age);
                            }
                            if (rule.sign === "<") {
                                // regla de edad máxima
                                maxAge = maxAge === undefined ? age : Math.max(maxAge, age);
                            }
                            if (rule.sign === "<=") {
                                // regla de edad máxima
                                maxAge = maxAge === undefined ? age : Math.max(maxAge, age);
                            }
                        }

                        mnrRules.push({rules: mnr.rules, type: key});
                    }
                }
            }
        }

        result[roomKey] = {
            adt: maxAdt,
            inf: maxInf + 1,
            age_inf: ageInf,
            mnr: {
                count: maxMnr + 1,
                min_age: minAge,
                max_age: maxAge,
            },
            mnr_rules: mnrRules
        };
    }

    return result;
}
