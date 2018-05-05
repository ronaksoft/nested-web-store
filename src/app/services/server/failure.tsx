enum Failure {
  UNAUTHORIZED = -1,
  UNKNOWN = 0,
  ACCESS_DENIED = 1,
  UNAVAILABLE = 2,
  INVALID = 3,
  INCOMPLETE = 4,
  DUPLICATE = 5,
  LIMIT_REACHED = 6,
  TIMEOUT = 7,
  SESSION_EXPIRE = 8,
}

export default Failure;
