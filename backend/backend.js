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
        audienceReached += ratio * cost;
        bestOptions.push({optionId: option.optionid, amount: cost, audienceReached: audienceKeepTrack});
        if (remainingBudget === 0) break;
    }
    
    console.log(audienceReached);

    return bestOptions;
}

module.exports = {
    basicComputeBestOption,
}