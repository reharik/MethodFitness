function InspectionResult(decision, description, tcpEndPoint, secureTcpEndPoint) {
  this.decision = decision;
  this.description = description;
  this.tcpEndPoint = tcpEndPoint || null;
  this.secureTcpEndPoint = secureTcpEndPoint || null;
}

module.exports = InspectionResult;
