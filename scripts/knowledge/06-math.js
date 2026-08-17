// 06-math.js - Algebra, Calculus, Statistics, Linear Algebra, Trigonometry, Geometry, Probability
module.exports = function(add) {

// Algebra (10 entries)
add('algebra_linear', `Linear Equations: ax+b=0 → x=-b/a. System: a1x+b1y=c1, a2x+b2y=c2. Substitution, elimination, matrix method. 2x+3y=7, x-y=1 → x=2,y=1. No solution if parallel lines. Infinite if same line.`, 'math');
add('algebra_quadratic', `Quadratic Formula: ax²+bx+c=0. x=(-b±√(b²-4ac))/(2a). Discriminant: b²-4ac. >0: two real roots. =0: one root. <0: complex roots. Factoring: x²-5x+6=(x-2)(x-3). Completing square: x²+6x+7=(x+3)²-2.`, 'math');
add('algebra_polynomial', `Polynomial: P(x)=aₙxⁿ+...+a₁x+a₀. Degree=n highest power. Roots: values where P(x)=0. Factor theorem: P(a)=0 means (x-a) is factor. Remainder: P(a)=remainder when divided by (x-a). Rational root theorem.`, 'math');
add('algebra_exponent', `Exponents: aᵐ·aⁿ=aᵐ⁺ⁿ. aᵐ/aⁿ=aᵐ⁻ⁿ. (aᵐ)ⁿ=aᵐⁿ. a⁰=1. a⁻ⁿ=1/aⁿ. a^(m/n)=ⁿ√aᵐ. Laws apply same for any base. Scientific notation: 3.5×10⁶=3500000. Negative exponents: 2⁻³=1/8.`, 'math');
add('algebra_logarithm', `Logarithms: logₐ(x)=y means aʸ=x. log₁₀(x)=common log. ln(x)=logₑ(x)=natural log. log(ab)=log(a)+log(b). log(a/b)=log(a)-log(b). log(aⁿ)=n·log(a). Change of base: logₐ(b)=log(b)/log(a). ln(e)=1. log(100)=2.`, 'math');
add('algebra_sequences', `Sequences: Arithmetic: aₙ=a₁+(n-1)d. Sum: Sₙ=n(a₁+aₙ)/2. Geometric: aₙ=a₁rⁿ⁻¹. Sum: Sₙ=a₁(1-rⁿ)/(1-r). Fibonacci: Fₙ=Fₙ₋₁+Fₙ₋₂. Sigma notation: Σᵢ₌₁ⁿ i=n(n+1)/2.`, 'math');
add('algebra_sets', `Set Theory: A∪B union. A∩B intersection. A\\B complement (set difference). A⊆B subset. A⊂B proper subset. A-prime=complement. |A| cardinality. De Morgan: (A∪B)-prime=A-prime∩B-prime. (A∩B)-prime=A-prime∪B-prime. Power set: all subsets. 2ⁿ elements.`, 'math');
add('algebra_modular', `Modular Arithmetic: a≡b(mod n) means n|(a-b). 17≡2(mod 5). (a+b) mod n=((a mod n)+(b mod n)) mod n. Fermat: aᵖ⁻¹≡1(mod p) if gcd(a,p)=1. RSA uses modular exponentiation. Clock arithmetic.`, 'math');
add('algebra_absolute', `Absolute Value: |x|=x if x≥0, -x if x<0. |x|<a → -a<x<a. |x|>a → x>a or x<-a. Triangle inequality: |a+b|≤|a|+|b|. Distance: |a-b|. |3-(-5)|=8. Solve |2x-3|=7 → x=5 or x=-2.`, 'math');
add('algebra_functions', `Functions: f(x)=2x+1. Domain: valid x values. Range: valid y values. One-to-one: each x maps unique y. Inverse f⁻¹: swap x and y, solve for y. Composition: (f∘g)(x)=f(g(x)). Linear f(x)=mx+b. Quadratic f(x)=ax²+bx+c.`, 'math');

// Calculus (8 entries)
add('calc_limits', `Limits: lim(x→a) f(x)=L means f(x) approaches L as x→a. lim(x→0) sin(x)/x=1. lim(x→∞) 1/x=0. lim(x→0) (1+x)^(1/x)=e. L'Hospital: lim 0/0 or ∞/∞ → differentiate top and bottom. Squeeze theorem. Epsilon-delta definition.`, 'math');
add('calc_derivative', `Derivatives: d/dx[xⁿ]=nxⁿ⁻¹. d/dx[sin(x)]=cos(x). d/dx[cos(x)]=-sin(x). d/dx[eˣ]=eˣ. d/dx[ln(x)]=1/x. Product rule: (fg)'=f'g+fg'. Quotient: (f/g)'=(f'g-fg')/g². Chain rule: d/dx[f(g(x))]=f'(g(x))·g'(x).`, 'math');
add('calc_integration', `Integrals: ∫xⁿdx=xⁿ⁺¹/(n+1)+C. ∫eˣdx=eˣ+C. ∫sin(x)dx=-cos(x)+C. ∫cos(x)dx=sin(x)+C. ∫(1/x)dx=ln|x|+C. Integration by parts: ∫u dv=uv-∫v du. u-substitution. Partial fractions. Definite: ∫ₐᵇ f(x)dx=F(b)-F(a).`, 'math');
add('calc_series', `Series: Σn=1∞ 1/n²=π²/6. Geometric: Σrⁿ=1/(1-r) for |r|<1. Taylor: f(x)=Σf⁽ⁿ⁾(a)/n!·(x-a)ⁿ. Maclaurin(a=0). eˣ=Σxⁿ/n!. sin(x)=Σ(-1)ⁿx²ⁿ⁺¹/(2n+1)!. Convergence: ratio test, comparison test.`, 'math');
add('calc_gradient', `Gradient/Partial Derivatives: ∂f/∂x rate of change in x direction. ∇f=(∂f/∂x,∂f/∂y) gradient vector. Direction of steepest ascent. ∇f=0 critical points. Hessian matrix for optimization. Gradient descent: x←x-α∇f.`, 'math');
add('calc_differential', `Differential Equations: dy/dx=f(x,y). First-order separable: dy/g(y)=f(x)dx. Linear: dy/dx+P(x)y=Q(x). Integrating factor. Second-order: ay″+by′+cy=0. Characteristic equation. Spring, circuit models.`, 'math');
add('calc_area', `Area Between Curves: ∫ₐᵇ |f(x)-g(x)| dx. Polar: (1/2)∫r²dθ. Volume of revolution: π∫[f(x)]²dx (disk), π∫(R²-r²)dx (washer). Surface area: 2π∫f(x)√(1+[f'(x)]²)dx.`, 'math');

// Statistics (10 entries)
add('stat_mean', `Mean: μ=Σxᵢ/n (population). x̄=Σxᵢ/n (sample). Weighted mean: Σwᵢxᵢ/Σwᵢ. Trimmed mean: remove extremes. Robust to outliers if trimmed. Better than median for symmetric data without outliers.`, 'math');
add('stat_median', `Median: middle value when sorted. Even n: average of two middle values. More robust to outliers than mean. Mode: most frequent value. Bimodal: two peaks. Skewed right: mean>median>mode.`, 'math');
add('stat_variance', `Variance: σ²=Σ(xᵢ-μ)²/N (population). s²=Σ(xᵢ-x̄)²/(n-1) (sample, Bessel correction). Standard deviation: σ=√variance. Coefficient of variation: CV=σ/μ (relative spread). Chebyshev: P(|X-μ|≥kσ)≤1/k².`, 'math');
add('stat_normal', `Normal Distribution: bell curve, μ center, σ width. f(x)=1/(σ√(2π))·e^(-(x-μ)²/(2σ²)). 68-95-99.7 rule. Z-score: z=(x-μ)/σ. Standard normal: μ=0,σ=1. P(Z<1.96)=0.975. Central limit theorem.`, 'math');
add('stat_probability', `Probability: 0≤P(A)≤1. P(A∪B)=P(A)+P(B)-P(A∩B). Conditional: P(A|B)=P(A∩B)/P(B). Independent: P(A∩B)=P(A)·P(B). Bayes: P(A|B)=P(B|A)·P(A)/P(B). Complement: P(A')=1-P(A).`, 'math');
add('stat_confidence', `Confidence Intervals: x̄±z·σ/√n. 95% CI: z=1.96. 99% CI: z=2.576. Wider interval more confidence. Margin of error=E=z·σ/√n. Sample size: n=(z·σ/E)². T-distribution for small samples.`, 'math');
add('stat_hypothesis', `Hypothesis Testing: H₀ null hypothesis. H₁ alternative. p-value: probability of observing data if H₀ true. Significance α=0.05. p<α reject H₀. Type I error (false positive). Type II error (false negative). Power=1-β.`, 'math');
add('stat_regression', `Linear Regression: y=β₀+β₁x+ε. β₁=Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)². β₀=ȳ-β₁x̄. R²=SSR/SST explained variance. Residuals: eᵢ=yᵢ-ŷᵢ. Multiple regression: y=β₀+β₁x₁+β₂x₂+. Multicollinearity problem.`, 'math');
add('stat_correlation', `Correlation: Pearson r=Σ(xᵢ-x̄)(yᵢ-ȳ)/√[Σ(xᵢ-x̄)²·Σ(yᵢ-ȳ)²]. r=1 perfect positive, r=-1 perfect negative, r=0 none. Spearman rank for non-linear. Correlation ≠ causation.`, 'math');
add('stat_sampling', `Sampling: Simple random. Stratified by group. Cluster by geographic. Systematic every k-th. Convenience. Sample bias. Selection bias. Non-response bias. Power analysis: determine sample size needed.`, 'math');

// Linear Algebra (6 entries)
add('linalg_vector', `Vectors: v=(v₁,v₂,...,vₙ). Dot product: u·v=Σuᵢvᵢ=|u||v|cos(θ). Cross product (3D): u×v=(u₂v₃-u₃v₂,u₃v₁-u₁v₃,u₁v₂-u₂v₁). Magnitude: |v|=√(v₁²+v₂²+...). Unit vector: v/|v|.`, 'math');
add('linalg_matrix', `Matrix: A=[aᵢⱼ] m×n. Addition: (A+B)ᵢⱼ=aᵢⱼ+bᵢⱼ. Scalar: (cA)ᵢⱼ=c·aᵢⱼ. Transpose: Aᵀⱼᵢ=aᵢⱼ. Identity: I with 1s on diagonal. Determinant: det(A)=ad-bc (2×2). Inverse: A⁻¹ exists if det≠0.`, 'math');
add('linalg_multiply', `Matrix Multiplication: (AB)ᵢⱼ=Σₖaᵢₖbₖⱼ. Rows×Columns. A(m×n)·B(n×p)=C(m×p). Commutative: AB≠BA generally. Associative: (AB)C=A(BC). Distributive: A(B+C)=AB+AC. Identity: AI=A.`, 'math');
add('linalg_eigen', `Eigenvalues/Eigenvectors: Av=λv. det(A-λI)=0 characteristic polynomial. Eigenvectors: directions preserved by transformation. Diagonalization: A=PDP⁻¹. PCA: eigenvectors of covariance matrix. Applications: stability, vibrations.`, 'math');
add('linalg_transform', `Linear Transformations: T:Rⁿ→Rᵐ. Rotation: [[cos,-sin],[sin,cos]]. Scaling: [[sx,0],[0,sy]]. Shear: [[1,k],[0,1]]. Composition: multiply matrices. Kernel: vectors mapped to zero. Image: all possible outputs.`, 'math');
add('linalg_svd', `SVD Decomposition: A=UΣVᵀ. U: left singular vectors. Σ: singular values (diagonal). V: right singular vectors. AᵀA=VΣ²Vᵀ. AAᵀ=UΣ²Uᵀ. Applications: dimensionality reduction, image compression, recommendation systems.`, 'math');

// Trigonometry (6 entries)
add('trig_basics', `Trig Functions: sin(θ)=opposite/hypotenuse. cos(θ)=adjacent/hypotenuse. tan(θ)=sin/cos=opposite/adjacent. csc=1/sin. sec=1/cos. cot=1/tan. Unit circle: sin²+cos²=1. 30-60-90 triangle: 1,√3,2. 45-45-90: 1,1,√2.`, 'math');
add('trig_identities', `Trig Identities: sin²θ+cos²θ=1. 1+tan²θ=sec²θ. 1+cot²θ=csc²θ. sin(2θ)=2sinθcosθ. cos(2θ)=cos²θ-sin²θ. sin(A±B)=sinAcosB±cosAsinB. cos(A±B)=cosAcosB∓sinAsinB. Sum-to-product formulas.`, 'math');
add('trig_inverse', `Inverse Trig: arcsin(x) or sin⁻¹(x) range [-π/2,π/2]. arccos(x) range [0,π]. arctan(x) range (-π/2,π/2). arctan2(y,x) full circle. sin(arcsin(x))=x for |x|≤1. Used in: finding angles, navigation, robotics.`, 'math');
add('trig_law', `Law of Sines: a/sinA=b/sinB=c/sinC. Law of Cosines: c²=a²+b²-2ab·cosC. Area=(1/2)ab·sinC. Solve triangles: given 3 elements (including at least one side). Navigation: bearing calculations.`, 'math');
add('trig_polar', `Polar Coordinates: r=distance,θ=angle. x=r·cosθ, y=r·sinθ. r=√(x²+y²), θ=arctan(y/x). Polar area: (1/2)∫r²dθ. Cardioid: r=a(1-cosθ). Rose: r=a·cos(nθ). Spiral: r=aθ. Convert integrals.`, 'math');

// Geometry (6 entries)
add('geo_area', `Area Formulas: Rectangle=lw. Triangle=(1/2)bh. Circle=πr². Ellipse=πab. Trapezoid=(a+b)h/2. Parallelogram=bh. Regular polygon=(1/2)·perimeter·apothem. Surface area: sphere=4πr², cylinder=2πrh+2πr².`, 'math');
add('geo_volume', `Volume: Cube=s³. Rectangular prism=lwh. Sphere=(4/3)πr³. Cylinder=πr²h. Cone=(1/3)πr²h. Pyramid=(1/3)Bh (B=base area). Torus=2π²Rr². Hemispheres. Frustum: (1/3)h(R²+Rr+r²).`, 'math');
add('geo_pythagorean', `Pythagorean Theorem: a²+b²=c². 3-4-5, 5-12-13, 8-15-17 triples. Distance formula: d=√((x₂-x₁)²+(y₂-y₁)²). Midpoint: ((x₁+x₂)/2,(y₁+y₂)/2). Circle equation: (x-h)²+(y-k)²=r².`, 'math');
add('geo_transform', `Geometric Transformations: Translation: (x+a,y+b). Rotation: R(θ). Reflection: across line. Dilation: scale factor k. Composition of transformations. Symmetry. Congruence vs similarity. Proportional reasoning.`, 'math');
add('geo_conic', `Conic Sections: Circle: x²+y²=r². Ellipse: x²/a²+y²/b²=1. Parabola: y=ax²+bx+c. Hyperbola: x²/a²-y²/b²=1. Foci, directrix, eccentricity. Applications: orbits, reflectors, cooling towers.`, 'math');
add('geo_topology', `Topology Basics: Euler characteristic: V-E+F=2 (polyhedra). Möbius strip: one side. Torus genus 1. Klein bottle non-orientable. Homeomorphism: stretch without tearing. Knot theory. Continuous deformation.`, 'math');

// Probability (6 entries)
add('prob_basics', `Probability Rules: P(A∪B)=P(A)+P(B)-P(A∩B). Mutually exclusive: P(A∩B)=0. P(A|B)=P(A∩B)/P(B). Bayes: P(A|B)=P(B|A)P(A)/P(B). Expected value: E(X)=Σxᵢpᵢ. Variance: Var(X)=E(X²)-[E(X)]².`, 'math');
add('prob_distributions', `Distributions: Bernoulli(p) coin. Binomial(n,p) n coins. Poisson(λ) rare events: P(X=k)=λᵏe⁻ᵏ/k!. Uniform continuous equal probability. Exponential(λ) waiting time. Normal(μ,σ²) bell curve. Chi-squared.`, 'math');
add('prob_expectation', `Expected Value: E(X)=ΣxP(X=x). E(aX+b)=aE(X)+b. E(X+Y)=E(X)+E(Y). Variance: Var(X)=E(X²)-[E(X)]². Var(aX+b)=a²Var(X). Standard deviation: σ=√Var(X). Covariance: Cov(X,Y)=E(XY)-E(X)E(Y).`, 'math');
add('prob_combo', `Combinatorics: Permutations: P(n,r)=n!/(n-r)!. Combinations: C(n,r)=n!/(r!(n-r)!). Pascal triangle. Binomial: (a+b)ⁿ=ΣC(n,k)aⁿ⁻ᵏbᵏ. Stars and bars: n+k-1 choose k-1. Inclusion-exclusion.`, 'math');
add('prob_markov', `Markov Chains: States with transition probabilities. P(Xₙ₊₁|Xₙ,...,X₀)=P(Xₙ₊₁|Xₙ). Transition matrix T. Stationary distribution: πT=π. PageRank: modified Markov chain. Absorbing states. Random walks.`, 'math');
add('prob_bayes', `Bayes Theorem: P(H|D)=P(D|H)·P(H)/P(D). Prior P(H). Likelihood P(D|H). Posterior P(H|D). Medical testing: P(disease|positive) using sensitivity/specificity. Spam filtering. Naive Bayes classifier.`, 'math');
};
