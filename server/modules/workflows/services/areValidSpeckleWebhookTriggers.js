const TRIGGERS = [
  'branch_create',
  'branch_delete',
  'branch_update',
  'commit_create',
  'commit_delete',
  'commit_update',
  'stream_delete',
  'stream_update',
  'commit_receive',
  'stream_permissions_add',
  'stream_permissions_remove',
]

export default (triggers) =>
  triggers.every((trigger) => TRIGGERS.includes(trigger))
