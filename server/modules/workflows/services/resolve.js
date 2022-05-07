const resolveObjectReference = (path, obj) =>
  path.reduce((o, ref) => o[ref], obj)

const mapMapValues = (map, strategy) =>
  Object.fromEntries([...map].map(([k, v]) => [k, strategy(v)]))

/*
    inputs: { model: ['context', 'results', 'someId', 'Speckle Data'] },
  =>
    inputs: { model: context.results.someId.['Speckle Data'] },
  */
export const resolveInputs = (inputs, workflowRun) =>
  mapMapValues(inputs, (v) => resolveObjectReference(v, workflowRun))

/*
  options: { model: "Some String with ${results.magic} in it" },
=>
  options: { model: "Some String with whateverMagicHeld in it" },
*/
export const resolveOptions = (options, workflowRun) =>
  mapMapValues(options, (v) =>
    v.replace(/\$\{(.+?)\}/g, (_, p1) =>
      resolveObjectReference(p1.split('.'), workflowRun)
    )
  )
