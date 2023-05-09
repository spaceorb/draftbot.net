const enforceHTTPS = (req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }
  next();
};
const redirectToNonWWW = (req, res, next) => {
  if (req.headers.host.slice(0, 4) === "www.") {
    const nonWWWHost = req.headers.host.slice(4);
    return res.redirect(["https://", nonWWWHost, req.url].join(""));
  }
  next();
};

module.exports = {
  enforceHTTPS,
  redirectToNonWWW,
};
