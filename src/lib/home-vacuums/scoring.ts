import type {
  HomeBudgetBand,
  HomeBudgetLane,
  HomeVacuumAnswers,
  HomeVacuumClass,
  HomeVacuumProduct,
  HomeMatchScore,
} from "./types";

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function bandRank(band: HomeBudgetBand): number {
  const order: HomeBudgetBand[] = ["under_300", "300_600", "600_1000", "over_1000"];
  return order.indexOf(band);
}

function bandAllows(productBand: HomeBudgetBand, maxBand: HomeBudgetBand): boolean {
  return bandRank(productBand) <= bandRank(maxBand);
}

function mopStrength(mop: HomeVacuumProduct["mop"]): number {
  if (mop === "none") return 0;
  if (mop === "basic") return 55;
  if (mop === "hot_water") return 90;
  return 80;
}

export function scoreHomeVacuumUseCase(
  product: HomeVacuumProduct,
  answers: HomeVacuumAnswers,
): { score: number; reasons: string[]; cautions: string[] } {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 58;

  if (answers.floorMix === "hard") {
    if (product.mop !== "none") {
      score += 10;
      reasons.push("Mopping hardware helps hard floors when you want wet cleaning.");
    }
    if (product.suctionClass === "strong") score += 4;
  } else if (answers.floorMix === "carpet") {
    if (product.carpetBoost) {
      score += 12;
      reasons.push("Carpet boost matches a mostly-carpet home.");
    } else {
      score -= 14;
      cautions.push("No carpet boost — weaker fit for thick or wall-to-wall carpet.");
    }
    if (product.mop !== "none") {
      score -= 8;
      cautions.push("Mop hardware is unused on carpet-only homes.");
    }
    if (product.suctionClass === "strong") score += 8;
  } else {
    if (product.carpetBoost) score += 8;
    if (product.mop !== "none") score += 6;
    reasons.push("Mixed floors reward a robot that can vacuum carpet and mop hard floors.");
  }

  if (answers.pets === "dog" || answers.pets === "both") {
    if (product.petHair === "strong") {
      score += 14;
      reasons.push("Strong pet-hair rating for dog fur.");
    } else if (product.petHair === "ok") {
      score += 2;
    } else {
      score -= 16;
      cautions.push("Weak pet-hair pickup for a dog household.");
    }
  } else if (answers.pets === "cat") {
    if (product.petHair === "strong") {
      score += 8;
      reasons.push("Better than average on cat hair.");
    } else if (product.petHair === "poor") {
      score -= 8;
      cautions.push("Weak on hair; cat fur will clog cheaper brushes.");
    }
  }

  if (answers.hairLength === "long") {
    if (product.petHair === "strong") {
      score += 8;
      reasons.push("Long hair needs a brush and suction class that will not tangle constantly.");
    } else if (product.petHair === "poor") {
      score -= 12;
      cautions.push("Long hair is a known failure mode on this class of brush.");
    }
  }

  if (answers.mopNeeded === "yes") {
    const mop = mopStrength(product.mop);
    if (mop === 0) {
      score -= 28;
      cautions.push("You asked for mopping; this model is vacuum-only.");
    } else {
      score += Math.round(mop / 8);
      reasons.push("Has mopping hardware.");
    }
  } else if (answers.mopNeeded === "nice_to_have") {
    if (product.mop !== "none") {
      score += 8;
      reasons.push("Includes mopping if you decide you want it.");
    }
  } else if (answers.mopNeeded === "no" && product.mop !== "none") {
    score -= 10;
    cautions.push("Mop hardware is extra cost and dock size if you will not mop.");
  }

  if (answers.homeSize === "large") {
    if (product.selfEmpty) score += 6;
    if (product.suctionClass === "strong") score += 4;
    if (product.compact) score -= 6;
  } else if (answers.homeSize === "small" && product.compact) {
    score += 6;
    reasons.push("Compact body fits small homes and tight furniture.");
  }

  return { score: clamp(score), reasons, cautions };
}

