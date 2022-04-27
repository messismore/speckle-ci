export default {
  name: 'Generate Carbon Report',
  description: "Return the tally of the structure's embodied energy in GWP.",
  icon: 'mdi-leaf',
  arguments: [
    {
      id: 'model',
    },
  ],
  outputs: [{ name: 'Embodied Carbon' }, { name: 'Breakdown' }],
  run: async ({ inputs }) => {
    /*
https://github.com/specklesystems/SpeckleHackathon-SpeckleReports/tree/master/server/src/speckle_calculator/core
    */
    const MATERIAL_PROPERTIES = {
      Aluminium: { density: 2700, kgCO2e: 9.16 },
      Concrete: { density: 2400, kgCO2e: 0.12 },
      Steel: { density: 7800, kgCO2e: 1.46 },
      Timber: { density: 650, kgCO2e: 0.72 },
    }
    const FACTORS = { mm: 1e-9, cm: 1e-6, m: 1, km: 1e9 }

    const toCubicMeters = (element) => {
      if (!FACTORS[element.units])
        throw new Error(
          `Unknown unit: "${element.units}". Could not convert it to m^3.`
        )
      element.volume *= FACTORS[element.units]
      element.units = 'm'

      return element
    }

    const calculateGWP = (element) => {
      const { density, kgCO2e } = MATERIAL_PROPERTIES[element.material]
      element.GWP = element.volume * density * kgCO2e
      return element
    }

    const tally = (previous, current) => (previous += current.GWP)

    const sortMaterials = (previous, current) => {
      if (!previous.has(current.material)) previous.set(current.material, [])
      previous.get(current.material).push({
        volume: current.volume,
        units: current.units,
        GWP: current.GWP,
      })
      return previous
    }

    const elements = await inputs.model['@data']
      .flat()
      .filter(
        (element) =>
          MATERIAL_PROPERTIES[element.material] &&
          element.volume &&
          element.units
      )
      .map(toCubicMeters)
      .map(calculateGWP)

    const breakdown = new Map(
      Array.from(elements.reduce(sortMaterials, new Map()), ([k, v]) => [
        k,
        v.reduce(tally, 0),
      ])
    )

    return {
      'Embodied Carbon': elements.reduce(tally, 0),
      Breakdown: breakdown,
    }
  },
}
