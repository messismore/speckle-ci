export default function (req) {
  return req.header('authorization').trim().split(' ')[1]
}