export function scoreHomeVacuumValue(
  product: HomeVacuumProduct,
  answers: HomeVacuumAnswers,
): { score: number; reasons: string[]; cautions: string[] } {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 50;

  if (bandAllows(product.priceBand, answers.budgetBand)) {
    score += 28;
    reasons.push("Sits inside your budget band.");
    if (product.priceBand === answers.budgetBand) score += 8;
    else score += 4;
  } else {
    score -= 36;
    cautions.push("Priced above the budget you set.");
  }

  if (
    answers.mopNeeded === "no" &&
    product.class === "vacuum_only" &&
    bandAllows(product.priceBand, answers.budgetBand)
  ) {
    score += 6;
  }
  if (
    answers.mopNeeded === "yes" &&
    product.class === "mop_vac_combo" &&
    bandAllows(product.priceBand, answers.budgetBand)
  ) {
    score += 6;
  }

  return { score: clamp(score), reasons, cautions };
}

export function scoreHomeVacuumDeployment(
  product: HomeVacuumProduct,
  answers: HomeVacuumAnswers,
): { score: number; reasons: string[]; cautions: string[] } {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 55;

  if (answers.selfEmpty === "required") {
    if (product.selfEmpty) {
      score += 22;
      reasons.push("Includes a self-empty dock.");
    } else {
      score -= 30;
      cautions.push("No self-empty dock.");
    }
  } else if (answers.selfEmpty === "preferred" && product.selfEmpty) {
    score += 10;
    reasons.push("Self-empty is a convenience you said you would like.");
  }

  if (answers.multiFloor) {
    if (product.multiFloorMaps) {
      score += 14;
      reasons.push("Supports multi-floor maps.");
    } else {
      score -= 18;
      cautions.push("No multi-floor map support.");
    }
  }

  if (answers.obstacles === "high") {
    if (product.obstacleAvoidance === "camera_ai") {
      score += 18;
      reasons.push("Camera/AI obstacle avoidance for clutter and cables.");
    } else if (product.obstacleAvoidance === "lidar") {
      score += 4;
      reasons.push("Lidar maps rooms but will still eat some small objects.");
    } else {
      score -= 16;
      cautions.push("Basic bump-and-go struggle in cluttered rooms.");
    }
  } else if (answers.obstacles === "medium") {
    if (product.obstacleAvoidance === "basic") {
      score -= 6;
      cautions.push("Basic navigation will bump chairs and cables more often.");
    } else {
      score += 8;
    }
  } else if (product.obstacleAvoidance === "camera_ai") {
    score += 2;
  }

  if (answers.homeSize === "small" && product.compact) score += 6;

  return { score: clamp(score), reasons, cautions };
}

export function scoreHomeVacuumProduct(
  product: HomeVacuumProduct,
  answers: HomeVacuumAnswers,
): {
  score: HomeMatchScore;
  reasons: string[];
  cautions: string[];
} {
  const useCase = scoreHomeVacuumUseCase(product, answers);
  const economic = scoreHomeVacuumValue(product, answers);
  const deployment = scoreHomeVacuumDeployment(product, answers);
  const overall = clamp(0.45 * useCase.score + 0.35 * economic.score + 0.2 * deployment.score);

  return {
    score: {
      useCaseFit: useCase.score,
      economicFit: economic.score,
      deploymentFit: deployment.score,
      overallMatch: Math.round(overall * 10) / 10,
    },
    reasons: [...useCase.reasons, ...economic.reasons, ...deployment.reasons],
    cautions: [...useCase.cautions, ...economic.cautions, ...deployment.cautions],
  };
}

export function pickHomeVacuumClass(answers: HomeVacuumAnswers): HomeVacuumClass {
  if (answers.mopNeeded === "yes") return "mop_vac_combo";
  if (answers.mopNeeded === "nice_to_have" && answers.floorMix !== "carpet") return "mop_vac_combo";
  return "vacuum_only";
}

export function pickBudgetLane(answers: HomeVacuumAnswers): HomeBudgetLane {
  if (answers.budgetBand === "under_300" || answers.budgetBand === "300_600") return "budget";
  if (answers.budgetBand === "over_1000") return "premium";
  return "mid";
}
