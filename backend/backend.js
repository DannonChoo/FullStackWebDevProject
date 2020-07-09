function basicComputeBestOption (options, budget) {
    let sortedOptions = options.sort((a, b)=> b.audiencecount / b.cost - a.audiencecount / a.cost);
    
    let remainingBudget = budget;
    let audienceReached = 0;
    const bestOptions = [];
  
    for (const option of sortedOptions) {
        const cost = Math.min(remainingBudget, option.cost);
        const ratio = option.audiencecount / option.cost;
        remainingBudget -= cost;
        let audienceKeepTrack = ratio * cost;
        audienceReached += audienceKeepTrack;
        bestOptions.push({optionId: option.optionid, amount: cost, audienceReached: audienceKeepTrack});
        if (remainingBudget === 0) break;
    }
    
    console.log(audienceReached);

    return {"result": bestOptions};
}

function advancedComputeBestOption (options, budget) {
    let sortedOptions = options.sort((a, b) => b.audiencecount / b.cost - a.audiencecount / a.cost);

    let remainingBudget = budget;
    const bestOptions = [];

    for (const option of sortedOptions) {
        if (remainingBudget < option.cost) break;
        remainingBudget -= option.cost;
        bestOptions.push({optionId: option.optionid, amount: option.cost, audienceReached: option.audiencecount});
        console.log(remainingBudget);
    }
    
    console.log(bestOptions);
    return {"result": bestOptions};
}
module.exports = {
    basicComputeBestOption,
    advancedComputeBestOption
}