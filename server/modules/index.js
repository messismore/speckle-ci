const moduleDirs = ['./auth']

export const init = async (app) => {
  console.log('Starting to initialise modules…')

  // Stage 1: initialise all modules
  await Promise.all(
    moduleDirs.map((dir) =>
      import(`${dir}/index.js`).then((module) => module.init(app))
    )
  )

  // Stage 2: finalise init all modules
  await Promise.all(
    moduleDirs.map((dir) =>
      import(`${dir}/index.js`).then((module) => module.finalize(app))
    )
  )

  console.log('All modules initialised!')
}
