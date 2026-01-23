import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SendModule = buildModule("SendModule", (m) => {
  const send = m.contract("Send");

  return { send };
});

export default SendModule;