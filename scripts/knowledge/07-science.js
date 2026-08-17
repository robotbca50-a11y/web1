// 07-science.js - Physics, Chemistry, Biology, Earth Science, Astronomy
module.exports = function(add) {

// Physics (12 entries)
add('phys_newton', `Newton's Laws: 1. F=ma (Force=mass×acceleration). 2. F=ma for systems. 3. Equal and opposite reactions. Gravity: F=GMm/r². Weight: W=mg (g≈9.8 m/s²). Momentum: p=mv. Impulse: F·t=Δp.`, 'science');
add('phys_energy', `Energy: KE=(1/2)mv² kinetic. PE=mgh gravitational. PE=(1/2)kx² elastic. E=mc² mass-energy. Conservation of energy. Work: W=F·d·cos(θ). Power: P=W/t=Fv. Joule, Watt, eV units.`, 'science');
add('phys_waves', `Waves: v=fλ (velocity=frequency×wavelength). Transverse vs longitudinal. Sound: longitudinal, v=343 m/s air. Light: transverse, c=3×10⁸ m/s vacuum. Doppler effect: f'=f(v±v₀)/(v∓vₛ). Interference, diffraction.`, 'science');
add('phys_electricity', `Electricity: V=IR (Ohm's Law). Power: P=VI=I²R=V²/R. Series: R_total=R₁+R₂. Parallel: 1/R_total=1/R₁+1/R₂. Capacitor: C=Q/V. Energy: E=(1/2)CV². Coulomb: F=kq₁q₂/r².`, 'science');
add('phys_magnetism', `Magnetism: F=qvBsin(θ) force on charge. B field strength. Electromagnetism: Maxwell's equations. Faraday: EMF=-dΦ/dt. Inductance: EMF=-LdI/dt. Transformers: V₁/V₂=N₁/N₂. Right-hand rule.`, 'science');
add('phys_thermo', `Thermodynamics: 1st: ΔU=Q-W energy conservation. 2nd: entropy always increases. 3rd: T=0K unreachable. Heat: Q=mcΔT. Carnot efficiency: η=1-Tcold/Thot. PV=nRT ideal gas. Phase changes.`, 'science');
add('phys_relativity', `Special Relativity: Time dilation: t=t₀/√(1-v²/c²). Length contraction: L=L₀√(1-v²/c²). Mass increase: m=m₀/√(1-v²/c²). E=mc². General Relativity: gravity curves spacetime. GPS corrections needed.`, 'science');
add('phys_quantum', `Quantum Mechanics: E=hf energy of photon. h=6.626×10⁻³⁴ J·s Planck constant. De Broglie: λ=h/mv. Uncertainty: ΔxΔp≥ℏ/2. Superposition. Entanglement. Schrödinger equation. Quantum tunneling.`, 'science');
add('phys_optics', `Optics: Snell's law: n₁sinθ₁=n₂sinθ₂. Reflection: angle of incidence=angle of reflection. Total internal reflection. Lens: 1/f=1/v-1/u. Magnification: M=-v/u. Fiber optics. Prism dispersion.`, 'science');
add('phys_pressure', `Pressure: P=F/A. Atmospheric: 101325 Pa. P=ρgh fluid pressure. Pascal principle. Archimedes: buoyancy=weight of displaced fluid. Bernoulli: P+½ρv²+ρgh=constant. Applications: hydraulics, airplanes.`, 'science');
add('phys_nuclear', `Nuclear Physics: Radioactive decay: N=N₀e^(-λt). Half-life: t½=ln2/λ. Fission: heavy nucleus splits. Fusion: light nuclei combine. Mass defect: Δm→energy. Nuclear binding energy curve. Chain reactions.`, 'science');
add('phys_circuits', `AC Circuits: V(t)=V₀sin(ωt). ω=2πf. Impedance Z=√(R²+(XL-XC)²). XL=ωL. XC=1/ωC. Resonance: XL=XC. Power factor: cos(φ)=R/Z. Three-phase power. Transformers for transmission.`, 'science');

// Chemistry (10 entries)
add('chem_basics', `Chemistry Basics: Atom: protons+neutrons+electrons. Atomic number=protons. Mass number=protons+neutrons. Isotopes: same protons, different neutrons. Ions: protons≠electrons. Periodic table: groups, periods, blocks.`, 'science');
add('chem_bonding', `Chemical Bonding: Ionic: transfer electrons (NaCl). Covalent: share electrons (H₂O). Metallic: delocalized electrons (Fe). Polar covalent: unequal sharing (HCl). Hydrogen bonding. Van der Waals forces. Lewis structures.`, 'science');
add('chem_reactions', `Chemical Reactions: Balancing: same atoms each side. Synthesis: A+B→AB. Decomposition: AB→A+B. Single displacement: A+BC→AC+B. Double: AB+CD→AD+CB. Combustion: fuel+O₂→CO₂+H₂O. Redox.`, 'science');
add('chem_moles', `Moles & Stoichiometry: 1 mol=6.022×10²³ particles (Avogadro). Molar mass: grams per mole. n=m/M. Stoichiometry: ratios from balanced equation. Limiting reagent. Theoretical vs actual yield. % yield.`, 'science');
add('chem_acid_base', `Acids & Bases: pH=-log[H⁺]. pH<7 acidic, >7 basic. Strong acid: HCl→H⁺+Cl⁻. Weak acid: partial dissociation. Buffer: resists pH change. Henderson-Hasselbalch: pH=pKa+log([A⁻]/[HA]). Titration curves.`, 'science');
add('chem_organic', `Organic Chemistry: Carbon compounds. Hydrocarbons: alkanes(C-C single), alkenes(C=C), alkynes(C≡C). Functional groups: -OH alcohol, -COOH acid, -NH₂ amine, C=O carbonyl. Isomers: same formula, different structure.`, 'science');
add('chem_gas', `Gas Laws: PV=nRT (ideal gas). P₁V₁=P₂V₂ (Boyle). V₁/T₁=V₂/T₂ (Charles). P₁/T₁=P₂/T₂ (Gay-Lussac). Dalton: P_total=P₁+P₂+... Graham: rate∝1/√M. Real gases: van der Waals.`, 'science');
add('chem_electrochem', `Electrochemistry: Galvanic cell: spontaneous. Electrolytic: non-spontaneous. Anode=oxidation. Cathode=reduction. EMF=E_cat-E_an. Nernst: E=E°-(RT/nF)lnQ. Batteries: Li-ion, alkaline, fuel cells. Corrosion.`, 'science');
add('chem_kinetics', `Chemical Kinetics: Rate=k[A]ⁿ. Arrhenius: k=Ae^(-Ea/RT). Temperature doubles rate (roughly). Catalyst: lowers Ea without being consumed. Order: 0,1,2. Half-life: t½=ln2/k(first order). Rate-determining step.`, 'science');
add('chem_equilibrium', `Chemical Equilibrium: Le Chatelier: stress shifts equilibrium. Kc=[products]/[reactants]. Kp=Kc(RT)^Δn. ΔG=-RTlnK. Exothermic: heat product. Endothermic: heat reactant. Collision theory. Transition state.`, 'science');

// Biology (10 entries)
add('bio_cell', `Cell Biology: Eukaryotic: nucleus, organelles. Prokaryotic: no nucleus. Mitochondria: energy (ATP). Ribosomes: protein synthesis. ER: rough(ribosomes), smooth(lipids). Golgi: packaging. Lysosomes: digestion. Cell membrane: phospholipid bilayer.`, 'science');
add('bio_dna', `DNA & Genetics: Double helix. A-T, G-C base pairs. DNA→RNA (transcription)→Protein (translation). Codons: 3 bases=1 amino acid. 64 codons, 20 amino acids. Central dogma. Genotype→phenotype. Dominant/recessive alleles.`, 'science');
add('bio_evolution', `Evolution: Natural selection: survival of fittest. Variation, inheritance, selection, time. Speciation: new species form. Adaptation. Convergent/divergent evolution. Hardy-Weinberg equilibrium. Fossil evidence. DNA evidence.`, 'science');
add('bio_ecology', `Ecosystems: Producers→consumers→decomposers. Food chains/webs. Energy flow: 10% rule. Nutrient cycles: carbon, nitrogen, water. Biomes: tropical rainforest, desert, tundra, coral reef. Biodiversity. Succession.`, 'science');
add('bio_anatomy', `Human Body Systems: Skeletal: support, blood cells. Muscular: movement, contraction. Circulatory: heart, blood vessels. Respiratory: lungs, gas exchange. Digestive: nutrients, absorption. Nervous: brain, nerves. Endocrine: hormones.`, 'science');
add('bio_photosynthesis', `Photosynthesis: 6CO₂+6H₂O+light→C₆H₁₂O₆+6O₂. Light reactions: thylakoid, water splits, ATP+NADPH. Calvin cycle: stroma, CO₂ fixed into glucose. Chlorophyll absorbs red/blue light. Cellular respiration reverses.`, 'science');
add('bio_protein', `Protein Synthesis: DNA→mRNA(transcription in nucleus)→ribosome(translation)→protein. mRNA codons. tRNA anticodons carry amino acids. Start codon AUG. Stop codons UAA,UAG,UGA. Post-translational modification. Folding.`, 'science');
add('bio_immunology', `Immune System: Innate: barriers, phagocytes, inflammation. Adaptive: B cells(antibodies), T cells(kill infected). Memory cells. Vaccination: expose without disease. MHC presentation. Autoimmune: self-attack. HIV attacks T cells.`, 'science');
add('bio_microbiology', `Microbiology: Bacteria: prokaryotic, binary fission. Virus: DNA/RNA in protein coat, requires host. Fungi: eukaryotic, chitin cell wall. Archaea: extremophiles. Antibiotics kill bacteria, not viruses. Superbugs: resistance.`, 'science');
add('bio_genetics_tools', `Genetic Tools: PCR: amplify DNA. Gel electrophoresis: separate by size. CRISPR-Cas9: gene editing. Gel electrophoresis: DNA fragments separate by size. Sequencing: Sanger, next-gen. CRISPR: cut specific DNA sequences. Cloning.`, 'science');

// Earth Science & Astronomy (8 entries)
add('earth_geology', `Geology: Rock cycle: igneous→sedimentary→metamorphic. Plate tectonics: earthquakes, volcanoes. Mohs hardness scale. Minerals: crystal structure. Erosion, weathering. Fossils in sedimentary. Seismograph measures waves.`, 'science');
add('earth_weather', `Weather & Climate: Convection currents. Humidity, precipitation, pressure. Cloud types: cirrus(high), cumulus(flat), stratus(layered), cumulonimbus(storm). Climate zones: tropical, temperate, polar. Greenhouse effect.`, 'science');
add('earth_ocean', `Oceanography: Salinity: 3.5%. Thermohaline circulation. Tides: moon+sun gravity. Waves: wind-driven. Currents: Gulf Stream, El Niño. Marine zones: intertidal, pelagic, abyssal. Coral reefs. Deep sea vents.`, 'science');
add('astro_solar', `Solar System: Sun: G-type, 4.6 billion years. Inner rocky: Mercury,Venus,Earth,Mars. Outer gas: Jupiter,Saturn,Uranus,Neptune. Asteroid belt. Kuiper belt. Oort cloud. Pluto: dwarf planet.`, 'science');
add('astro_stars', `Stars: Nebula→protostar→main sequence→red giant→white dwarf/neutron/black hole. Hertzsprung-Russell diagram. Luminosity, temperature, spectral class OBAFGKM. Red supergiant: Betelgeuse. Neutron star density.`, 'science');
add('astro_galaxy', `Galaxies: Spiral (Milky Way), elliptical, irregular. Milky Way: 100K light-years, 100-400 billion stars. Sagittarius A*: supermassive black hole. Andromeda closest large galaxy. Galaxy clusters. Dark matter.`, 'science');
add('astro_cosmo', `Cosmology: Big Bang 13.8 billion years ago. Cosmic microwave background. Expansion: Hubble's law. Dark energy accelerating expansion. Multiverse hypothesis. Fate: Big Crunch, Big Rip, or heat death.`, 'science');
add('astro_observation', `Observational Astronomy: Light pollution: Bortle scale. Telescope types: refractor, reflector, Dobsonian. Magnification=objective focal/eyepiece focal. Best objects: Moon, Jupiter, Saturn, Orion Nebula. Meteor showers.`, 'science');
};
