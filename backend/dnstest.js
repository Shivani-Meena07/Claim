const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const hostname =
  "_mongodb._tcp.claimcluster.hynogg6.mongodb.net";

console.log("Testing DNS for:", hostname);

dns.resolveSrv(hostname, (error, addresses) => {
  if (error) {
    console.error("❌ DNS ERROR:");
    console.error(error);
    return;
  }

  console.log("✅ DNS RESOLUTION WORKS");
  console.log(addresses);
});