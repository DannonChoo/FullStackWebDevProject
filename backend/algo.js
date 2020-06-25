optionOne = {
    'optionId': 1000000013,
    'companyId': 1111111111,
    'audienceCount': 1,
    'cost': 3
  };
  
  optionTwo = {
      'optionId': 1000000014,
      'companyId': 1100000001,
      'audienceCount': 2,
      'cost': 1
    };
  
  optionThree = {
    'optionId': 1000000015,
    'companyId': 1100000001,
    'audienceCount': 3,
    'cost': 4
  };

  optionFour = {
    'optionId': 1000000016,
    'companyId': 1100000001,
    'audienceCount': 4,
    'cost': 2
  };
  
  options = [optionOne, optionTwo, optionThree, optionFour];
  
  options = options.sort((a, b)=> b.audienceCount / b.cost - a.audienceCount / a.cost);
  
  console.log(options);
  
  const BUDGET = 4;
  
  let remainingBudget = BUDGET;
  let audienceReached = 0;
  const bestOptions = [];
  
  for (const option of options) {
    const cost = Math.min(remainingBudget, option.cost);
    const ratio = option.audienceCount / option.cost;
    remainingBudget -= cost;
    let audienceKeepTrack = ratio * cost;
    audienceReached += ratio * cost;
    bestOptions.push({optionId: option.optionId, amount: cost, audienceReached: audienceKeepTrack});
    if (remainingBudget === 0) break;
  }
  
  console.log(audienceReached);
  console.log(bestOptions);

