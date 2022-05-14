// If nothing is on the allow list, everything is (!)
// Come at me, logicians
const isAllowed = (allowList, sample) =>
  sample === undefined ||
  allowList === undefined ||
  (Array.isArray(allowList) && !allowList.length) ||
  allowList.includes(sample)

export default ({ conditions = {}, context }) =>
  isAllowed(conditions.apps, context.commit.sourceApplication) &&
  isAllowed(conditions.branches, context.commit.branchName)
