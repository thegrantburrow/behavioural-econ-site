// coin-engine.js: shared coin-flip simulation and statistics.
// Used by the-coin-has-no-memory.html's four interactive widgets and by
// this site's coin-flip Live Session tools, so the same tested logic
// (not four separately-typed copies of it) underlies every one of them.
(function (global) {
  "use strict";

  function flip(p) {
    p = p === undefined ? 0.5 : p;
    return Math.random() < p ? "H" : "T";
  }

  function flipSequence(n, p) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(flip(p));
    return out;
  }

  function countHeads(seq) {
    var c = 0;
    for (var i = 0; i < seq.length; i++) if (seq[i] === "H") c++;
    return c;
  }

  function runs(seq) {
    if (!seq.length) return [];
    var out = [];
    var cur = seq[0],
      len = 1;
    for (var i = 1; i < seq.length; i++) {
      if (seq[i] === cur) {
        len++;
      } else {
        out.push(len);
        cur = seq[i];
        len = 1;
      }
    }
    out.push(len);
    return out;
  }

  function longestRun(seq) {
    var r = runs(seq);
    return r.length ? Math.max.apply(null, r) : 0;
  }

  function numRuns(seq) {
    return runs(seq).length;
  }

  // Lanczos approximation of ln(gamma(x)), accurate enough for the exact
  // binomial coefficients this file needs at n up to a few thousand.
  function logGamma(x) {
    var g = 7;
    var c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (x < 0.5) {
      return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    }
    x -= 1;
    var a = c[0];
    var t = x + g + 0.5;
    for (var i = 1; i < g + 2; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }

  function logBinomPmf(n, k, p) {
    if (k < 0 || k > n) return -Infinity;
    var logC = logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
    return logC + k * Math.log(p) + (n - k) * Math.log(1 - p);
  }

  function binomPmf(n, k, p) {
    return Math.exp(logBinomPmf(n, k, p));
  }

  // Exact two-tailed p-value for "k heads out of n flips of a coin with
  // true heads-probability p": the total probability of every outcome at
  // least as far from the expected count as k is, matching the same
  // convention the-coin-has-no-memory.html uses in its own worked
  // 61-heads-out-of-100 example (two-tailed, exact binomial, not a normal
  // approximation).
  function twoTailedP(n, k, p) {
    p = p === undefined ? 0.5 : p;
    var expected = n * p;
    var distK = Math.abs(k - expected);
    var total = 0;
    for (var i = 0; i <= n; i++) {
      if (Math.abs(i - expected) >= distK - 1e-9) total += binomPmf(n, i, p);
    }
    return Math.min(1, total);
  }

  function mean(arr) {
    if (!arr.length) return null;
    var s = 0;
    for (var i = 0; i < arr.length; i++) s += arr[i];
    return s / arr.length;
  }

  function stddevCountBinomial(n, p) {
    p = p === undefined ? 0.5 : p;
    return Math.sqrt(n * p * (1 - p));
  }

  // Wald 95% confidence interval for a proportion, in percentage points.
  // Deliberately the simple normal-approximation formula (observed
  // proportion plus or minus 1.96 standard errors), not the more
  // exact Wilson score interval, matching the same standard-error math
  // already used elsewhere in this file (stddevCountBinomial) so the
  // report's own worked examples stay internally consistent.
  function ciWald(heads, n, z) {
    z = z === undefined ? 1.96 : z;
    var phat = heads / n;
    var se = Math.sqrt((phat * (1 - phat)) / n);
    var margin = z * se;
    return {
      lo: Math.max(0, 100 * (phat - margin)),
      hi: Math.min(100, 100 * (phat + margin))
    };
  }

  // Exact statistical power: if the coin's true heads-probability really
  // is trueP (not 0.5), what fraction of n-flip samples would a two-tailed
  // test at the given alpha correctly flag as significant? Computed by
  // summing the coin's true-trueP probability of landing in whichever
  // outcomes a fair-coin two-tailed test would reject, not simulated,
  // for the same exactness twoTailedP already holds to.
  function power(n, trueP, alpha) {
    alpha = alpha === undefined ? 0.05 : alpha;
    var total = 0;
    for (var k = 0; k <= n; k++) {
      if (twoTailedP(n, k, 0.5) < alpha) total += binomPmf(n, k, trueP);
    }
    return total;
  }

  global.CoinEngine = {
    flip: flip,
    flipSequence: flipSequence,
    countHeads: countHeads,
    runs: runs,
    longestRun: longestRun,
    numRuns: numRuns,
    binomPmf: binomPmf,
    twoTailedP: twoTailedP,
    mean: mean,
    stddevCountBinomial: stddevCountBinomial,
    ciWald: ciWald,
    power: power
  };
})(window);
