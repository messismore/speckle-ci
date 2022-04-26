const resolveObjectReference = (path, obj) =>
  path.reduce((o, ref) => o[ref], obj)

/*
    inputs: { model: ['context', 'results', 'someId', 'Speckle Data'] },
  =>
    inputs: { model: context.results.someId.['Speckle Data'] },
  */
export default (inputs, workflowRun) =>
  Object.fromEntries(
    [...inputs].map(([k, v]) => [k, resolveObjectReference(v, workflowRun)])
  )
